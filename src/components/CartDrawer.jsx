import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  CheckCircle2,
  Loader2,
  Mail,
  PenLine,
  Printer,
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  Truck,
  CreditCard,
  ArrowRight,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrderToSupabase } from '@/lib/supabase';
import { resolveAssetUrl } from '@/lib/utils';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'advance'

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    customName: '',
  });

  if (!isOpen) return null;

  // Check if cart contains any customizable paintings
  const hasCustomizable = cartItems.some(
    (it) => it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5'
  );

  // Behind-the-scenes detection of Faisalabad
  const cityClean = (customer.city || '').trim().toLowerCase();
  const isFaisalabad = cityClean.includes('faisalabad') || cityClean === 'fsd';

  // Shipping calculation:
  // - If Faisalabad: Delivery charges = 0 (silently applied without drawing attention)
  // - Outside: Free on Advance, Rs. 250 on COD
  const shippingFee = isFaisalabad ? 0 : (paymentMethod === 'advance' ? 0 : 250);
  const deliveryTime = isFaisalabad ? '48 Hours (48 Ghantay)' : '4 to 7 Business Days (4–7 Din)';

  const subtotalPKR = cartItems.reduce((acc, item) => acc + (item.pricePKR * item.qty), 0);
  const grandTotalPKR = subtotalPKR + shippingFee;
  const grandTotalUSD = Math.round(grandTotalPKR / 278);

  // 50% advance for customizable paintings
  const advanceRequiredPKR = hasCustomizable
    ? Math.round(grandTotalPKR * 0.5)
    : (paymentMethod === 'advance' ? grandTotalPKR : 0);
  const balanceDuePKR = grandTotalPKR - advanceRequiredPKR;

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    setShowCheckoutForm(true);
  };

  // WhatsApp order
  const handleWhatsAppOrder = (finalReceipt = null) => {
    if (cartItems.length === 0 && !finalReceipt) return;

    const items = finalReceipt ? finalReceipt.items : cartItems;
    const cust = finalReceipt ? finalReceipt.customer : customer;
    const sFee = finalReceipt ? finalReceipt.shippingFee : shippingFee;
    const gTotal = finalReceipt ? finalReceipt.grandTotalPKR : grandTotalPKR;
    const dTime = finalReceipt ? finalReceipt.deliveryTime : deliveryTime;
    const hasCust = finalReceipt ? finalReceipt.hasCustomizable : hasCustomizable;
    const adv = finalReceipt ? finalReceipt.advanceRequiredPKR : advanceRequiredPKR;
    const bal = finalReceipt ? finalReceipt.balanceDuePKR : balanceDuePKR;
    const customTxt = (finalReceipt ? finalReceipt.customName : customer.customName).trim();
    const cityDisplay = cust.city || 'Pakistan';

    const itemsText = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.title}* (${it.dimensions})\n   Qty: ${it.qty} × Rs. ${it.pricePKR.toLocaleString()} = Rs. ${(it.pricePKR * it.qty).toLocaleString()}${
            it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5'
              ? `\n   ✍️ *Custom Name/Text:* ${customTxt || 'As discussed'}`
              : ''
          }`
      )
      .join('\n\n');

    let msg = `🎨 *WITHINARTS - ARTWORK ORDER*\n` +
      `--------------------------------\n` +
      (finalReceipt ? `*Receipt No:* ${finalReceipt.receiptNumber}\n` : '') +
      `*Customer Name:* ${cust.name || 'Art Collector'}\n` +
      `*Phone Number:* ${cust.phone || 'N/A'}\n` +
      `*City:* ${cityDisplay}\n` +
      `*Address:* ${cust.address || 'Address provided on WhatsApp'}\n` +
      `*Payment:* ${finalReceipt ? (finalReceipt.paymentMethod === 'advance' ? 'Advance Payment' : 'Cash on Delivery') : (paymentMethod === 'advance' ? 'Advance Payment' : 'Cash on Delivery')}\n\n` +
      `*Selected Acrylic Artworks:*\n${itemsText}\n\n` +
      `--------------------------------\n` +
      `*Subtotal:* Rs. ${subtotalPKR.toLocaleString()} PKR\n` +
      `*Delivery Charges:* Rs. ${sFee.toLocaleString()} PKR\n` +
      `*Estimated Delivery:* ${dTime}\n` +
      `*Total Amount:* Rs. ${gTotal.toLocaleString()} PKR\n`;

    if (hasCust) {
      msg += `\n⚠️ *Custom Artwork Notice:*\n` +
        `• 50% Advance Required: Rs. ${adv.toLocaleString()} PKR\n` +
        `• Balance on Delivery: Rs. ${bal.toLocaleString()} PKR\n` +
        `• Payment instructions (JazzCash/EasyPaisa/Bank) to be sent to ${cust.phone || 'my number'}.\n`;
    }

    // Auto-record order to Supabase
    saveOrderToSupabase({
      name: cust.name || 'WhatsApp Visitor',
      phone: cust.phone || '',
      city: cityDisplay,
      address: cust.address || '',
      customName: customTxt,
      items: items.map(it => ({
        id: it.id,
        title: it.title,
        dimensions: it.dimensions,
        woodFrame: it.woodFrame,
        pricePKR: it.pricePKR,
        qty: it.qty,
        wallImage: it.wallImage,
        isCustomizable: it.isCustomizable
      })),
      totalPKR: gTotal,
      totalUSD: grandTotalUSD,
      orderType: 'whatsapp',
      status: 'Pending',
      notes: `WhatsApp Order. Delivery: ${dTime}. Shipping: Rs. ${sFee}.`
    }).catch(err => console.warn('Supabase WhatsApp order save:', err));

    window.open(`https://wa.me/${whatsappNumber || '923264784663'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Direct checkout submit
  const handleDirectSubmit = async (e) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim() || !customer.city.trim() || !customer.address.trim()) {
      alert("Please enter your name, phone, city, and delivery address.");
      return;
    }

    if (hasCustomizable && !customer.customName.trim()) {
      alert("Please enter the custom name / text to write on your painting.");
      return;
    }

    setIsSubmitting(true);

    const generatedReceiptNo = `WA-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalCity = customer.city.trim();

    const receipt = {
      receiptNumber: generatedReceiptNo,
      date: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        city: finalCity,
        address: customer.address.trim()
      },
      customName: customer.customName.trim(),
      items: [...cartItems],
      subtotalPKR,
      shippingFee,
      grandTotalPKR,
      grandTotalUSD,
      deliveryTime,
      paymentMethod,
      hasCustomizable,
      advanceRequiredPKR,
      balanceDuePKR
    };

    const itemsSummary = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.title} (${it.dimensions}) | Qty: ${it.qty} × Rs. ${it.pricePKR.toLocaleString()} = Rs. ${(it.pricePKR * it.qty).toLocaleString()}${
            it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5'
              ? ` [Custom Text: ${customer.customName.trim() || 'None'}]`
              : ''
          }`
      )
      .join('\n');

    const recipientEmail = studioInfo?.email || 'withinarts057@gmail.com';

    try {
      // 1. Save directly into Supabase orders
      await saveOrderToSupabase({
        orderNumber: generatedReceiptNo,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        city: finalCity,
        address: customer.address.trim(),
        customName: customer.customName.trim(),
        items: cartItems.map(it => ({
          id: it.id,
          title: it.title,
          dimensions: it.dimensions,
          woodFrame: it.woodFrame,
          pricePKR: it.pricePKR,
          qty: it.qty,
          wallImage: it.wallImage,
          isCustomizable: it.isCustomizable
        })),
        totalPKR: grandTotalPKR,
        totalUSD: grandTotalUSD,
        orderType: 'website',
        status: 'Pending',
        notes: `Receipt #${generatedReceiptNo}. Delivery: ${deliveryTime}. City: ${finalCity}. Shipping: Rs. ${shippingFee}. Payment: ${paymentMethod}. Advance: Rs. ${advanceRequiredPKR}. Balance: Rs. ${balanceDuePKR}.`
      });

      // 2. Send email via FormSubmit AJAX
      await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🎨 Order Receipt ${generatedReceiptNo} - ${customer.name} (Rs. ${grandTotalPKR.toLocaleString()} PKR)`,
          _template: 'table',
          _captcha: 'false',
          'Receipt Number': generatedReceiptNo,
          'Customer Name': customer.name,
          'Phone / WhatsApp': customer.phone,
          'City': finalCity,
          'Delivery Address': customer.address,
          'Delivery Charges': `Rs. ${shippingFee} PKR`,
          'Delivery Timeframe': deliveryTime,
          'Payment Method': paymentMethod === 'advance' ? 'Advance Payment' : 'Cash on Delivery',
          'Custom Name / Text': customer.customName.trim() || 'Standard Piece',
          '50% Advance Required': hasCustomizable ? `Rs. ${advanceRequiredPKR.toLocaleString()} PKR (Message to ${customer.phone})` : 'N/A',
          'Remaining Balance on Delivery': `Rs. ${balanceDuePKR.toLocaleString()} PKR`,
          'Ordered Paintings': itemsSummary,
          'Grand Total': `Rs. ${grandTotalPKR.toLocaleString()} PKR`,
          'Order Submission Time': new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Order dispatch notice:', err);
    } finally {
      setIsSubmitting(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setReceiptData(receipt);
    }
  };

  const handleFinishAndClose = () => {
    onClearCart();
    setReceiptData(null);
    setShowCheckoutForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              {receiptData ? <FileText className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-sm text-slate-900 leading-tight">
                {receiptData ? 'Order Receipt Slip' : 'Your Art Bag'}
              </h3>
              <span className="text-[11px] text-slate-500">
                {receiptData
                  ? `Receipt #${receiptData.receiptNumber}`
                  : `${cartItems.length} ${cartItems.length === 1 ? 'painting' : 'paintings'}`}
              </span>
            </div>
          </div>

          <button
            onClick={receiptData ? handleFinishAndClose : onClose}
            className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* ============================================================ */}
          {/* 1. RECEIPT SLIP VIEW                                         */}
          {/* ============================================================ */}
          {receiptData ? (
            <div className="space-y-3">
              {/* Slip Header */}
              <div className="text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <h4 className="font-cinzel font-bold text-base text-slate-900">
                  Withinarts Studio Receipt
                </h4>
                <p className="text-[11px] text-slate-500">
                  #{receiptData.receiptNumber} • {receiptData.date}
                </p>
              </div>

              {/* Customer & Destination Summary */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <strong className="text-slate-800">{receiptData.customer.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <strong className="text-slate-800">{receiptData.customer.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">City:</span>
                  <strong className="text-slate-800">{receiptData.customer.city}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-slate-700 text-right max-w-[200px] truncate">{receiptData.customer.address}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <strong className="text-sky-800">{receiptData.deliveryTime}</strong>
                </div>
              </div>

              {/* Items List */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  Ordered Paintings
                </span>
                <div className="space-y-1.5 divide-y divide-slate-100">
                  {receiptData.items.map((it) => (
                    <div key={it.id} className="pt-1.5 first:pt-0 flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <strong className="text-slate-800 text-xs block truncate">{it.title}</strong>
                        <span className="text-[10px] text-slate-500 block">
                          Qty: {it.qty} × Rs. {it.pricePKR.toLocaleString()}
                        </span>
                        {(it.isCustomizable || it.id === 'wood-slice-3' || it.id === 'wood-slice-5') && (
                          <span className="text-[10px] text-purple-700 font-medium block">
                            ✍️ Custom Text: <strong>"{receiptData.customName}"</strong>
                          </span>
                        )}
                      </div>
                      <strong className="text-slate-900 text-xs shrink-0">
                        Rs. {(it.pricePKR * it.qty).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">Rs. {receiptData.subtotalPKR.toLocaleString()} PKR</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-slate-800">
                    Rs. {receiptData.shippingFee.toLocaleString()} PKR
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-xs">Grand Total:</span>
                  <span className="text-sm">Rs. {receiptData.grandTotalPKR.toLocaleString()} PKR</span>
                </div>

                {/* 50% Advance Notice if customizable */}
                {receiptData.hasCustomizable && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-amber-950">
                      <span>50% Advance Required:</span>
                      <span>Rs. {receiptData.advanceRequiredPKR.toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[10px]">
                      <span>Remaining on Delivery:</span>
                      <span>Rs. {receiptData.balanceDuePKR.toLocaleString()} PKR</span>
                    </div>
                    <p className="text-[10px] text-amber-800 pt-0.5 leading-snug">
                      📲 50% Advance payment ke details (JazzCash/EasyPaisa/Bank) aapke number <strong>{receiptData.customer.phone}</strong> par message kar diye gaye hain.
                    </p>
                  </div>
                )}
              </div>

              {/* Receipt Action Buttons (Compact) */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleWhatsAppOrder(receiptData)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Receipt on WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3 h-3 text-slate-500" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishAndClose}
                    className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-white flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Done</span>
                  </button>
                </div>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            /* ============================================================ */
            /* 2. EMPTY BAG VIEW                                            */
            /* ============================================================ */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-cinzel font-bold text-sm text-slate-900">Your bag is empty</h4>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Browse our collection of hand-painted acrylic artworks.
              </p>
              <button
                onClick={onClose}
                className="mt-1 px-4 py-2 rounded-lg bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Explore Paintings
              </button>
            </div>
          ) : showCheckoutForm ? (
            /* ============================================================ */
            /* 3. COMPACT & SIMPLE CHECKOUT FORM VIEW                       */
            /* ============================================================ */
            <form onSubmit={handleDirectSubmit} className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Checkout Information
                </h4>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-900 underline cursor-pointer"
                >
                  Back to Bag
                </button>
              </div>

              {/* Custom Name / Text (Only if customizable item in cart) */}
              {hasCustomizable && (
                <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 space-y-1">
                  <label className="flex items-center justify-between text-[11px] font-bold text-purple-950">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Name / Text to Write on Painting *
                    </span>
                    <span className="text-[9px] text-purple-600 font-semibold bg-purple-100 px-1.5 py-0.2 rounded">
                      50% Advance
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.customName}
                    onChange={(e) => setCustomer({ ...customer, customName: e.target.value })}
                    placeholder="e.g. Malik Family, Ahmad & Ayesha • 2024"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-300 text-slate-900 text-xs outline-none focus:border-purple-600 font-medium"
                  />
                  <p className="text-[10px] text-purple-700">
                    Custom piece requires 50% advance deposit via SMS/WhatsApp.
                  </p>
                </div>
              )}

              {/* Standard Inputs */}
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="e.g. Tariq Jamil"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="0300-1234567"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-medium mb-0.5">City *</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="e.g. Faisalabad, Lahore, Karachi..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="House #, Street, Area / Sector"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-sky-500"
                />
              </div>

              {/* Payment Mode Pills (Compact) */}
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Cash on Delivery
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('advance')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'advance'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Advance Payment
                  </button>
                </div>
              </div>

              {/* Small Summary Strip */}
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-slate-800">
                    Rs. {shippingFee.toLocaleString()} PKR
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Time:</span>
                  <span className="font-semibold text-slate-800">{deliveryTime}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-xs">
                  <span>Total Amount:</span>
                  <span>Rs. {grandTotalPKR.toLocaleString()} PKR</span>
                </div>
              </div>

              {/* Submit Button (Compact) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Complete Order & Get Receipt</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ============================================================ */
            /* 4. ITEMS LIST VIEW                                           */
            /* ============================================================ */
            <div className="space-y-2.5">
              {/* Optional Custom text prompt in cart if customizable */}
              {hasCustomizable && (
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                  <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    Customize Painting Name / Text
                  </span>
                  <input
                    type="text"
                    value={customer.customName}
                    onChange={(e) => setCustomer({ ...customer, customName: e.target.value })}
                    placeholder="e.g. Malik Family, Ahmad & Ayesha • 2024"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-slate-900 text-xs outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Items List */}
              {cartItems.map((item) => {
                const itemIsCustomizable = Boolean(
                  item.isCustomizable || item.id === 'wood-slice-3' || item.id === 'wood-slice-5'
                );

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img src={resolveAssetUrl(item.wallImage)} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-cinzel font-bold text-xs text-slate-900 truncate">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {item.dimensions}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-sky-700 font-heading">
                          Rs. {(item.pricePKR * item.qty).toLocaleString()}
                        </span>
                        {itemIsCustomizable && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[9px] font-semibold">
                            Customizable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Qty & Delete (Compact) */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-0.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs">
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty - 1)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer p-0.5"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-semibold text-slate-800 text-[11px] px-1">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer p-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer (Compact) */}
        {cartItems.length > 0 && !showCheckoutForm && !receiptData && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Subtotal</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-heading text-slate-900">
                  Rs. {subtotalPKR.toLocaleString()} PKR
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleProceedToCheckout}
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleWhatsAppOrder()}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
