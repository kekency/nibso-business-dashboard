import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { InventoryItem } from '../types';

interface QRCodeDisplayModalProps {
    item: InventoryItem;
    onClose: () => void;
}

const QRCodeDisplayModal: React.FC<QRCodeDisplayModalProps> = ({ item, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, item.id, { width: 256, margin: 2 }, (error) => {
                if (error) console.error(error);
            });
        }
    }, [item.id]);

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const dataUrl = canvas.toDataURL('image/png');
            printWindow.document.write(`
                <html>
                    <head><title>Print QR Code</title></head>
                    <body style="text-align:center; margin-top: 50px; font-family: sans-serif;">
                        <h2>${item.name}</h2>
                        <img src="${dataUrl}" />
                        <p>${item.id}</p>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-[var(--card)] rounded-xl shadow-2xl p-8 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.name}</h2>
                <p className="text-[var(--text-muted)] mb-4 font-mono text-sm">{item.id}</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                    <canvas ref={canvasRef} />
                </div>
                <div className="flex justify-center gap-4 mt-8">
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors">Close</button>
                    <button onClick={handlePrint} className="bg-[var(--primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">Print</button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDisplayModal;