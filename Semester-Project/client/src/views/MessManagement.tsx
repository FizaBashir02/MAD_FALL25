
import React, { useState, useEffect } from 'react';
import { Card, Button, StatusBadge, Modal } from '../components/UI';
import { MealOrder, UserRole, OrderStatus, WeeklyMenu, DailyMenu } from '../types';
import { Calendar, Clock, QrCode, Utensils, CheckCircle, ChefHat, Edit3 } from 'lucide-react';
import { api } from '../services/api';

interface MessManagementProps {
  orders: MealOrder[];
  role: UserRole;
  onOrder: (items: string[], time: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const MessManagement: React.FC<MessManagementProps> = ({ orders, role, onOrder, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'kitchen'>('menu');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState('08:00');
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [isMenuEditMode, setIsMenuEditMode] = useState(false);
  const [editMenuData, setEditMenuData] = useState<WeeklyMenu | null>(null);

  // Get current day name (e.g., "Monday")
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const sortedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Editor State
  const [activeEditDay, setActiveEditDay] = useState<string>(today);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const menu = await api.mess.getWeeklyMenu();
    setWeeklyMenu(menu);
    setEditMenuData(menu);
  };

  const handleSaveMenu = async () => {
      if (editMenuData) {
          await api.mess.updateWeeklyMenu(editMenuData);
          setWeeklyMenu(editMenuData);
          setIsMenuEditMode(false);
      }
  };

  const handlePlaceOrder = () => {
    onOrder(selectedItems, pickupTime);
    setIsOrderModalOpen(false);
    setSelectedItems([]);
    alert("Order Placed Successfully!");
  };

  const toggleItemSelection = (item: string) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const currentDailyMenu = weeklyMenu ? (weeklyMenu as any)[today] as DailyMenu : null;

  // Render Editor
  const renderMenuEditor = () => (
      <div className="space-y-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
            <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Edit Menu</h2>
                <p className="text-slate-400 text-xs">Select a day to update meals</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="secondary" onClick={() => setIsMenuEditMode(false)} className="flex-1 sm:flex-none">Cancel</Button>
                <Button onClick={handleSaveMenu} className="flex-1 sm:flex-none">Save Changes</Button>
            </div>
          </div>

          {/* Day Selector Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar shrink-0">
            {sortedDays.map(day => (
                <button
                    key={day}
                    onClick={() => setActiveEditDay(day)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                        activeEditDay === day
                        ? 'bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/20'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                >
                    {day.slice(0, 3)}
                </button>
            ))}
          </div>

          {/* Edit Form for Active Day */}
          <div>
            <Card title={`Menu for ${activeEditDay}`} className="border-t-4 border-t-brand-500">
                <div className="space-y-6">
                    <div className="relative group">
                        <label className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1 block">Breakfast</label>
                        <div className="flex items-center bg-slate-800/50 rounded-xl border border-slate-700 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500/50 transition-all">
                             <div className="p-3 text-slate-500"><Utensils size={16} /></div>
                             <input 
                                type="text" 
                                className="w-full bg-transparent border-none focus:ring-0 py-3 text-sm text-white placeholder-slate-600"
                                placeholder="e.g. Eggs & Toast"
                                value={(editMenuData as any)?.[activeEditDay]?.breakfast || ''}
                                onChange={(e) => setEditMenuData({...editMenuData!, [activeEditDay]: { ...(editMenuData as any)[activeEditDay], breakfast: e.target.value }})}
                            />
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">Lunch</label>
                        <div className="flex items-center bg-slate-800/50 rounded-xl border border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                             <div className="p-3 text-slate-500"><Utensils size={16} /></div>
                             <input 
                                type="text" 
                                className="w-full bg-transparent border-none focus:ring-0 py-3 text-sm text-white placeholder-slate-600"
                                placeholder="e.g. Chicken Curry"
                                value={(editMenuData as any)?.[activeEditDay]?.lunch || ''}
                                onChange={(e) => setEditMenuData({...editMenuData!, [activeEditDay]: { ...(editMenuData as any)[activeEditDay], lunch: e.target.value }})}
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 block">Dinner</label>
                         <div className="flex items-center bg-slate-800/50 rounded-xl border border-slate-700 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                             <div className="p-3 text-slate-500"><Utensils size={16} /></div>
                             <input 
                                type="text" 
                                className="w-full bg-transparent border-none focus:ring-0 py-3 text-sm text-white placeholder-slate-600"
                                placeholder="e.g. Pasta"
                                value={(editMenuData as any)?.[activeEditDay]?.dinner || ''}
                                onChange={(e) => setEditMenuData({...editMenuData!, [activeEditDay]: { ...(editMenuData as any)[activeEditDay], dinner: e.target.value }})}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                    <p className="text-xs text-teal-200 flex items-center">
                        <CheckCircle size={12} className="mr-2" />
                        Changes are saved locally until you click "Save Changes".
                    </p>
                </div>
            </Card>
          </div>
      </div>
  );

  // Student View: Today's Menu
  const renderTodaysMenu = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl font-bold flex items-center">Today's Menu <span className="ml-2 text-xs md:text-sm font-normal text-slate-400 bg-white/5 px-2 py-1 rounded">{today}</span></h2>
            <p className="text-slate-400 text-sm">Fresh meals served hot every day.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                 <Button variant="secondary" icon={Edit3} onClick={() => setIsMenuEditMode(true)} className="flex-1 sm:flex-none">
                     Edit Menu
                 </Button>
            )}
            {role === UserRole.STUDENT && (
                <Button onClick={() => setIsOrderModalOpen(true)} className="flex-1 sm:flex-none">Pre-order Meal</Button>
            )}
        </div>
      </div>

      {!currentDailyMenu && <div className="p-8 text-center text-gray-500">Menu not set for today.</div>}

      {currentDailyMenu && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-orange-500/10 border-orange-500/20">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Breakfast</span>
                <h3 className="text-xl font-bold text-white mt-2">{currentDailyMenu.breakfast}</h3>
                <p className="text-sm text-slate-400 mt-1">7:00 AM - 9:30 AM</p>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/20">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Lunch</span>
                <h3 className="text-xl font-bold text-white mt-2">{currentDailyMenu.lunch}</h3>
                <p className="text-sm text-slate-400 mt-1">12:30 PM - 2:30 PM</p>
            </Card>
            <Card className="bg-indigo-500/10 border-indigo-500/20">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Dinner</span>
                <h3 className="text-xl font-bold text-white mt-2">{currentDailyMenu.dinner}</h3>
                <p className="text-sm text-slate-400 mt-1">7:30 PM - 9:30 PM</p>
            </Card>
        </div>
      )}

      {/* Pre-order Modal */}
      {currentDailyMenu && (
        <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={`Pre-order for ${today}`}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Select Meals</label>
                    <div className="space-y-2">
                        {['breakfast', 'lunch', 'dinner'].map((type) => {
                            const mealName = (currentDailyMenu as any)[type];
                            if(!mealName) return null;
                            return (
                                <div key={type} className="flex items-center p-3 border border-slate-700 rounded-lg hover:bg-white/5 cursor-pointer" onClick={() => toggleItemSelection(mealName)}>
                                    <input type="checkbox" checked={selectedItems.includes(mealName)} onChange={() => {}} className="h-4 w-4 text-teal-500 rounded border-slate-600 bg-transparent focus:ring-teal-500" />
                                    <div className="ml-3">
                                        <span className="block text-sm font-bold text-white capitalize">{type}</span>
                                        <span className="block text-sm text-slate-400">{mealName}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Pickup Time</label>
                    <input 
                        type="time" 
                        value={pickupTime} 
                        onChange={(e) => setPickupTime(e.target.value)} 
                        className="block w-full rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsOrderModalOpen(false)}>Cancel</Button>
                    <Button onClick={handlePlaceOrder} disabled={selectedItems.length === 0}>Confirm Order</Button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );

  // Student View: My Orders
  const renderOrders = () => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">My Orders</h2>
        {orders.length === 0 && <p className="text-slate-500">No active orders.</p>}
        {orders.map(order => (
            <div key={order.id} className="glass-panel rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div className="bg-white/5 p-3 rounded-full hidden sm:block">
                        <Utensils className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-white">{order.items.join(', ')}</p>
                        <div className="flex flex-wrap items-center text-sm text-slate-400 gap-3 mt-1">
                            <span className="flex items-center"><Calendar size={14} className="mr-1"/> {order.date}</span>
                            <span className="flex items-center"><Clock size={14} className="mr-1"/> {order.pickupTime}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <StatusBadge status={order.status} />
                    {order.status === OrderStatus.READY && (
                        <Button variant="outline" size="sm" icon={QrCode}>Show QR</Button>
                    )}
                </div>
            </div>
        ))}
    </div>
  );

  // Kitchen View
  const renderKitchen = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
             <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                <h3 className="text-orange-400 font-bold mb-1">Pending</h3>
                <p className="text-3xl font-bold text-white">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p>
             </div>
             <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <h3 className="text-blue-400 font-bold mb-1">Preparing</h3>
                <p className="text-3xl font-bold text-white">{orders.filter(o => o.status === OrderStatus.PREPARING).length}</p>
             </div>
             <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <h3 className="text-emerald-400 font-bold mb-1">Ready</h3>
                <p className="text-3xl font-bold text-white">{orders.filter(o => o.status === OrderStatus.READY).length}</p>
             </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-lg font-bold">Active Orders Queue</h3>
            </div>
            <ul className="divide-y divide-white/5">
                {orders.filter(o => o.status !== OrderStatus.COLLECTED).map(order => (
                    <li key={order.id} className="p-4 md:p-6 hover:bg-white/5 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-white truncate">Order #{order.id.slice(-4)} - {order.studentName}</h4>
                                <div className="mt-1 flex items-center text-sm text-slate-400 gap-4">
                                     <span className="flex items-center"><Clock size={16} className="mr-1 text-slate-500"/> {order.pickupTime}</span>
                                     <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{order.items.length} Items</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-300">
                                    {order.items.join(', ')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-center">
                                {order.status === OrderStatus.PENDING && (
                                    <Button size="sm" onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)} icon={ChefHat}>Cook</Button>
                                )}
                                {order.status === OrderStatus.PREPARING && (
                                    <Button size="sm" variant="primary" onClick={() => onUpdateStatus(order.id, OrderStatus.READY)} icon={CheckCircle}>Ready</Button>
                                )}
                                {order.status === OrderStatus.READY && (
                                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(order.id, OrderStatus.COLLECTED)} icon={QrCode}>Scan</Button>
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
      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar pb-1">
            <button 
                onClick={() => setActiveTab('menu')}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'menu' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'}`}
            >
                Mess Menu
            </button>
            {role === UserRole.STUDENT && (
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'}`}
                >
                    My Orders
                </button>
            )}
            {(role === UserRole.KITCHEN || role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                <button 
                    onClick={() => setActiveTab('kitchen')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'kitchen' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'}`}
                >
                    Kitchen Dashboard
                </button>
            )}
        </nav>
      </div>

      {activeTab === 'menu' && (isMenuEditMode ? renderMenuEditor() : renderTodaysMenu())}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'kitchen' && renderKitchen()}
    </div>
  );
};
