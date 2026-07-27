import hashlib
import time
import json
import secrets
from typing import Dict, Any, Tuple
from app.config import WEB3_PROVIDER_URL, CONTRACT_ADDRESS

class AgriChainLedgerEngine:
    def __init__(self):
        self.provider_url = WEB3_PROVIDER_URL
        self.contract_address = CONTRACT_ADDRESS

    def generate_batch_id(self) -> str:
        """Generates a unique QR-scanable Batch ID (e.g. AGRI-2026-A8F9)"""
        random_suffix = secrets.token_hex(2).upper()
        return f"AGRI-2026-{random_suffix}"

    def compute_sha256(self, payload: str) -> str:
        """Computes 0x-prefixed 64-character SHA-256 / Keccak256 hash"""
        h = hashlib.sha256(payload.encode('utf-8')).hexdigest()
        return f"0x{h}"

    def create_genesis_block(self, batch_id: str, crop_name: str, quantity: float, farmer_name: str) -> Tuple[str, str, int]:
        """Creates initial block and transaction hash for new farmer batch"""
        timestamp = int(time.time())
        raw_payload = f"{batch_id}:{crop_name}:{quantity}:{farmer_name}:{timestamp}"
        tx_hash = self.compute_sha256(f"TX:{raw_payload}")
        prev_hash = "0x0000000000000000000000000000000000000000000000000000000000000000"
        
        block_content = f"BLOCK:1:{batch_id}:{tx_hash}:{prev_hash}:{timestamp}"
        current_hash = self.compute_sha256(block_content)
        return current_hash, tx_hash, 1

    def create_next_block(self, batch_id: str, prev_hash: str, prev_block_num: int, action: str, actor_role: str, owner: str) -> Tuple[str, str, int]:
        """Creates subsequent chain block linking to previous hash"""
        block_num = prev_block_num + 1
        timestamp = int(time.time())
        raw_tx = f"TX:{batch_id}:{action}:{actor_role}:{owner}:{timestamp}"
        tx_hash = self.compute_sha256(raw_tx)

        block_payload = f"BLOCK:{block_num}:{batch_id}:{tx_hash}:{prev_hash}:{timestamp}"
        current_hash = self.compute_sha256(block_payload)
        return current_hash, tx_hash, block_num

    def compute_merkle_root(self, hashes: list) -> str:
        """Computes Merkle Tree Root Hash from transaction hashes"""
        if not hashes:
            return "0x" + "0"*64
        if len(hashes) == 1:
            return hashes[0]
        
        new_level = []
        for i in range(0, len(hashes), 2):
            left = hashes[i]
            right = hashes[i+1] if i + 1 < len(hashes) else left
            combined = self.compute_sha256(left + right)
            new_level.append(combined)
        return self.compute_merkle_root(new_level)

blockchain_engine = AgriChainLedgerEngine()
