import { generateResponse, asyncHandler } from '../utils/helpers.js';
import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const subscription = asyncHandler(async (req, res, next) => {

      let customer;

      if (req.body.customerId) {
          customer = await stripe.customers.retrieve(req.body.customerId);
      } else {
          customer = await stripe.customers.create({
              email: req.body.email,
          });
      }

      const paymentMethod =  await stripe.paymentMethods.attach(req.body.paymentMethod.card.token, {
          customer: customer.id,
      });

      await stripe.customers.update(customer.id, {
          invoice_settings: {
              default_payment_method: paymentMethod.id
          },
      });

      const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: req.body.items[0].price }],
      });

      generateResponse(subscription, "Subscription created successfully", res);
 
});

export const createStripeSession = asyncHandler(async (req, res, next) => {

    const priceId = req.body.items[0].price; 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:5007/api',
        cancel_url: 'http://localhost:5007/',
    });

    generateResponse({ sessionId: session.id, priceId }, "Stripe session created successfully", res);
});

export const fetchPriceIds = asyncHandler(async (req, res, next) => {
    const prices =  await stripe.prices.list({ active: true });

    generateResponse(prices, "Prices fetched successfully", res);
})
