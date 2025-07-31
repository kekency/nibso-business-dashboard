import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRCodeScannerProps {
    onSuccess: (decodedText: string) => void;
    onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onSuccess, onClose }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const qrCodeScanner = new Html5Qrcode("qr-reader");
        scannerRef.current = qrCodeScanner;
        
        const startScanner = async () => {
            try {
                await qrCodeScanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText, decodedResult) => {
                        onSuccess(decodedText);
                        onClose();
                    },
                    (errorMessage) => {
                        // handle scan error, usually ignored.
                    }
                );
            } catch (err) {
                 console.error("Error starting QR scanner:", err);
                 // Fallback for devices without a back camera
                 try {
                     await qrCodeScanner.start(
                         {}, // default camera
                         { fps: 10, qrbox: { width: 250, height: 250 } },
                         (decodedText, decodedResult) => {
                            onSuccess(decodedText);
                            onClose();
                         },
                         (errorMessage) => {}
                     );
                 } catch (fallbackErr) {
                     console.error("Fallback QR scanner start failed:", fallbackErr);
                     alert("Could not start QR scanner. Please ensure your browser has camera permissions.");
                     onClose();
                 }
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
            }
        };
    }, [onSuccess, onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <div id="qr-reader" className="w-full max-w-md bg-black rounded-lg overflow-hidden"></div>
             <button
                onClick={onClose}
                className="mt-6 bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
                Cancel Scan
            </button>
        </div>
    );
};

export default QRCodeScanner;