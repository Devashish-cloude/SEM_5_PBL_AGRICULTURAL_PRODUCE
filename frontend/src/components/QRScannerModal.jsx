import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Search, Camera, CheckCircle2 } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    onScanSuccess(manualId.trim());
    onClose();
  };

  const handleSimulateCameraScan = () => {
    setIsScanning(true);
    setScanMessage('Accessing optical camera scanner...');
    
    setTimeout(() => {
      setScanMessage('Scanning AgriChain QR Matrix...');
    }, 1000);

    setTimeout(() => {
      // Auto fill or trigger sample batch scan
      setIsScanning(false);
      onScanSuccess(manualId.trim() || 'AGRI-2026-A8F9');
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-agri-100 dark:bg-agri-950 text-agri-600 dark:text-agri-400 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Scan Batch QR Code
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Position QR code inside viewfinder or enter Batch ID
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scanner Body */}
          <div className="p-6 space-y-6">
            
            {/* Camera Viewfinder Simulation */}
            <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-agri-500/60 text-white">
              {isScanning ? (
                <div className="flex flex-col items-center gap-3 text-center p-4">
                  <div className="w-12 h-12 rounded-full border-4 border-agri-500 border-t-transparent animate-spin" />
                  <span className="text-sm font-semibold text-agri-400 animate-pulse">{scanMessage}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-agri-400 shadow-inner">
                    <Camera className="w-8 h-8" />
                  </div>
                  <button
                    onClick={handleSimulateCameraScan}
                    className="px-4 py-2 text-xs font-bold text-white bg-agri-600 hover:bg-agri-700 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Activate Optical Scanner
                  </button>
                </div>
              )}
              {/* Corner Viewfinder Overlays */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-agri-500 rounded-tl" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-agri-500 rounded-tr" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-agri-500 rounded-bl" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-agri-500 rounded-br" />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              <span className="absolute bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                OR MANUAL ENTRY
              </span>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter Batch ID String
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. AGRI-2026-A8F9"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setManualId('AGRI-2026-A8F9')}
                  className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Use Sample ID
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 font-bold text-sm text-white bg-agri-600 hover:bg-agri-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Verify Batch ID
                </button>
              </div>
            </form>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
