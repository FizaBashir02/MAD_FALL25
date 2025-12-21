import React, { useState } from 'react';
import { Card, Button, StatusBadge, Modal } from '../components/UI';
import { MealItem, MealOrder, UserRole, OrderStatus } from '../types';
import { Calendar, Clock, QrCode, Utensils, CheckCircle, ChefHat, Sparkles } from 'lucide-react';
import { suggestMessMenu } from '../services/geminiService';

interface MessManagementProps {
  menu: MealItem[];
  orders: MealOrder[];
  role: UserRole;
  onOrder: (itemIds: string[], time: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const MessManagement: React.FC<MessManagementProps> = ({ menu, orders, role, onOrder, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'kitchen'>('menu');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState('08:00');
  const [aiMenuSuggestion, setAiMenuSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSuggestMenu = async () => {
    setIsAiLoading(true);
    const suggestion = await suggestMessMenu("Vegetarian friendly, high protein, low budget");
    setAiMenuSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const handlePlaceOrder = () => {
    onOrder(selectedItems, pickupTime);
    setIsOrderModalOpen(false);
    setSelectedItems([]);
    alert("Order Placed Successfully!");
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Student View: Pre-order
  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Today's Menu</h2>
        <div className="flex gap-2">
            {(role === UserRole.ADMIN || role === UserRole.KITCHEN) && (
                 <Button variant="secondary" icon={Sparkles} onClick={handleSuggestMenu} disabled={isAiLoading}>
                     {isAiLoading ? "Thinking..." : "AI Menu Suggestion"}
                 </Button>
            )}
            {role === UserRole.STUDENT && (
                <Button onClick={() => setIsOrderModalOpen(true)}>Pre-order Meal</Button>
            )}
        </div>
      </div>

      {aiMenuSuggestion && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-4 text-sm text-indigo-900 whitespace-pre-line">
              <h4 className="font-bold mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2" /> AI Chef Suggestion:</h4>
              {aiMenuSuggestion}
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map(item => (
          <Card key={item.id} className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
               <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.type}</span>
               {item.available ? <span className="text-green-500 text-xs font-bold">Available</span> : <span className="text-red-400 text-xs font-bold">Sold Out</span>}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
            <p className="text-gray-500 text-sm flex-1">{item.description}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Pre-order Breakfast">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Items</label>
                <div className="space-y-2">
                    {menu.filter(m => m.type === 'Breakfast').map(item => (
                        <div key={item.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => toggleItemSelection(item.id)}>
                            <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => {}} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                            <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                <input 
                    type="time" 
                    value={pickupTime} 
                    onChange={(e) => setPickupTime(e.target.value)} 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsOrderModalOpen(false)}>Cancel</Button>
                <Button onClick={handlePlaceOrder} disabled={selectedItems.length === 0}>Confirm Order</Button>
            </div>
        </div>
      </Modal>
    </div>
  );

  // Student View: My Orders
  const renderOrders = () => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">My Orders</h2>
        {orders.map(order => (
            <div key={order.id} className="bg-white border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                        <Utensils className="text-gray-600" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{order.items.join(', ')}</p>
                        <div className="flex items-center text-sm text-gray-500 gap-3 mt-1">
                            <span className="flex items-center"><Calendar size={14} className="mr-1"/> {order.date}</span>
                            <span className="flex items-center"><Clock size={14} className="mr-1"/> {order.pickupTime}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    {order.status === OrderStatus.READY && (
                        <Button variant="outline" icon={QrCode}>Show QR</Button>
                    )}
                </div>
            </div>
        ))}
    </div>
  );

  // Kitchen View: Staff Dashboard
  const renderKitchen = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h3 className="text-orange-800 font-bold mb-1">Pending</h3>
                <p className="text-3xl font-bold text-orange-600">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p>
             </div>
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-1">Preparing</h3>
                <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === OrderStatus.PREPARING).length}</p>
             </div>
             <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h3 className="text-green-800 font-bold mb-1">Ready for Pickup</h3>
                <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === OrderStatus.READY).length}</p>
             </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold">Active Orders Queue</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {orders.filter(o => o.status !== OrderStatus.COLLECTED).map(order => (
                    <li key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-gray-900 truncate">Order #{order.id.slice(-4)} - {order.studentName}</h4>
                                <div className="mt-1 flex items-center text-sm text-gray-500 gap-4">
                                     <span className="flex items-center"><Clock size={16} className="mr-1 text-gray-400"/> {order.pickupTime}</span>
                                     <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{order.items.length} Items</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    {order.items.map(itemId => menu.find(m => m.id === itemId)?.name).join(', ')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {order.status === OrderStatus.PENDING && (
                                    <Button size="sm" onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)} icon={ChefHat}>Start Cooking</Button>
                                )}
                                {order.status === OrderStatus.PREPARING && (
                                    <Button size="sm" variant="primary" onClick={() => onUpdateStatus(order.id, OrderStatus.READY)} icon={CheckCircle}>Mark Ready</Button>
                                )}
                                {order.status === OrderStatus.READY && (
                                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(order.id, OrderStatus.COLLECTED)} icon={QrCode}>Scan QR</Button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
            <button 
                onClick={() => setActiveTab('menu')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'menu' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
                Mess Menu
            </button>
            {role === UserRole.STUDENT && (
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    My Orders
                </button>
            )}
            {(role === UserRole.KITCHEN || role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                <button 
                    onClick={() => setActiveTab('kitchen')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kitchen' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Kitchen Dashboard
                </button>
            )}
        </nav>
      </div>

      {activeTab === 'menu' && renderMenu()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'kitchen' && renderKitchen()}
    </div>
  );
};