import React, { useState } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, Edit2, Image, Layers, Sparkles, MapPin, TreePine, Paintbrush, PackageCheck, Phone, CheckCircle2 } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export function StudioManagerModal({
  isOpen,
  onClose,
  paintings,
  setPaintings,
  storySteps,
  setStorySteps,
  studioInfo,
  setStudioInfo,
  onResetDefaults
}) {
  const [activeTab, setActiveTab] = useState('paintings'); // 'paintings', 'story', 'settings'
  const [editingPaintingId, setEditingPaintingId] = useState(null);
  const [showNewPaintingForm, setShowNewPaintingForm] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Draft state for adding a new painting
  const [newPainting, setNewPainting] = useState({
    title: '',
    category: 'Islamic Calligraphy',
    medium: 'Oil on Linen Canvas with Gold Leaf',
    dimensions: '36 x 48 inches',
    woodFrame: 'Seasoned Sheesham Wood (Faisalabad Carpentry)',
    pricePKR: 45000,
    priceUSD: 160,
    badge: 'Limited Edition',
    wallImage: '/images/painting_wall_1.jpg',
    closeupImage: '/images/painting_closeup_1.jpg',
    description: '',
    inStock: true
  });

  if (!isOpen) return null;

  const triggerSaveNotification = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleUpdatePainting = (id, field, value) => {
    setPaintings(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    triggerSaveNotification();
  };

  const handleDeletePainting = (id) => {
    if (confirm("Are you sure you want to remove this painting from the gallery?")) {
      setPaintings(prev => prev.filter(p => p.id !== id));
      triggerSaveNotification();
    }
  };

  const handleAddNewPainting = (e) => {
    e.preventDefault();
    if (!newPainting.title) {
      alert("Please enter a painting title");
      return;
    }
    const created = {
      ...newPainting,
      id: `painting-${Date.now()}`,
      priceUSD: Math.round(newPainting.pricePKR / 278)
    };
    setPaintings(prev => [created, ...prev]);
    setShowNewPaintingForm(false);
    setNewPainting({
      title: '',
      category: 'Islamic Calligraphy',
      medium: 'Oil on Linen Canvas with Gold Leaf',
      dimensions: '36 x 48 inches',
      woodFrame: 'Seasoned Sheesham Wood (Faisalabad Carpentry)',
      pricePKR: 45000,
      priceUSD: 160,
      badge: 'Limited Edition',
      wallImage: '/images/painting_wall_1.jpg',
      closeupImage: '/images/painting_closeup_1.jpg',
      description: '',
      inStock: true
    });
    triggerSaveNotification();
  };

  const handleUpdateStoryStep = (id, field, value) => {
    setStorySteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    triggerSaveNotification();
  };

  const handleUpdateStudioInfo = (field, value) => {
    setStudioInfo(prev => ({ ...prev, [field]: value }));
    triggerSaveNotification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-rose-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-slate-900 flex items-center gap-2">
                <span>Studio Admin & Content Manager</span>
                {savedNotification && (
                  <span className="text-xs font-sans font-medium text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Saved
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Manage paintings, badges (Limited Edition, Hot Item), Our Story 4 steps & paste image URLs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              title="Reset to default curated paintings and story"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('paintings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'paintings'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paintings & Wall/Hover Images ({paintings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'story'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Our Story 4 Steps & Images (Heritage, Wood, Brushwork, Jute)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Faisalabad Office & WhatsApp</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: PAINTINGS MANAGER */}
          {activeTab === 'paintings' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-600">
                  Total Artworks: <strong className="text-slate-900">{paintings.length}</strong>.
                  For each artwork, specify the <strong className="text-sky-700">Wall Image</strong> and the interactive <strong className="text-amber-700">Closeup Zoom Image</strong>.
                </div>
                <button
                  onClick={() => setShowNewPaintingForm(!showNewPaintingForm)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Painting</span>
                </button>
              </div>

              {/* Add New Painting Form */}
              {showNewPaintingForm && (
                <form onSubmit={handleAddNewPainting} className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-sky-800 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Create New Artwork Entry</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs mb-4">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Painting Title *</label>
                      <input
                        type="text"
                        value={newPainting.title}
                        onChange={(e) => setNewPainting({ ...newPainting, title: e.target.value })}
                        placeholder="e.g. Royal Bismillah Lapiz"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Category</label>
                      <select
                        value={newPainting.category}
                        onChange={(e) => setNewPainting({ ...newPainting, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      >
                        <option value="Islamic Calligraphy">Islamic Calligraphy</option>
                        <option value="Sufi Art">Sufi Art</option>
                        <option value="Pakistani Landscape">Pakistani Landscape</option>
                        <option value="Impasto Abstract">Impasto Abstract</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Attractive Badge Tag</label>
                      <select
                        value={newPainting.badge}
                        onChange={(e) => setNewPainting({ ...newPainting, badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      >
                        <option value="Limited Edition">Limited Edition</option>
                        <option value="Hot Item">Hot Item</option>
                        <option value="Masterpiece">Masterpiece</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Staff Pick">Staff Pick</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Price (PKR)</label>
                      <input
                        type="number"
                        value={newPainting.pricePKR}
                        onChange={(e) => setNewPainting({ ...newPainting, pricePKR: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Canvas Dimensions</label>
                      <input
                        type="text"
                        value={newPainting.dimensions}
                        onChange={(e) => setNewPainting({ ...newPainting, dimensions: e.target.value })}
                        placeholder="e.g. 36 x 48 inches"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Stretcher Wood Frame</label>
                      <input
                        type="text"
                        value={newPainting.woodFrame}
                        onChange={(e) => setNewPainting({ ...newPainting, woodFrame: e.target.value })}
                        placeholder="e.g. Seasoned Sheesham Wood (Faisalabad)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-medium mb-1">Medium & Technique</label>
                      <input
                        type="text"
                        value={newPainting.medium}
                        onChange={(e) => setNewPainting({ ...newPainting, medium: e.target.value })}
                        placeholder="e.g. Heavy Impasto Oil & 24K Real Gold Leaf"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-slate-600 font-medium mb-1">Stock Status</label>
                      <select
                        value={newPainting.inStock ? 'true' : 'false'}
                        onChange={(e) => setNewPainting({ ...newPainting, inStock: e.target.value === 'true' })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      >
                        <option value="true">In Stock (Faisalabad)</option>
                        <option value="false">Made to Order (7 Days)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-600 font-medium mb-1">Art Description</label>
                      <textarea
                        value={newPainting.description}
                        onChange={(e) => setNewPainting({ ...newPainting, description: e.target.value })}
                        rows={2}
                        placeholder="Describe the inspiration, texture and fine art details..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    {/* Image URLs */}
                    <div className="sm:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-xl bg-white border border-slate-200">
                      <div>
                        <label className="block text-sky-800 font-bold mb-1">
                          🖼️ 1. Wall View Image URL (Display Mockup)
                        </label>
                        <input
                          type="text"
                          value={newPainting.wallImage}
                          onChange={(e) => setNewPainting({ ...newPainting, wallImage: e.target.value })}
                          placeholder="Paste image URL here (/images/... or https://...)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-sky-500 outline-none mb-2"
                        />
                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
                          <img src={newPainting.wallImage} alt="Wall preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-800 font-bold shadow-sm">
                            Wall Preview
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sky-800 font-bold mb-1">
                          🔍 2. Hover Close-Up / Portrait Image (Lens Zoom URL)
                        </label>
                        <input
                          type="text"
                          value={newPainting.closeupImage}
                          onChange={(e) => setNewPainting({ ...newPainting, closeupImage: e.target.value })}
                          placeholder="Paste close-up macro image URL here"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-sky-500 outline-none mb-2"
                        />
                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
                          <img src={newPainting.closeupImage} alt="Closeup preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-800 font-bold shadow-sm">
                            Closeup Lens Preview
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
                    >
                      Save & Add to Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewPaintingForm(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Paintings List with Inline Editing */}
              <div className="space-y-4">
                {paintings.map((painting, idx) => (
                  <div
                    key={painting.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-sm transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-cinzel font-bold text-base text-slate-900">{painting.title}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                              {painting.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {painting.category} • Rs. {painting.pricePKR?.toLocaleString()} PKR • {painting.dimensions}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPaintingId(editingPaintingId === painting.id ? null : painting.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                          <span>{editingPaintingId === painting.id ? 'Close Edit' : 'Edit Details & Images'}</span>
                        </button>

                        <button
                          onClick={() => handleDeletePainting(painting.id)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors"
                          title="Delete painting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Image Previews */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                          <span>Wall View Image:</span>
                        </span>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                          <img src={painting.wallImage} alt="Wall" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                          <span>Hover Closeup (Lens):</span>
                        </span>
                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                          <img src={painting.closeupImage} alt="Closeup" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="col-span-2 space-y-1 text-slate-700 text-xs">
                        <span className="text-slate-600 font-semibold block text-[11px]">Stretcher Wood Frame:</span>
                        <p className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
                          {painting.woodFrame}
                        </p>
                        <span className="text-slate-600 font-semibold block text-[11px] pt-1">Description:</span>
                        <p className="line-clamp-2 text-slate-600 text-[11px]">
                          {painting.description}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Edit Form */}
                    {editingPaintingId === painting.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={painting.title}
                            onChange={(e) => handleUpdatePainting(painting.id, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Badge Tag</label>
                          <select
                            value={painting.badge}
                            onChange={(e) => handleUpdatePainting(painting.id, 'badge', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-sky-500"
                          >
                            <option value="Limited Edition">Limited Edition</option>
                            <option value="Hot Item">Hot Item</option>
                            <option value="Masterpiece">Masterpiece</option>
                            <option value="Best Seller">Best Seller</option>
                            <option value="Exclusive">Exclusive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Price (PKR)</label>
                          <input
                            type="number"
                            value={painting.pricePKR}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              handleUpdatePainting(painting.id, 'pricePKR', val);
                              handleUpdatePainting(painting.id, 'priceUSD', Math.round(val / 278));
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium mb-1">Dimensions</label>
                          <input
                            type="text"
                            value={painting.dimensions}
                            onChange={(e) => handleUpdatePainting(painting.id, 'dimensions', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-sky-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-600 font-medium mb-1">Stretcher Wood Frame Specification</label>
                          <input
                            type="text"
                            value={painting.woodFrame}
                            onChange={(e) => handleUpdatePainting(painting.id, 'woodFrame', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-sky-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sky-800 font-bold mb-1">
                            🖼️ Paste Wall Image URL (Gallery Display View):
                          </label>
                          <input
                            type="text"
                            value={painting.wallImage}
                            onChange={(e) => handleUpdatePainting(painting.id, 'wallImage', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-sky-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sky-800 font-bold mb-1">
                            🔍 Paste Closeup Image URL (Aceternity Lens Macro View):
                          </label>
                          <input
                            type="text"
                            value={painting.closeupImage}
                            onChange={(e) => handleUpdatePainting(painting.id, 'closeupImage', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-sky-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-slate-600 font-medium mb-1">Description</label>
                          <textarea
                            value={painting.description}
                            onChange={(e) => handleUpdatePainting(painting.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-sky-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OUR STORY 4 STEPS MANAGER */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                <span className="font-bold">Our Story Management:</span> Customize the 4 narrative chapters (Studio Heritage, Seasoned Hardwood, Master Brushwork, Signature Packaging). Updated image URLs immediately reflect across the website and in interactive hover LinkPreviews!
              </div>

              {storySteps.map((step, idx) => (
                <div key={step.id || idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h4 className="font-cinzel font-bold text-base text-slate-900">{step.title}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      Step {idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Step Main Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleUpdateStoryStep(step.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Subtitle / Punchline</label>
                        <input
                          type="text"
                          value={step.subtitle}
                          onChange={(e) => handleUpdateStoryStep(step.id, 'subtitle', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Material / Wood / Spec Highlight</label>
                        <input
                          type="text"
                          value={step.woodName}
                          onChange={(e) => handleUpdateStoryStep(step.id, 'woodName', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-amber-900 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Detailed Story Text</label>
                        <textarea
                          value={step.description}
                          onChange={(e) => handleUpdateStoryStep(step.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 leading-relaxed focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sky-800 font-bold mb-1">
                          🖼️ Paste Image URL for this Story Step:
                        </label>
                        <input
                          type="text"
                          value={step.image}
                          onChange={(e) => handleUpdateStoryStep(step.id, 'image', e.target.value)}
                          placeholder="Paste image URL (/images/... or external https://...)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* Live Preview of the Image */}
                    <div className="flex flex-col justify-start">
                      <span className="text-slate-600 font-medium mb-1.5 block">Live Image Preview:</span>
                      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 block">
                        Displays in Our Story card & Aceternity LinkPreview popup.
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: STUDIO SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-5 text-xs">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-sky-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Studio Identity & Location in Faisalabad</span>
                </h3>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Studio Brand Name</label>
                  <input
                    type="text"
                    value={studioInfo.name}
                    onChange={(e) => handleUpdateStudioInfo('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tagline</label>
                  <input
                    type="text"
                    value={studioInfo.tagline}
                    onChange={(e) => handleUpdateStudioInfo('tagline', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Faisalabad Studio Address / Office Location</label>
                  <input
                    type="text"
                    value={studioInfo.address}
                    onChange={(e) => handleUpdateStudioInfo('address', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">WhatsApp Ordering Number (Without + or spaces)</label>
                    <input
                      type="text"
                      value={studioInfo.whatsapp}
                      onChange={(e) => handleUpdateStudioInfo('whatsapp', e.target.value)}
                      placeholder="e.g. 923007654321"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:border-sky-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Used for direct WhatsApp order buttons.</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Display Phone Number</label>
                    <input
                      type="text"
                      value={studioInfo.phone}
                      onChange={(e) => handleUpdateStudioInfo('phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    value={studioInfo.announcement}
                    onChange={(e) => handleUpdateStudioInfo('announcement', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            All modifications are instantly saved to browser storage and applied across the website.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            Done / Close Manager
          </button>
        </div>
      </div>
    </div>
  );
}
