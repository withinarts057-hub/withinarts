import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ShieldCheck, PackageCheck, Sparkles, CheckCircle2, Loader2, Mail, PenLine } from 'lucide-react';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import confetti from 'canvas-confetti';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  studioInfo
}) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Faisalabad',
    address: '',
    customName: '',
    notes: 'Please pack carefully in signature jute wrap with wax seal.'
  });

  if (!isOpen) return null;

  const totalPKR = cartItems.reduce((acc, item) => acc + (item.pricePKR * item.qty), 0);
  const totalUSD = Math.round(totalPKR / 278);

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    let itemsText = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.title}* (${it.dimensions})\n   Frame: ${it.woodFrame}\n   Qty: ${it.qty} × Rs. ${it.pricePKR.toLocaleString()} = Rs. ${(it.pricePKR * it.qty).toLocaleString()}`
      )
      .join('\n\n');

    const customLine = customer.customName.trim()
      ? `\n\n✍️ *Custom Name/Text for Painting:* ${customer.customName.trim()}`
      : '';

    let msg = `Hello Withinart!\nI would like to place an order for the following handmade artwork(s):\n\n${itemsText}\n\n*Total Amount:* Rs. ${totalPKR.toLocaleString()} PKR (~$${totalUSD} USD)${customLine}\n\n*Delivery Address:* ${customer.address ? `${customer.name}, ${customer.address}, ${customer.city} (${customer.phone})` : 'Kindly confirm delivery schedule and signature jute packaging.'}`;

    window.open(`https://wa.me/${whatsappNumber || '923007654321'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDirectSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Please provide your name, phone, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    const itemsSummary = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.title} (${it.dimensions}) | Frame: ${it.woodFrame} | Qty: ${it.qty} × Rs. ${it.pricePKR.toLocaleString()} = Rs. ${(it.pricePKR * it.qty).toLocaleString()}`
      )
      .join('\n');

    const recipientEmail = studioInfo?.email || 'msaadzia44@gmail.com';

    try {
      // Send order details to msaadzia44@gmail.com via FormSubmit AJAX API
      await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🎨 New Artwork Order - ${customer.name} (Rs. ${totalPKR.toLocaleString()} PKR)`,
          _template: 'table',
          _captcha: 'false',
          'Customer Name': customer.name,
          'Phone / WhatsApp': customer.phone,
          'Customer Email': customer.email || 'Not Provided',
          'Delivery City': customer.city,
          'Full Address': customer.address,
          '✍️ Custom Name/Text for Painting': customer.customName.trim() || 'Not Specified',
          'Ordered Paintings': itemsSummary,
          'Total Amount': `Rs. ${totalPKR.toLocaleString()} PKR (~$${totalUSD} USD)`,
          'Packing Requirement': 'Signature Eco Jute Burlap with Wax Seal',
          'Order Submission Time': new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Order email dispatch notice:', err);
    } finally {
      setIsSubmitting(false);

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setOrderSuccess(true);
      setTimeout(() => {
        onClearCart();
        setOrderSuccess(false);
        setShowCheckoutForm(false);
        onClose();
      }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-lg text-slate-900">Your Art Bag</h3>
              <span className="text-xs text-slate-500 font-medium">
                {cartItems.length} {cartItems.length === 1 ? 'painting' : 'paintings'} selected
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                Thank you, <strong>{customer.name}</strong>! Your order details have been received and sent to our official studio email (<span className="text-sky-700 font-bold underline">{studioInfo?.email || 'msaadzia44@gmail.com'}</span>).
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium space-y-1 text-left">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <PackageCheck className="w-4 h-4 text-amber-600" />
                  <span>Next Step:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Our studio team will contact you shortly at <strong>{customer.phone}</strong> to confirm dispatch in our signature eco-friendly jute burlap packaging.
                </p>
              </div>

              {/* Optional WhatsApp instant contact */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="mt-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Copy on WhatsApp</span>
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-cinzel font-bold text-lg text-slate-900">Your bag is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our gallery collection of hand-painted artworks from Faisalabad and add your favorite piece.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20"
              >
                Explore Paintings
              </button>
            </div>
          ) : showCheckoutForm ? (
            /* Checkout Form View */
            <form onSubmit={handleDirectSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-sm font-bold text-sky-800">Delivery Information (Pakistan & Global)</h4>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline"
                >
                  Back to Bag
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="e.g. Tariq Jamil"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional - for digital receipt)</span>
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="e.g. customer@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="Faisalabad, Lahore, Karachi..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-medium mb-1">Complete Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="House #, Street, Area / Sector, City"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                />
              </div>

              {/* Custom Name/Text for Painting */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border border-amber-200/80 shadow-sm">
                <label className="flex items-center gap-2 text-xs text-amber-900 font-bold mb-1.5">
                  <PenLine className="w-3.5 h-3.5 text-amber-600" />
                  <span>Custom Name / Text to Write on Painting</span>
                  <span className="text-amber-500 font-normal text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={customer.customName}
                  onChange={(e) => setCustomer({ ...customer, customName: e.target.value })}
                  placeholder="e.g. Muhammad Ali, Ayesha, or any custom text…"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-amber-200 text-slate-900 text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 transition-all placeholder:text-slate-400"
                  maxLength={100}
                />
                <p className="text-[10px] text-amber-700/70 mt-1 leading-relaxed">
                  This name/text will be hand-painted or engraved onto your artwork by our master calligrapher.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-start gap-2">
                <PackageCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Every painting is inspected in our Faisalabad workshop and shipped in traditional rustic jute burlap wrap with wax seal & wooden corner guards.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Order Sending to Studio ({studioInfo?.email || 'msaadzia44@gmail.com'})...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-white" />
                    <span>Complete Order (Rs. {totalPKR.toLocaleString()} PKR)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Items List */
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3"
                >
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img src={item.wallImage} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-cinzel font-bold text-xs text-slate-900 truncate">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {item.dimensions} • {item.woodFrame}
                    </span>
                    <span className="text-xs font-bold text-sky-700 font-heading">
                      Rs. {(item.pricePKR * item.qty).toLocaleString()} PKR
                    </span>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold text-slate-800 px-1">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && !showCheckoutForm && !orderSuccess && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Free Shipping & Jute Seal Assurance */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Free Safe Shipping in Pakistan</span>
              </span>
              <span className="text-amber-800 font-semibold">Jute Fabric Packaging</span>
            </div>

            {/* Total Row */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-xs text-slate-600 font-bold block">Total Investment</span>
                <span className="text-[11px] text-slate-400">Tax & Packaging Included</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-heading text-slate-900 block">
                  Rs. {totalPKR.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">
                  (~${totalUSD} USD)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Direct Checkout</span>
              </button>

              <div className="flex items-center justify-end">
                <LiquidMetalButton
                  label="WhatsApp Order"
                  icon={<MessageCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  onClick={handleWhatsAppOrder}
                  width={155}
                  height={42}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
