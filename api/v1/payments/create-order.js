import crypto from 'crypto';

export default async function handler(req, res) {
  // 1. Enable CORS for local and production use
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { amount, customer_id, customer_email, description } = req.body;

  // JusPay Credentials from your .env
  const merchantId = process.env.JUSPAY_MERCHANT_ID;
  const apiKey = process.env.JUSPAY_API_KEY;
  const baseUrl = process.env.JUSPAY_BASE_URL; // https://smartgateway.hdfcuat.bank.in
  const orderId = `order_${Date.now()}`;

  try {
    // 2. Prepare the Request Body for JusPay
    const requestData = {
      order_id: orderId,
      amount: amount || 499,
      customer_id: customer_id || 'guest_user',
      customer_email: customer_email || '',
      currency: 'INR',
      action: 'paymentPage',
      return_url: `${process.env.VERCEL_URL || 'http://localhost:5173'}/payment-status`,
      description: description || 'Ikshan Premium Unlock'
    };

    // 3. Make the API Call to JusPay/HDFC
    // We use Basic Auth with your API Key
    const authHeader = Buffer.from(`${apiKey}:`).toString('base64');

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        'x-merchantid': merchantId
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'JusPay API Error');
    }

    const data = await response.json();

    // 4. Return the order data and payment links to the frontend
    return res.status(200).json({
      success: true,
      order_id: data.order_id,
      payment_links: data.payment_links,
      status: data.status
    });

  } catch (error) {
    console.error('Payment Order Creation Failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
