import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Palette,
  Phone,
  Layers,
  RotateCcw,
  TreePine,
  Maximize2,
  Image as ImageIcon,
  Edit2,
  Check,
  X,
  Upload,
  Eye,
  Lock,
  ShoppingBag,
  Clock,
  Truck,
  AlertCircle,
  Search,
  RefreshCw,
  FileText,
  User,
  MapPin,
  PenTool,
  MessageCircle,
  Calendar,
  PenLine
} from 'lucide-react';
import { resolveAssetUrl } from '@/lib/utils';
import {
  fetchOrdersFromSupabase,
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase
} from '@/lib/supabase';

export function StudioManagerPage({
  onBack,
  paintings,
  setPaintings,
  storySteps,
  setStorySteps,
  studioInfo,
  setStudioInfo,
  onResetDefaults,
  onLock
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'paintings', 'whatsapp', 'story'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPainting, setEditingPainting] = useState(null); // painting currently being edited
  const [toastMessage, setToastMessage] = useState('');

  // Orders State (Supabase Connected)
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [showCustomOrderModal, setShowCustomOrderModal] = useState(false);
  const [customOrderForm, setCustomOrderForm] = useState({
    name: '',
    phone: '',
    city: 'Faisalabad',
    address: '',
    artworkTitle: '',
    dimensions: '12 x 18 inches',
    woodFrame: 'Seasoned Solid Sheesham Frame',
    customNameText: '',
    pricePKR: 5000,
    status: 'In Progress',
    notes: ''
  });

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    const res = await fetchOrdersFromSupabase();
    if (res.success && res.orders) {
      setOrders(res.orders);
    }
    setIsLoadingOrders(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatusInSupabase(orderId, newStatus);
    showToast(`Order status updated to: ${newStatus}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setOrders(prev => prev.filter(o => o.id !== orderId));
    await deleteOrderFromSupabase(orderId);
    showToast("Order removed");
  };

  const handleSaveCustomOrder = async (e) => {
    e.preventDefault();
    if (!customOrderForm.name || !customOrderForm.phone) {
      alert("Please provide customer name and phone number.");
      return;
    }

    const payload = {
      orderNumber: `CUSTOM-${Date.now().toString().slice(-5)}`,
      name: customOrderForm.name,
      phone: customOrderForm.phone,
      city: customOrderForm.city,
      address: customOrderForm.address,
      customName: customOrderForm.customNameText,
      items: [
        {
          id: `custom-item-${Date.now()}`,
          title: customOrderForm.artworkTitle || 'Bespoke Custom Artwork',
          dimensions: customOrderForm.dimensions || 'Custom Size',
          woodFrame: customOrderForm.woodFrame || 'Seasoned Sheesham Wood',
          pricePKR: Number(customOrderForm.pricePKR) || 0,
          qty: 1,
          wallImage: '/images/madina_wall.jpg'
        }
      ],
      totalPKR: Number(customOrderForm.pricePKR) || 0,
      totalUSD: Math.round((Number(customOrderForm.pricePKR) || 0) / 278),
      orderType: 'custom',
      status: customOrderForm.status || 'In Progress',
      notes: customOrderForm.notes || ''
    };

    const res = await saveOrderToSupabase(payload);
    if (res.success && res.data) {
      setOrders(prev => [res.data, ...prev]);
    } else {
      setOrders(prev => [{ ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() }, ...prev]);
    }

    showToast("Custom order saved successfully!");
    setShowCustomOrderModal(false);
    setCustomOrderForm({
      name: '',
      phone: '',
      city: 'Faisalabad',
      address: '',
      artworkTitle: '',
      dimensions: '12 x 18 inches',
      woodFrame: 'Seasoned Solid Sheesham Frame',
      customNameText: '',
      pricePKR: 5000,
      status: 'In Progress',
      notes: ''
    });
  };

  // Form state for creating a new painting
  const [formData, setFormData] = useState({
    title: '',
    pricePKR: 2500,
    woodFrame: 'Solid Natural Wood Slice with Rustic Bark Edge & Clear Display Stand',
    dimensions: '5 x 5 inches',
    badge: 'Popular',
    category: 'Islamic Art',
    wallImage: '/images/madina_wall.jpg',
    closeupImage: '/images/madina.png',
    description: '100% original hand-painted oil artwork on genuine tree bark wood slice. Includes transparent display stand and hanging jute cord.',
    inStock: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Upload local image from PC (reads as Base64 Data URL)
  const handleImageFileUpload = (e, field, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image is too large! Please choose an image smaller than 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        if (isEditing) {
          setEditingPainting(prev => prev ? { ...prev, [field]: result } : null);
        } else {
          setFormData(prev => ({ ...prev, [field]: result }));
        }
        showToast(`${field === 'wallImage' ? 'Wall View' : 'Product Artwork'} image uploaded!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewPainting = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Artwork title is required!");
      return;
    }

    const newArt = {
      ...formData,
      id: `wood-slice-${Date.now()}`,
      pricePKR: Number(formData.pricePKR) || 2500,
      priceUSD: Math.round((Number(formData.pricePKR) || 2500) / 278)
    };

    setPaintings(prev => [newArt, ...prev]);
    setShowAddForm(false);
    setFormData({
      title: '',
      pricePKR: 2500,
      woodFrame: 'Solid Natural Wood Slice with Rustic Bark Edge & Clear Display Stand',
      dimensions: '5 x 5 inches',
      badge: 'Popular',
      category: 'Islamic Art',
      wallImage: '/images/madina_wall.jpg',
      closeupImage: '/images/madina.png',
      description: '100% original hand-painted oil artwork on genuine tree bark wood slice. Includes transparent display stand and hanging jute cord.',
      inStock: true
    });
    showToast("New painting saved to gallery!");
  };

  // Save changes to an existing/uploaded painting
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingPainting) return;
    if (!editingPainting.title?.trim()) {
      alert("Artwork title is required!");
      return;
    }

    const updated = {
      ...editingPainting,
      pricePKR: Number(editingPainting.pricePKR) || 45000,
      priceUSD: Math.round((Number(editingPainting.pricePKR) || 45000) / 278)
    };

    setPaintings(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingPainting(null);
    showToast(`"${updated.title}" successfully updated!`);
  };

  const handleUpdatePainting = (id, field, value) => {
    setPaintings(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          if (field === 'pricePKR') {
            updated.priceUSD = Math.round(Number(value) / 278);
          }
          return updated;
        }
        return p;
      })
    );
    showToast("Changes save ho gaye!");
  };

  const handleDeletePainting = (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}" from the gallery?`)) {
      setPaintings(prev => prev.filter(p => p.id !== id));
      showToast("Painting removed from gallery!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600" />
            <span>← Return to Website</span>
          </button>

          <div className="flex items-center gap-3">
            <img src={resolveAssetUrl("/images/logo.png")} alt="Withinarts Logo" className="h-10 w-auto object-contain hidden sm:block" />
            <div className="text-center sm:text-left">
              <h1 className="font-playfair font-bold text-lg sm:text-xl text-slate-900">
                Withinarts — Studio Manager
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Studio Administration • Intuitive catalog and content control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLock && (
              <button
                onClick={onLock}
                className="text-xs text-slate-700 hover:text-rose-700 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 transition-colors cursor-pointer"
                title="Lock Studio Manager & Logout"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Lock & Sign Out</span>
              </button>
            )}

            <button
              onClick={onResetDefaults}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
              title="Restore Default Settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* Simple Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${activeTab === 'orders'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Custom Inquiries ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('paintings')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${activeTab === 'paintings'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
          >
            <Palette className="w-4 h-4" />
            <span>Paintings & Prices ({paintings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${activeTab === 'whatsapp'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp & Studio Info</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${activeTab === 'story'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
          >
            <Layers className="w-4 h-4" />
            <span>Our Story (4 Steps)</span>
          </button>
        </div>

        {/* TAB 0: ORDERS & CUSTOM INQUIRIES */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Top Action Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-playfair font-bold text-slate-900">
                    Studio Orders & Custom Commissions
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Live
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Track website bag checkouts, WhatsApp inquiries, and log bespoke custom painting orders.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadOrders}
                  disabled={isLoadingOrders}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-sky-600' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={() => setShowCustomOrderModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Custom Order</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search customer, phone, city, order #..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-sky-500 shadow-xs"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'Pending', 'In Progress', 'Completed', 'Dispatched', 'custom'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      orderFilter === f
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {f === 'all'
                      ? `All (${orders.length})`
                      : f === 'custom'
                      ? `🎨 Custom (${orders.filter(o => o.order_type === 'custom').length})`
                      : `${f} (${orders.filter(o => o.status === f).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {isLoadingOrders && orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Fetching orders from Supabase...</p>
              </div>
            ) : orders.filter(o => {
                if (orderFilter !== 'all') {
                  if (orderFilter === 'custom') {
                    if (o.order_type !== 'custom') return false;
                  } else if (o.status !== orderFilter) {
                    return false;
                  }
                }
                if (orderSearchQuery.trim()) {
                  const q = orderSearchQuery.toLowerCase();
                  const name = (o.customer_name || '').toLowerCase();
                  const phone = (o.customer_phone || '').toLowerCase();
                  const orderNum = (o.order_number || '').toLowerCase();
                  const city = (o.customer_city || '').toLowerCase();
                  return name.includes(q) || phone.includes(q) || orderNum.includes(q) || city.includes(q);
                }
                return true;
              }).length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-playfair font-bold text-slate-700 text-sm">No orders found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  {orderSearchQuery ? 'No orders match your search criteria.' : 'No orders recorded in this filter yet. You can create a custom order anytime!'}
                </p>
                <button
                  onClick={() => setShowCustomOrderModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Order</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.filter(o => {
                  if (orderFilter !== 'all') {
                    if (orderFilter === 'custom') {
                      if (o.order_type !== 'custom') return false;
                    } else if (o.status !== orderFilter) {
                      return false;
                    }
                  }
                  if (orderSearchQuery.trim()) {
                    const q = orderSearchQuery.toLowerCase();
                    const name = (o.customer_name || '').toLowerCase();
                    const phone = (o.customer_phone || '').toLowerCase();
                    const orderNum = (o.order_number || '').toLowerCase();
                    const city = (o.customer_city || '').toLowerCase();
                    return name.includes(q) || phone.includes(q) || orderNum.includes(q) || city.includes(q);
                  }
                  return true;
                }).map((ord) => {
                  const items = Array.isArray(ord.items) ? ord.items : [];
                  const orderDate = ord.created_at ? new Date(ord.created_at).toLocaleString() : 'Recent';
                  const isCustom = ord.order_type === 'custom';

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col gap-4"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            #{ord.order_number || ord.id?.slice(0, 8)}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isCustom
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-sky-100 text-sky-800 border border-sky-200'
                            }`}
                          >
                            {isCustom ? '🎨 Bespoke Custom Order' : 'Website Order'}
                          </span>

                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {orderDate}
                          </span>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status:
                          </span>
                          <select
                            value={ord.status || 'Pending'}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1 rounded-xl outline-none border cursor-pointer ${
                              ord.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : ord.status === 'Dispatched'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : ord.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Middle: Customer Details & Custom Text */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-xs text-slate-700">
                          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                            <User className="w-4 h-4 text-sky-600" />
                            <span>{ord.customer_name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{ord.customer_phone}</span>
                            {ord.customer_phone && (
                              <a
                                href={`https://wa.me/${ord.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${ord.customer_name}! This is Withinarts Fine Art Studio regarding your order #${ord.order_number || ''}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp Client</span>
                              </a>
                            )}
                          </div>

                          {(ord.customer_city || ord.customer_address) && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span className="text-slate-600">
                                {ord.customer_address ? `${ord.customer_address}, ` : ''}
                                <strong>{ord.customer_city}</strong>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Custom Inscription Calligraphy Box */}
                        {ord.custom_name_text && (
                          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                              <PenLine className="w-3.5 h-3.5 text-amber-600" />
                              <span>Custom Name / Calligraphy Requested on Canvas:</span>
                            </div>
                            <p className="font-serif italic text-amber-950 font-bold bg-white/80 p-2 rounded-lg border border-amber-200/60">
                              "{ord.custom_name_text}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Items Ordered List */}
                      {items.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Artwork(s) in Order:
                          </span>
                          <div className="divide-y divide-slate-200/60">
                            {items.map((it, idx) => (
                              <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  {it.wallImage && (
                                    <img
                                      src={resolveAssetUrl(it.wallImage)}
                                      alt={it.title}
                                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white"
                                    />
                                  )}
                                  <div>
                                    <span className="font-semibold text-slate-800">{it.title}</span>
                                    {it.dimensions && (
                                      <span className="text-[10px] text-slate-500 ml-1.5">
                                        ({it.dimensions} • {it.woodFrame})
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-bold text-slate-900 shrink-0 ml-2">
                                  {it.qty || 1} × Rs. {Number(it.pricePKR || 0).toLocaleString()} PKR
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer: Total & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">Order Total:</span>
                          <span className="text-base font-bold text-sky-700 font-heading">
                            Rs. {Number(ord.total_pkr || 0).toLocaleString()} PKR
                          </span>
                          {ord.total_usd > 0 && (
                            <span className="text-xs text-slate-400 font-medium">
                              (~${ord.total_usd} USD)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL: + Add Custom Order */}
        {showCustomOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900">
              <button
                onClick={() => setShowCustomOrderModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-playfair font-bold text-slate-900">
                    Add Bespoke Custom Order
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log a direct phone client, walk-in, or custom calligraphy commission.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCustomOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={customOrderForm.name}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, name: e.target.value })}
                      placeholder="e.g. Ahmed Raza"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={customOrderForm.phone}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, phone: e.target.value })}
                      placeholder="03001234567"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={customOrderForm.city}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, city: e.target.value })}
                      placeholder="Faisalabad, Lahore, Islamabad..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      value={customOrderForm.address}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, address: e.target.value })}
                      placeholder="House, Street, Sector..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Artwork Title / Commission Spec *</label>
                  <input
                    type="text"
                    required
                    value={customOrderForm.artworkTitle}
                    onChange={(e) => setCustomOrderForm({ ...customOrderForm, artworkTitle: e.target.value })}
                    placeholder="e.g. Ayat-ul-Kursi with 24K Gold Leaf Inlay"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Canvas Size</label>
                    <input
                      type="text"
                      value={customOrderForm.dimensions}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, dimensions: e.target.value })}
                      placeholder="18 x 24 inches"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Stretcher Wood Frame</label>
                    <input
                      type="text"
                      value={customOrderForm.woodFrame}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, woodFrame: e.target.value })}
                      placeholder="Seasoned Solid Sheesham Wood"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Custom Name to Paint */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    ✍️ Custom Name / Family Text to Paint on Artwork
                  </label>
                  <input
                    type="text"
                    value={customOrderForm.customNameText}
                    onChange={(e) => setCustomOrderForm({ ...customOrderForm, customNameText: e.target.value })}
                    placeholder="e.g. 'Saad & Ayesha' or 'ماشاءاللہ'"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Agreed Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={customOrderForm.pricePKR}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, pricePKR: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                    <select
                      value={customOrderForm.status}
                      onChange={(e) => setCustomOrderForm({ ...customOrderForm, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-purple-500"
                    >
                      <option value="In Progress">In Progress (Painting Active)</option>
                      <option value="Pending">Pending Confirmation</option>
                      <option value="Completed">Completed</option>
                      <option value="Dispatched">Dispatched</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Special Client Notes</label>
                  <textarea
                    rows={2}
                    value={customOrderForm.notes}
                    onChange={(e) => setCustomOrderForm({ ...customOrderForm, notes: e.target.value })}
                    placeholder="e.g. Client requested dark blue background with heavy gold foil calligraphy..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomOrderModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Save Custom Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: PAINTINGS & PRICES */}
        {activeTab === 'paintings' && (
          <div className="space-y-6">
            {/* Top Action Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base sm:text-lg font-playfair font-bold text-slate-900">
                  Paintings Catalog
                </h2>
                <p className="text-xs text-slate-500">
                  Manage your paintings: edit titles, update prices and badges, or add new original artworks.
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm ? "Cancel" : "+ Add New Painting"}</span>
              </button>
            </div>

            {/* Simple Add Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddNewPainting}
                className="p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-5 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-playfair font-bold text-base text-emerald-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Enter New Artwork Details</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 block">1. Artwork Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Bismillah Royal Gold Calligraphy"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">2. Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                    >
                      <option value="Islamic Calligraphy">Islamic Calligraphy</option>
                      <option value="Sufi Art">Sufi Art</option>
                      <option value="Pakistani Landscape">Pakistani Landscape</option>
                      <option value="Limited Edition">Limited Edition</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">3. Price (PKR) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 45000"
                      value={formData.pricePKR}
                      onChange={(e) => setFormData({ ...formData, pricePKR: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:border-sky-500 outline-none"
                      required
                    />
                  </div>

                  {/* Wood Frame */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">4. Stretcher Wood Frame</label>
                    <input
                      type="text"
                      placeholder="e.g. Seasoned Sheesham Wood (Faisalabad)"
                      value={formData.woodFrame}
                      onChange={(e) => setFormData({ ...formData, woodFrame: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 outline-none"
                    />
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">5. Dimensions (Inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 36 x 48 inches"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 outline-none"
                    />
                  </div>

                  {/* Badge */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 block">6. Badge (Tag)</label>
                    <select
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                    >
                      <option value="Limited Edition">Limited Edition</option>
                      <option value="Masterpiece">Masterpiece</option>
                      <option value="Hot Item">Hot Item</option>
                      <option value="Original Piece">Original Piece</option>
                    </select>
                  </div>
                </div>

                {/* DUAL IMAGE CONFIGURATION SECTION */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="mb-3">
                    <span className="font-playfair font-bold text-sm text-slate-900 block">
                      Artwork Images (Wall View & Product View)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Upload from your PC/device, paste a link, or pick from studio presets.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image 1: Wall Mockup Image */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <span>🖼️ Wall View (Room Mockup)</span>
                        </label>
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                          Wall Mockup
                        </span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                        {formData.wallImage ? (
                          <img
                            src={formData.wallImage}
                            alt="Wall Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-slate-400 text-xs">No image selected</span>
                        )}
                      </div>

                      {/* Upload from PC Button */}
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        <span>Upload Wall Image from PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'wallImage', false)}
                          className="hidden"
                        />
                      </label>

                      {/* Or URL Input */}
                      <input
                        type="text"
                        placeholder="Or enter URL / file path"
                        value={formData.wallImage}
                        onChange={(e) => setFormData({ ...formData, wallImage: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono outline-none focus:border-sky-500"
                      />

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Presets:</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, wallImage: '/images/painting_wall_1.jpg' })}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-medium"
                        >
                          Wall 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, wallImage: '/images/painting_wall_2.jpg' })}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-medium"
                        >
                          Wall 2
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, wallImage: '/images/painting_wall_3.jpg' })}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-medium"
                        >
                          Wall 3
                        </button>
                      </div>
                    </div>

                    {/* Image 2: Product / Closeup Image */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <span>🔍 Product Image (Artwork Closeup)</span>
                        </label>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Artwork Closeup
                        </span>
                      </div>

                      {/* Preview Box */}
                      <div className="relative w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                        {formData.closeupImage ? (
                          <img
                            src={formData.closeupImage}
                            alt="Product Closeup Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-slate-400 text-xs">No image selected</span>
                        )}
                      </div>

                      {/* Upload from PC Button */}
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Upload Product Image from PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'closeupImage', false)}
                          className="hidden"
                        />
                      </label>

                      {/* Or URL Input */}
                      <input
                        type="text"
                        placeholder="Or enter URL / file path"
                        value={formData.closeupImage}
                        onChange={(e) => setFormData({ ...formData, closeupImage: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono outline-none focus:border-sky-500"
                      />

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Presets:</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, closeupImage: '/images/painting_closeup_1.jpg' })}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-medium"
                        >
                          Closeup 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, closeupImage: '/images/painting_closeup_2.jpg' })}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-medium"
                        >
                          Closeup 2
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, closeupImage: '/images/painting_closeup_3.jpg' })}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-medium"
                        >
                          Closeup 3
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    ✓ Save (Add to Gallery)
                  </button>
                </div>
              </form>
            )}

            {/* EDIT PAINTING MODAL (For editing existing / uploaded products) */}
            {editingPainting && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setEditingPainting(null)}
              >
                <div
                  className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="font-playfair font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-sky-600" />
                        <span>Edit Painting Details</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Update title, pricing, details, and change wall image or product closeup.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPainting(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700 block">1. Artwork Title *</label>
                        <input
                          type="text"
                          value={editingPainting.title}
                          onChange={(e) => setEditingPainting({ ...editingPainting, title: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">2. Category</label>
                        <select
                          value={editingPainting.category}
                          onChange={(e) => setEditingPainting({ ...editingPainting, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                        >
                          <option value="Islamic Calligraphy">Islamic Calligraphy</option>
                          <option value="Sufi Art">Sufi Art</option>
                          <option value="Pakistani Landscape">Pakistani Landscape</option>
                          <option value="Limited Edition">Limited Edition</option>
                        </select>
                      </div>

                      {/* Price (PKR) */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">3. Price (PKR) *</label>
                        <input
                          type="number"
                          value={editingPainting.pricePKR}
                          onChange={(e) => setEditingPainting({ ...editingPainting, pricePKR: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:border-sky-500 outline-none"
                          required
                        />
                      </div>

                      {/* Frame */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">4. Stretcher Wood Frame</label>
                        <input
                          type="text"
                          value={editingPainting.woodFrame || ''}
                          onChange={(e) => setEditingPainting({ ...editingPainting, woodFrame: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 outline-none"
                        />
                      </div>

                      {/* Dimensions */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">5. Dimensions</label>
                        <input
                          type="text"
                          value={editingPainting.dimensions || ''}
                          onChange={(e) => setEditingPainting({ ...editingPainting, dimensions: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 outline-none"
                        />
                      </div>

                      {/* Badge */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">6. Badge</label>
                        <select
                          value={editingPainting.badge || 'Limited Edition'}
                          onChange={(e) => setEditingPainting({ ...editingPainting, badge: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                        >
                          <option value="Limited Edition">Limited Edition</option>
                          <option value="Masterpiece">Masterpiece</option>
                          <option value="Hot Item">Hot Item</option>
                          <option value="Original Piece">Original Piece</option>
                        </select>
                      </div>

                      {/* In Stock Status */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">7. Availability</label>
                        <select
                          value={editingPainting.inStock ? 'true' : 'false'}
                          onChange={(e) => setEditingPainting({ ...editingPainting, inStock: e.target.value === 'true' })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:border-sky-500 outline-none"
                        >
                          <option value="true">In Stock (Available)</option>
                          <option value="false">Sold Out</option>
                        </select>
                      </div>
                    </div>

                    {/* DUAL IMAGE EDITING CONTROLS */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="mb-3">
                        <span className="font-playfair font-bold text-sm text-slate-900 block">
                          Change Artwork Images (Wall View & Product View)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Upload new images directly from your PC or adjust URLs.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Wall Image Edit */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs">🖼️ Wall View Mockup</span>
                            <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                              Wall Mockup
                            </span>
                          </div>

                          <div className="w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                            {editingPainting.wallImage ? (
                              <img
                                src={editingPainting.wallImage}
                                alt="Wall View"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-slate-400 text-xs">No image</span>
                            )}
                          </div>

                          <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-sky-600" />
                            <span>Upload Wall Image from PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileUpload(e, 'wallImage', true)}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            value={editingPainting.wallImage || ''}
                            onChange={(e) => setEditingPainting({ ...editingPainting, wallImage: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono outline-none focus:border-sky-500"
                            placeholder="Image URL or Path"
                          />
                        </div>

                        {/* Product Closeup Edit */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs">🔍 Product Artwork Closeup</span>
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              Artwork Closeup
                            </span>
                          </div>

                          <div className="w-full h-36 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                            {editingPainting.closeupImage ? (
                              <img
                                src={editingPainting.closeupImage}
                                alt="Product Closeup"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-slate-400 text-xs">No image</span>
                            )}
                          </div>

                          <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-amber-600" />
                            <span>Upload Product Image from PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileUpload(e, 'closeupImage', true)}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            value={editingPainting.closeupImage || ''}
                            onChange={(e) => setEditingPainting({ ...editingPainting, closeupImage: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono outline-none focus:border-sky-500"
                            placeholder="Image URL or Path"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingPainting(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20 cursor-pointer"
                      >
                        ✓ Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* List of Existing Paintings */}
            <div className="grid grid-cols-1 gap-4">
              {paintings.map((p) => (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                >
                  {/* Left: Dual Thumbnails & Details */}
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                    {/* Dual Thumbnails (Wall View & Product View) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative group/thumb">
                        <img
                          src={resolveAssetUrl(p.wallImage)}
                          alt={`${p.title} Wall`}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-slate-50 p-0.5 border border-slate-200 shadow-xs"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-white text-center font-bold py-0.5 rounded-b-xl">
                          Wall
                        </span>
                      </div>
                      <div className="relative group/thumb">
                        <img
                          src={resolveAssetUrl(p.closeupImage || p.wallImage)}
                          alt={`${p.title} Product`}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-slate-50 p-0.5 border border-slate-200 shadow-xs"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-amber-900/80 text-[8px] text-white text-center font-bold py-0.5 rounded-b-xl">
                          Product
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {p.badge || "Limited Edition"}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                        <span className={`text-[10px] font-bold ${p.inStock !== false ? 'text-emerald-700' : 'text-rose-600'}`}>
                          ● {p.inStock !== false ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                      <h3 className="font-playfair font-bold text-slate-900 text-base">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Frame: <strong>{p.woodFrame}</strong> • Size: <strong>{p.dimensions}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Edit Button, Quick Price & Delete */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* Quick Price Input */}
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Price (PKR):</span>
                      <input
                        type="number"
                        value={p.pricePKR}
                        onChange={(e) => handleUpdatePainting(p.id, 'pricePKR', e.target.value)}
                        className="w-24 sm:w-28 px-2 py-1 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs sm:text-sm focus:border-sky-500 outline-none text-right"
                      />
                    </div>

                    {/* Edit Details Button */}
                    <button
                      onClick={() => setEditingPainting({ ...p })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                      title="Edit artwork details and change images"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeletePainting(p.id, p.title)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                      title="Delete Painting"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP & STUDIO INFO */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 max-w-xl">
              <h2 className="text-base font-playfair font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Number & Studio Address</span>
              </h2>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 block">
                  Studio WhatsApp Number (Receives Order Notifications)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 923264784663"
                  value={studioInfo.whatsapp}
                  onChange={(e) => {
                    setStudioInfo(prev => ({ ...prev, whatsapp: e.target.value }));
                    showToast("WhatsApp number updated!");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm focus:border-sky-500 outline-none"
                />
                <span className="text-[11px] text-slate-500">
                  Begin number with country code without dashes or spaces (e.g. 923264784663).
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 block">
                  Faisalabad Studio Address
                </label>
                <input
                  type="text"
                  value={studioInfo.address}
                  onChange={(e) => {
                    setStudioInfo(prev => ({ ...prev, address: e.target.value }));
                    showToast("Address saved!");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-slate-900 text-sm focus:border-sky-500 outline-none"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 block">
                  Studio Tagline (Header & Hero Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={studioInfo.tagline}
                  onChange={(e) => {
                    setStudioInfo(prev => ({ ...prev, tagline: e.target.value }));
                    showToast("Tagline saved!");
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-sky-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OUR STORY (4 STEPS) */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-base font-playfair font-bold text-slate-900">
                Our Story • 4 Steps Content & Images
              </h2>
              <p className="text-xs text-slate-500">
                Customize the 4 story steps, headings, and images displayed under 'How Our Paintings Are Created' on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storySteps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                      Step 0{idx + 1}
                    </span>
                    <span className="text-slate-400 font-semibold">{step.label}</span>
                  </div>

                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full aspect-[16/9] rounded-xl object-cover border border-slate-200"
                  />

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Heading:</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStorySteps(prev => prev.map(s => s.id === step.id ? { ...s, title: val } : s));
                        showToast("Updated!");
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-bold focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Image Path / URL:</label>
                    <input
                      type="text"
                      value={step.image}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStorySteps(prev => prev.map(s => s.id === step.id ? { ...s, image: val } : s));
                        showToast("Updated!");
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
