import React, { useState, useContext } from 'react';
import { read, utils } from 'xlsx';
import { InventoryContext } from '../contexts/InventoryContext';
import { SecurityContext } from '../contexts/SecurityContext';
import { InventoryItem } from '../types';

type ParsedItem = Omit<InventoryItem, 'id'>;

const DataImportDashboard: React.FC = () => {
    const { addBulkInventoryItems } = useContext(InventoryContext);
    const { logSecurityEvent } = useContext(SecurityContext);
    const [fileName, setFileName] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>({
        type: 'info',
        text: 'Select an Excel (.xlsx) or CSV (.csv) file to import inventory items.'
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setMessage({ type: 'info', text: 'Processing file...' });

        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet) as any[];

            const parsedItems: ParsedItem[] = [];
            for (const row of jsonData) {
                const name = row.name || row.Name || row.product_name;
                const category = row.category || row.Category;
                const stock = parseFloat(row.stock || row.Stock || row.quantity || row.Quantity);
                const price = parseFloat(row.price || row.Price);
                const imageUrl = row.imageUrl || row.image_url || row['Image URL'];

                if (name && category && !isNaN(stock) && !isNaN(price)) {
                    parsedItems.push({ name, category, stock, price, imageUrl });
                }
            }
            
            if (parsedItems.length === 0) {
                 throw new Error('No valid items found. Please check the file format. Required columns: name, category, stock, price.');
            }

            addBulkInventoryItems(parsedItems);
            logSecurityEvent({ severity: 'Low', description: `Imported ${parsedItems.length} inventory items from ${file.name}.` });
            setMessage({ type: 'success', text: `Successfully imported ${parsedItems.length} items from ${file.name}.` });
        } catch (err) {
            console.error(err);
            const error = err instanceof Error ? err.message : 'An unknown error occurred.';
            setMessage({ type: 'error', text: `Failed to import file. ${error}` });
        } finally {
            e.target.value = ''; // Reset file input
        }
    };
    
    const getMessageClass = () => {
        if (!message) return '';
        switch (message.type) {
            case 'success': return 'text-green-400 bg-green-900/50';
            case 'error': return 'text-red-400 bg-red-900/50';
            case 'info': return 'text-sky-400 bg-sky-900/50';
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Import Inventory from File</h2>
                <p className="text-[var(--text-muted)] mb-6">Upload an Excel (.xlsx) or CSV (.csv) file to add items to your inventory in bulk.</p>
                
                <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h2l2 2h4a2 2 0 012 2v2m-6 6l-4-4m0 0l-4 4m4-4v12" />
                            </svg>
                            <span className="text-[var(--primary)] font-semibold">Click to upload a file</span>
                            <span className="text-[var(--text-muted)] text-sm">or drag and drop</span>
                            {fileName && <p className="text-[var(--text-primary)] mt-4">Selected: {fileName}</p>}
                        </div>
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .csv" onChange={handleFileChange} />
                </div>
                
                {message && (
                    <div className={`mt-6 p-4 rounded-lg text-sm font-medium text-center ${getMessageClass()}`}>
                        {message.text}
                    </div>
                )}
            </div>

             <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">File Format Instructions</h3>
                <p className="text-[var(--text-muted)] mb-4">Your file should contain the following columns. The column headers are flexible, but must contain these keywords:</p>
                <ul className="list-disc list-inside text-[var(--text-muted)] space-y-2">
                    <li><span className="font-semibold text-[var(--text-primary)]">name</span> (or `product_name`, `Name`) - The name of the item.</li>
                    <li><span className="font-semibold text-[var(--text-primary)]">category</span> (or `Category`) - The item's category.</li>
                    <li><span className="font-semibold text-[var(--text-primary)]">stock</span> (or `quantity`, `Stock`, `Quantity`) - The current stock level.</li>
                    <li><span className="font-semibold text-[var(--text-primary)]">price</span> (or `Price`) - The price per item.</li>
                    <li><span className="font-semibold text-[var(--text-primary)]">imageUrl</span> (or `image_url`, `Image URL`) - (Optional) A direct URL to the product's image.</li>
                </ul>
            </div>
        </div>
    );
};

export default DataImportDashboard;