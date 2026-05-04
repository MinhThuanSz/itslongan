import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingCart, Users, Package, FileText, 
  Settings, Bell, Search, Menu, X, ChevronRight, CheckCircle2, 
  XCircle, Clock, MoreVertical, Plus
} from 'lucide-react';

// ==============================
// MOCK DATA
// ==============================
const mockOrders = [
  { id: 'ORD-2026-001', customer: 'TechCorp Việt Nam', amount: 23000000, status: 'completed', date: '04/05/2026' },
  { id: 'ORD-2026-002', customer: 'StartUp Long An', amount: 8000000, status: 'pending', date: '03/05/2026' },
  { id: 'ORD-2026-003', customer: 'Trần Văn Bình', amount: 15000000, status: 'completed', date: '01/05/2026' },
  { id: 'ORD-2026-004', customer: 'Lê Thị Hoa', amount: 3500000, status: 'canceled', date: '28/04/2026' },
];

const mockStats = [
  { label: 'Tổng doanh thu', value: '49,500,000 đ', trend: '+12.5%', isUp: true },
  { label: 'Đơn thành công', value: '142', trend: '+5.2%', isUp: true },
  { label: 'Đơn chờ xử lý', value: '18', trend: '-2.1%', isUp: false },
  { label: 'Khách hàng mới', value: '24', trend: '+8.4%', isUp: true },
];

// ==============================
// COMPONENTS
// ==============================

// -- 1. Sidebar --
const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const menu = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { id: 'quotations', icon: FileText, label: 'Báo giá' },
    { id: 'products', icon: Package, label: 'Sản phẩm' },
    { id: 'customers', icon: Users, label: 'Khách hàng' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ 
          width: isCollapsed ? 80 : 260,
          x: typeof window !== 'undefined' && window.innerWidth < 768 ? (isMobileOpen ? 0 : -260) : 0
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed md:relative z-50 h-screen bg-[#0b1020] border-r border-white/5 flex flex-col"
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between overflow-hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-sm">IT</span>
            </div>
            {!isCollapsed && <span className="font-semibold text-lg whitespace-nowrap text-white">CRM Pro</span>}
          </div>
          {/* Mobile Close */}
          <button className="md:hidden text-slate-400 p-1" onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {menu.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                {isActive && (
                  <motion.div layoutId="active-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Footer Settings */}
        <div className="p-4 border-t border-white/5 shrink-0 overflow-hidden">
           <button 
             className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 w-full transition-colors rounded-xl hover:bg-white/5"
             title={isCollapsed ? "Cài đặt" : ""}
           >
              <Settings size={20} className="shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">Cài đặt</span>}
           </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-[#1e293b] border border-white/10 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500 transition-colors shadow-lg z-50"
        >
          <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </motion.aside>
    </>
  );
};

// -- 2. Header --
const Header = ({ setIsMobileOpen }) => {
  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-[#0b1020]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400 hover:text-white p-1" onClick={() => setIsMobileOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="w-64 pl-9 pr-4 py-1.5 bg-[#1e293b]/50 border border-white/5 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-[#1e293b] transition-all focus:w-80"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors p-1">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#0b1020]"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-white/5 pl-4 md:pl-6 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            AD
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-white leading-tight">Admin CRM</div>
            <div className="text-xs text-slate-500 mt-0.5">Quản trị viên</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// -- 3. Dashboard Cards --
const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {mockStats.map((stat, idx) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          key={idx} 
          className="p-5 rounded-2xl bg-[#1e293b]/30 border border-white/5 hover:border-white/10 hover:bg-[#1e293b]/60 transition-all duration-300 group"
        >
          <div className="text-sm font-medium text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">{stat.label}</div>
          <div className="text-2xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
          <div className={`text-xs font-medium px-2 py-1 inline-block rounded-md border ${stat.isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {stat.trend} so với tháng trước
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// -- 4. Orders Table --
const OrdersTable = () => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'completed': return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Hoàn thành' };
      case 'pending': return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Chờ xử lý' };
      case 'canceled': return { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Đã hủy' };
      default: return { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: status };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="bg-[#1e293b]/20 border border-white/5 rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="p-5 md:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1e293b]/10">
        <h2 className="text-lg font-semibold text-white">Đơn hàng gần đây</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0">
          <Plus size={16} /> Tạo đơn hàng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-400 uppercase bg-[#0b1020]/50 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">Mã đơn</th>
              <th className="px-6 py-4 font-medium tracking-wider">Khách hàng</th>
              <th className="px-6 py-4 font-medium tracking-wider">Tổng tiền</th>
              <th className="px-6 py-4 font-medium tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 font-medium tracking-wider">Ngày tạo</th>
              <th className="px-6 py-4 font-medium text-right tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockOrders.map((order, idx) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;
              return (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.05 }}
                  key={order.id} 
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 text-slate-300">{order.customer}</td>
                  <td className="px-6 py-4 font-medium text-white">{order.amount.toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${status.bg} ${status.color} ${status.border} text-xs font-medium tracking-wide`}>
                      <StatusIcon size={14} /> {status.label}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/5">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// -- 5. Empty State --
const EmptyState = ({ title }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]"
  >
    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      <Package size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-medium text-white mb-2">Chưa có dữ liệu {title}</h3>
    <p className="text-sm text-slate-400 mb-6 max-w-sm text-center leading-relaxed">
      Bắt đầu bằng cách tạo bản ghi đầu tiên của bạn. Hệ thống sẽ tự động đồng bộ và hiển thị.
    </p>
    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-all border border-white/10 hover:border-white/20">
      <Plus size={16} />
      Thêm mới ngay
    </button>
  </motion.div>
);

// -- Main Layout --
export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load collapse state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved) setIsCollapsed(JSON.parse(saved));
    
    // Auto collapse on small desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save collapse state
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="flex min-h-screen bg-[#0b1020] text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar 
        isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} 
        activeTab={activeTab} setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen relative bg-gradient-to-br from-[#0f172a] to-[#0b1020]">
        <Header setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto overflow-x-hidden scroll-smooth pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  {activeTab === 'dashboard' ? 'Tổng quan' : 
                   activeTab === 'orders' ? 'Đơn hàng' : 
                   activeTab === 'quotations' ? 'Báo giá' : 'Quản lý'}
                </h1>
                <p className="text-slate-400 text-sm mt-1">Theo dõi và quản lý dữ liệu hệ thống chuyên nghiệp.</p>
              </div>

              {activeTab === 'dashboard' ? (
                <>
                  <StatsGrid />
                  <OrdersTable />
                </>
              ) : activeTab === 'orders' ? (
                <OrdersTable />
              ) : (
                <EmptyState title={activeTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
