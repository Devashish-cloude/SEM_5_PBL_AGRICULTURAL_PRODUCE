import sys
import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base
from app import models

def migrate(target_url: str):
    # Ensure correct driver for PostgreSQL (force pg8000 pure-Python driver)
    if target_url.startswith("postgres://"):
        target_url = target_url.replace("postgres://", "postgresql+pg8000://", 1)
    elif target_url.startswith("postgresql://"):
        target_url = target_url.replace("postgresql://", "postgresql+pg8000://", 1)

    print("Connecting to local SQLite database...")
    local_db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "agrichain.db"))
    if not os.path.exists(local_db_path):
        print(f"Error: Local SQLite database not found at {local_db_path}")
        return
    
    sqlite_engine = create_engine(f"sqlite:///{local_db_path}")
    SqliteSession = sessionmaker(bind=sqlite_engine)
    sqlite_session = SqliteSession()

    print("Connecting to target Supabase PostgreSQL database...")
    try:
        import ssl
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        pg_engine = create_engine(target_url, connect_args={"ssl_context": ssl_context})
        PgSession = sessionmaker(bind=pg_engine)
        pg_session = PgSession()
        
        # Test connection
        pg_engine.connect()
        print("Connected to Supabase successfully!")
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return

    # Create tables if they don't exist
    print("Creating tables on Supabase if not present...")
    Base.metadata.create_all(bind=pg_engine)

    # Tables in correct order of dependency
    migration_classes = [
        models.User,
        models.FarmerBatch,
        models.TransportLog,
        models.WarehouseLog,
        models.RetailerLog,
        models.TransactionHistory,
        models.BlockchainBlock
    ]

    # Clean existing data first in reverse order to avoid FK issues
    print("Cleaning existing data on target database...")
    for model_cls in reversed(migration_classes):
        try:
            num_deleted = pg_session.query(model_cls).delete()
            print(f"  Cleared {num_deleted} rows from {model_cls.__tablename__}")
        except Exception as e:
            print(f"  Warning: Could not clear {model_cls.__tablename__}: {e}")
            pg_session.rollback()
    
    pg_session.commit()

    # Migrate data
    print("Migrating data table by table...")
    for model_cls in migration_classes:
        table_name = model_cls.__tablename__
        print(f"Migrating {table_name}...")
        
        sqlite_items = sqlite_session.query(model_cls).all()
        if not sqlite_items:
            print(f"  No rows found in local {table_name}.")
            continue
        
        print(f"  Found {len(sqlite_items)} rows locally. Uploading to Supabase...")
        
        for item in sqlite_items:
            # Create a new instance with the same attributes
            item_data = {c.name: getattr(item, c.name) for c in model_cls.__table__.columns}
            new_item = model_cls(**item_data)
            pg_session.add(new_item)
            
        try:
            pg_session.commit()
            print(f"  Successfully migrated {len(sqlite_items)} rows to {table_name}!")
        except Exception as e:
            pg_session.rollback()
            print(f"  Error migrating {table_name}: {e}")
            return

    sqlite_session.close()
    pg_session.close()
    print("\nDATABASE MIGRATION TO SUPABASE COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate_to_postgres.py <supabase_postgresql_connection_uri>")
        sys.exit(1)
        
    migrate(sys.argv[1])
