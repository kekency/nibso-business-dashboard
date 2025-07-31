import React, { useState, useContext, useMemo } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import { BusinessContext } from '../contexts/BusinessContext';
import { SalesContext } from '../contexts/SalesContext';
import { TransactionItem, View, BusinessType, Promotion, LoyaltyMember } from '../types';
import { generateReceipt } from '../services/geminiService';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { PromotionsContext } from '../contexts/PromotionsContext';
import { LoyaltyContext } from '../contexts/LoyaltyContext';
import { LogisticsContext } from '../contexts/LogisticsContext';

interface PointOfSaleDashboardProps {
    openModal: (view: View, data: any) => void;
}

const PointOfSaleDashboard: React.FC<PointOfSaleDashboardProps> = ({ openModal }) => {
    const { inventory, updateStock, getItemById } = useContext(InventoryContext);
    const { profile } = useContext(BusinessContext);
    const { recordTransaction } = useContext(SalesContext);
    const { addShipment } = useContext(LogisticsContext);
    const { activePromotions = [] }: { activePromotions?: Promotion[] } = useContext(PromotionsContext);
    const { loyaltyMembers = [], addPoints = () => {} }: { loyaltyMembers?: LoyaltyMember[], addPoints?: (memberId: string, points: number) => void } = useContext(LoyaltyContext);
    
    const [cart, setCart] = useState<TransactionItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [loyaltySearch, setLoyaltySearch] = useState('');
    const [activeLoyaltyMember, setActiveLoyaltyMember] = useState<LoyaltyMember | null>(null);

    // Delivery State
    const [isDelivery, setIsDelivery] = useState(false);
    const [deliveryCustomerName, setDeliveryCustomerName] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryCost, setDeliveryCost] = useState('');

    const isSupermarket = profile.businessType === BusinessType.Supermarket;

    const categories = useMemo(() => ['All', ...new Set(inventory.map(i => i.category))], [inventory]);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => 
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id === searchTerm) &&
            (category === 'All' || item.category === category) &&
            item.stock > 0
        );
    }, [inventory, searchTerm, category]);
    
    const addToCart = (item: TransactionItem) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                 if (existingItem.quantity < existingItem.stock) {
                    return currentCart.map(cartItem => 
                        cartItem.id === item.id 
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                    );
                }
                return currentCart;
            }
            return [...currentCart, { ...item, quantity: 1 }];
        });
    };
    
    const handleScanSuccess = (decodedText: string) => {
        const item = getItemById(decodedText);
        if (item) {
            addToCart(item as TransactionItem);
        } else {
            alert("Product not found!");
        }
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        const itemInInventory = inventory.find(i => i.id === itemId);
        if (!itemInInventory || isNaN(newQuantity)) return;
        
        if (newQuantity <= 0) {
            setCart(cart.filter(item => item.id !== itemId));
        } else if (newQuantity > itemInInventory.stock) {
            setCart(cart.map(item => item.id === itemId ? { ...item, quantity: itemInInventory.stock } : item));
        } else {
            setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
        }
    };
    
    const { subtotal, taxAmount, total, totalDiscount } = useMemo(() => {
        let subtotal = 0;
        let totalDiscount = 0;

        cart.forEach(item => {
            let itemPrice = item.price;
            const applicablePromotion = activePromotions.find(p => 
                (p.target === 'item' && p.targetId === item.id) || 
                (p.target === 'category' && p.targetId === item.category)
            );

            if (isSupermarket && applicablePromotion) {
                const discountAmount = item.price * (applicablePromotion.value / 100);
                totalDiscount += discountAmount * item.quantity;
                itemPrice -= discountAmount;
            }
            subtotal += itemPrice * item.quantity;
        });

        const taxAmount = subtotal * (profile.taxRate / 100);
        const parsedDeliveryCost = parseFloat(deliveryCost) || 0;
        const total = subtotal + taxAmount + (isDelivery ? parsedDeliveryCost : 0);
        return { subtotal, taxAmount, total, totalDiscount };
    }, [cart, profile.taxRate, activePromotions, isSupermarket, isDelivery, deliveryCost]);

    const finalizeSale = async () => {
        if (cart.length === 0 || isFinalizing) return;
        setIsFinalizing(true);
        
        const transactionId = `txn_${new Date().getTime()}`;

        if (isDelivery) {
            if (!deliveryCustomerName || !deliveryAddress || !deliveryCost) {
                alert("Please fill in all delivery details.");
                setIsFinalizing(false);
                return;
            }
            addShipment({
                customerName: deliveryCustomerName,
                destination: deliveryAddress,
                estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
                sourceTransactionId: transactionId,
            });
        }
        
        recordTransaction(total, 1, cart);
        updateStock(cart);
        
        if (isSupermarket && activeLoyaltyMember) {
            // Award 1 point per 100 currency units spent
            const pointsToAdd = Math.floor(total / 100);
            addPoints(activeLoyaltyMember.id, pointsToAdd);
        }

        try {
            const receiptText = await generateReceipt(
                cart, 
                profile,
                isDelivery ? deliveryCustomerName : (activeLoyaltyMember?.name || ''),
                isDelivery ? { address: deliveryAddress, cost: parseFloat(deliveryCost) } : undefined
            );
            const printWindow = window.open('', '_blank', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Print Receipt</title>');
                printWindow.document.write('<style>body { font-family: monospace; line-height: 1.4; margin: 20px; } pre { white-space: pre-wrap; word-wrap: break-word; }</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(`<pre>${receiptText}</pre>`);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            } else {
                alert('Could not open print window. Please disable your pop-up blocker.');
            }
        } catch (error) {
            console.error("Failed to generate or print receipt:", error);
            alert(`There was an error generating the receipt for printing.`);
        }
        
        setCart([]);
        setActiveLoyaltyMember(null);
        setLoyaltySearch('');
        setIsDelivery(false);
        setDeliveryCustomerName('');
        setDeliveryAddress('');
        setDeliveryCost('');
        setIsFinalizing(false);
    };
    
    const handleLoyaltySearch = () => {
        const member = loyaltyMembers.find(m => m.phone === loyaltySearch || m.name.toLowerCase().includes(loyaltySearch.toLowerCase()));
        if(member) {
            setActiveLoyaltyMember(member);
            setLoyaltySearch('');
        } else {
            alert('Loyalty member not found.');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
            {/* Product Selection */}
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg flex flex-col h-full">
                <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <button onClick={() => openModal(View.QRCodeScanner, { onSuccess: handleScanSuccess })} className="bg-[var(--input)] p-2 rounded-lg hover:bg-[var(--primary)]" title="Scan Product QR Code">
                        <QrCodeIcon />
                    </button>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto flex-grow">
                    {filteredInventory.map(item => (
                        <button key={item.id} onClick={() => addToCart(item as TransactionItem)} className="bg-[var(--input)] rounded-lg text-center flex flex-col justify-start items-center hover:bg-[var(--primary)] group transition-colors disabled:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden">
                            <div className="w-full aspect-square bg-slate-800 relative">
                                <img src={item.imageUrl || `https://placehold.co/400x400/1e293b/9ca3af?text=N/A`} alt={item.name} className="w-full h-full object-cover"/>
                                {isSupermarket && activePromotions.some(p => (p.target === 'item' && p.targetId === item.id) || (p.target === 'category' && p.targetId === item.category)) && (
                                     <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">SALE</div>
                                )}
                            </div>
                            <div className="p-2 flex flex-col flex-grow justify-center w-full">
                                <span className="font-semibold text-sm break-words text-white">{item.name}</span>
                                <div className="text-xs mt-1">
                                    <span className="text-[var(--text-muted)] group-hover:text-white">{profile.currency}{item.price.toFixed(2)}</span>
                                    <span className="text-yellow-400 block">Stock: {item.stock}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                     {filteredInventory.length === 0 && <div className="col-span-full text-center text-[var(--text-muted)] py-10">No products match your search.</div> }
                </div>
            </div>

            {/* Cart and Finalize */}
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col h-full">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Current Transaction</h2>
                {isSupermarket && (
                     <div className="mb-4">
                        {activeLoyaltyMember ? (
                            <div className="bg-green-900/50 p-3 rounded-lg text-center">
                                <p className="text-white font-bold">{activeLoyaltyMember.name}</p>
                                <p className="text-green-300 text-sm">{activeLoyaltyMember.points} points</p>
                                <button onClick={() => setActiveLoyaltyMember(null)} className="text-red-400 text-xs hover:underline mt-1">Remove</button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input type="text" value={loyaltySearch} onChange={(e) => setLoyaltySearch(e.target.value)} placeholder="Loyalty phone or name..." className="w-full bg-[var(--input)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                                <button onClick={handleLoyaltySearch} className="bg-slate-600 p-2 rounded-lg hover:bg-[var(--primary)]">Find</button>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                    {cart.length === 0 && <p className="text-[var(--text-muted)] text-center mt-8">Cart is empty.</p>}
                    {cart.map(item => (
                        <div key={item.id} className="bg-[var(--input)] rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3"><img src={item.imageUrl || `https://placehold.co/100x100/1e293b/9ca3af?text=N/A`} alt={item.name} className="h-10 w-10 rounded-md object-cover"/><div><p className="text-white font-medium text-sm">{item.name}</p><p className="text-[var(--text-muted)] text-xs">{profile.currency}{item.price.toFixed(2)}</p></div></div>
                            <div className="flex items-center gap-2"><input type="number" step="0.01" value={item.quantity} onChange={e => updateQuantity(item.id, parseFloat(e.target.value))} className="w-16 bg-slate-600 text-white p-1 rounded text-center" min="0" max={item.stock}/></div>
                        </div>
                    ))}
                </div>
                {cart.length > 0 && (
                    <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-2">
                        {isSupermarket && totalDiscount > 0 && (
                             <div className="flex justify-between text-green-400"><span>Discounts</span><span>-{profile.currency}{totalDiscount.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between text-[var(--text-muted)]"><span>Subtotal</span><span>{profile.currency}{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-[var(--text-muted)]"><span>Tax ({profile.taxRate}%)</span><span>{profile.currency}{taxAmount.toFixed(2)}</span></div>
                        
                        <div className="flex justify-between items-center text-[var(--text-muted)]">
                            <label htmlFor="delivery-toggle" className="cursor-pointer">Delivery</label>
                            <input
                                type="checkbox"
                                id="delivery-toggle"
                                checked={isDelivery}
                                onChange={e => setIsDelivery(e.target.checked)}
                                className="h-5 w-5 rounded bg-slate-600 border-slate-500 text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                        </div>

                        {isDelivery && (
                            <div className="space-y-2 p-3 bg-[var(--input)] rounded-lg">
                                <input type="text" placeholder="Customer Name" value={deliveryCustomerName} onChange={e => setDeliveryCustomerName(e.target.value)} className="w-full bg-slate-600 text-white p-2 rounded-lg" required />
                                <input type="text" placeholder="Delivery Address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="w-full bg-slate-600 text-white p-2 rounded-lg" required />
                                <input type="number" step="0.01" placeholder="Delivery Cost" value={deliveryCost} onChange={e => setDeliveryCost(e.target.value)} className="w-full bg-slate-600 text-white p-2 rounded-lg" required />
                            </div>
                        )}

                        <div className="flex justify-between text-[var(--text-primary)] font-bold text-lg pt-2 border-t border-[var(--border)]"><span>Total</span><span>{profile.currency}{total.toFixed(2)}</span></div>
                         <button onClick={finalizeSale} disabled={isFinalizing || cart.length === 0} className="w-full mt-4 bg-[var(--primary)] text-white font-bold py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-lg disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">
                            {isFinalizing ? ( <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</> ) : 'Finalize Sale'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PointOfSaleDashboard;