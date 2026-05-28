// Supabase Edge Function — M-Pesa STK Push (Daraja API)
//
// Deploy with:   supabase functions deploy mpesa-stk-push --no-verify-jwt
// Invoke with:
//   const { data } = await supabase.functions.invoke('mpesa-stk-push', {
//     body: { phone: '254712345678', amount: 5000, member_id: '<uuid>' }
//   })
//
// Required secrets (set with `supabase secrets set ...`):
//   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET,
//   MPESA_SHORTCODE, MPESA_PASSKEY,
//   MPESA_CALLBACK_URL

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StkRequest {
  phone:     string   // 254XXXXXXXXX
  amount:    number
  member_id: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { phone, amount, member_id } = (await req.json()) as StkRequest

    // ── 1) Get OAuth token ────────────────────────────────────────
    const consumerKey    = Deno.env.get('MPESA_CONSUMER_KEY')!
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')!
    const credentials    = btoa(`${consumerKey}:${consumerSecret}`)
    const authRes = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${credentials}` } },
    )
    const { access_token } = await authRes.json()

    // ── 2) Build the STK push payload ─────────────────────────────
    const shortcode = Deno.env.get('MPESA_SHORTCODE')!
    const passkey   = Deno.env.get('MPESA_PASSKEY')!
    const timestamp = new Date().toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14)
    const password  = btoa(shortcode + passkey + timestamp)

    const stkRes = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password:          password,
          Timestamp:         timestamp,
          TransactionType:   'CustomerPayBillOnline',
          Amount:            amount,
          PartyA:            phone,
          PartyB:            shortcode,
          PhoneNumber:       phone,
          CallBackURL:       Deno.env.get('MPESA_CALLBACK_URL')!,
          AccountReference:  member_id,
          TransactionDesc:   'SACCO contribution',
        }),
      },
    )
    const stkData = await stkRes.json()

    // ── 3) Log a PENDING transaction so we can reconcile on callback ─
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    await supabase.from('transactions').insert({
      sacco_id:  '<resolved-from-member>',  // TODO: lookup
      member_id: member_id,
      txn_type:  'CONTRIBUTION',
      amount:    amount,
      method:    'M_PESA',
      reference: stkData.CheckoutRequestID ?? 'PENDING',
      status:    'PENDING',
      metadata:  { stk_request: stkData },
    })

    return new Response(JSON.stringify({ success: true, data: stkData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
