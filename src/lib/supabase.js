import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ynlkabxzlbdjhhygcddd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PkmzTBaOEaZc0orwzrdnxQ_zTPInubr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/paintings`;

/**
 * Returns public Supabase URL for an image name or path
 */
export function getStorageImageUrl(fileNameOrPath) {
  if (!fileNameOrPath || typeof fileNameOrPath !== 'string') return '';
  if (
    fileNameOrPath.startsWith('http://') ||
    fileNameOrPath.startsWith('https://') ||
    fileNameOrPath.startsWith('data:') ||
    fileNameOrPath.startsWith('blob:')
  ) {
    return fileNameOrPath;
  }
  // Strip leading /images/ or images/
  const clean = fileNameOrPath.replace(/^\/?(images\/)?/, '');
  return `${SUPABASE_STORAGE_URL}/${clean}`;
}

/**
 * Save an order to Supabase
 */
export async function saveOrderToSupabase(orderData) {
  try {
    const payload = {
      order_number: orderData.orderNumber || `WA-${Date.now().toString().slice(-6)}`,
      customer_name: orderData.name || orderData.customer_name || 'Anonymous Collector',
      customer_phone: orderData.phone || orderData.customer_phone || '',
      customer_city: orderData.city || orderData.customer_city || '',
      customer_address: orderData.address || orderData.customer_address || '',
      custom_name_text: orderData.customName || orderData.custom_name_text || '',
      items: orderData.items || [],
      total_pkr: Number(orderData.totalPKR || orderData.total_pkr || 0),
      total_usd: Number(orderData.totalUSD || orderData.total_usd || 0),
      order_type: orderData.orderType || orderData.order_type || 'website',
      status: orderData.status || 'Pending',
      notes: orderData.notes || '',
    };

    const { data, error } = await supabase.from('orders').insert([payload]).select();

    if (error) {
      console.warn('Supabase order insert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error('saveOrderToSupabase error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all orders from Supabase (ordered by newest first)
 */
export async function fetchOrdersFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders warning:', error.message);
      return { success: false, orders: [], error: error.message };
    }
    return { success: true, orders: data || [] };
  } catch (err) {
    console.error('fetchOrdersFromSupabase error:', err);
    return { success: false, orders: [], error: err.message };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatusInSupabase(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select();

    if (error) {
      console.warn('Supabase update order status error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error('updateOrderStatusInSupabase error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete order
 */
export async function deleteOrderFromSupabase(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.warn('Supabase delete order error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('deleteOrderFromSupabase error:', err);
    return { success: false, error: err.message };
  }
}
