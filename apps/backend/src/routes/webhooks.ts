import { Bindings, Variables } from "@repo/types/index";
import { Hono } from "hono";
import { hexToUint8Array } from "../utils/hexToUint8Array";
import axios from "axios";
import { headers } from "../utils/lemonSqueezy";
import { users } from "@repo/db/index";
import { and, eq } from "drizzle-orm";
import { createCacheKey } from "../utils/cacheKey";
const webhooks = new Hono<{ Bindings: Bindings, Variables: Variables }>()

webhooks.post('/lemonsqueezy', async (c) => {
  try {
    const db = c.get('db')
    const secret = c.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE
    const signature = c.req.header('X-Signature')
    const body = await c.req.text()
    if (!body) {
      return c.json({
        success: false,
        message: "Invalid request body. Please check your request."
      }, 400);
    }

    if (!signature || !secret) {
      return c.json({
        success: false,
        message: "Invalid signature. Please check your request."
      }, 401);
    }

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const data = encoder.encode(body)
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToUint8Array(signature),
      data
    )

    if (!isValid) {
      return c.json({
        success: false,
        message: "Invalid signature. Please check your request."
      }, 401);
    }

    const parsedBody = JSON.parse(body)
    const event_name = parsedBody?.meta?.event_name
    const userId = parsedBody?.meta?.custom_data?.userId || null
    switch (event_name) {
      case 'subscription_payment_success': {
        try {
          const subscriptionId = parsedBody?.data?.attributes?.subscription_id;
          const customerId = parsedBody?.data?.attributes?.customer_id;
          const email = parsedBody?.data?.attributes?.user_email;

          if (!email || !customerId || !subscriptionId || !userId) {
            const missingFields = [];
            if (!email) missingFields.push('email');
            if (!customerId) missingFields.push('customerId');
            if (!subscriptionId) missingFields.push('subscriptionId');
            if (!userId) missingFields.push('userId');
            console.log(`Missing fields ${missingFields.join(', ')}, skipping update for subscription_payment_success`);
            break;
          }

          const subscriptionData = await axios.get(`${c.env.LEMON_SQUEEZY_API_URL}/subscriptions/${subscriptionId}`, {
            headers: headers(c.env.LEMON_SQUEEZY_API_KEY)
          });

          const renewalDate = subscriptionData.data?.data?.attributes.renews_at;
          const endDate = subscriptionData.data?.data?.attributes.ends_at;
          const status = subscriptionData.data?.data?.attributes.status;

          await db.update(users).set({
            customerId: customerId,
            endsAt: new Date(endDate) || null,
            renewsAt: new Date(renewalDate) || null,
            proStatus: status || null,
            tier: 'pro',
            quota: 300
          }).where(and(eq(users.id, userId), eq(users.email, email))).execute();
        } catch (error) {
          console.error('Error in subscription_payment_success:', error, parsedBody);
        }
        break;
      }

      case 'subscription_updated': {
        try {
          const status = parsedBody?.data?.attributes.status;
          const customerId = parsedBody?.data?.attributes.customer_id;
          const email = parsedBody?.data?.attributes.user_email;
          const subscriptionId = parsedBody?.data?.id;

          if (!email || !customerId || !subscriptionId || !userId) {
            const missingFields = [];
            if (!email) missingFields.push('email');
            if (!customerId) missingFields.push('customerId');
            if (!subscriptionId) missingFields.push('subscriptionId');
            if (!userId) missingFields.push('userId');
            console.log(`Missing fields ${missingFields.join(', ')}, skipping update for subscription_updated`);
            break;
          }

          const subscriptionData = await axios.get(`${c.env.LEMON_SQUEEZY_API_URL}/subscriptions/${subscriptionId}`, {
            headers: headers(c.env.LEMON_SQUEEZY_API_KEY)
          });

          const renewalDate = subscriptionData.data?.data?.attributes.renews_at;
          const endDate = subscriptionData.data?.data?.attributes.ends_at;
          let updateBody: any = {
            endsAt: new Date(endDate) || null,
            renewsAt: new Date(renewalDate) || null,
            proStatus: status || null,
            customerId: customerId
          }

          if (status === "expired") {
            updateBody = {
              ...updateBody,
              tier: 'free',
              quota: 0
            }
          }

          await db.update(users).set(updateBody).where(and(eq(users.email, email), eq(users.customerId, customerId), eq(users.id, userId))).execute();
        } catch (error) {
          console.error('Error in subscription_updated:', error, parsedBody);
        }
        break;
      }

      // case 'subscription_expired': {
      //   try {
      //     const customerId = parsedBody?.data?.attributes.customer_id;
      //     const email = parsedBody?.data?.attributes.user_email;
      //     const userId = parsedBody?.meta?.custom_data?.userId;
      //     const endDate = parsedBody?.data?.attributes.ends_at;
      //     const renewalDate = parsedBody?.data?.attributes.renews_at;
      //     const status = parsedBody?.data?.attributes.status;

      //     if (!email || !customerId || !userId) {
      //       const missingFields = [];
      //       if (!email) missingFields.push('email');
      //       if (!customerId) missingFields.push('customerId');
      //       if (!userId) missingFields.push('userId');
      //       console.log(`Missing fields ${missingFields.join(', ')}, skipping update for subscription_expired`);
      //       break;
      //     }

      //     await db.update(users).set({
      //       endsAt: new Date(endDate) || null,
      //       renewsAt: new Date(renewalDate) || null,
      //       proStatus: status || null,
      //       customerId: customerId,
      //       tier: 'free',
      //       quota: 0
      //     }).where(and(eq(users.email, email), eq(users.customerId, customerId), eq(users.id, userId))).execute();
      //   } catch (error) {
      //     console.error('Error in subscription_expired:', error);
      //   }
      //   break;
      // }

      default: {
        console.log("Unhandled event:", event_name);
        break;
      }
    }
    if (userId) {
      const profileCacheKey = createCacheKey('profile', userId);
      // For debugging
      console.log("Attempting to delete cache for URL:", profileCacheKey);

      await c.env.blitzq_kv.delete(profileCacheKey);

    }
    return c.json({
      status: "success"
    }, 200);

  } catch (error: any) {
    console.error("LemonSqueezy webhook error:", error);
    return c.json({
      success: false,
      message: "Failed to process webhook. Please try again later."
    }, 500);
  }
})

export default webhooks