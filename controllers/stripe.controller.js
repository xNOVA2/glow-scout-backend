import { generateResponse, asyncHandler } from '../utils/helpers.js';
import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const subscription = asyncHandler(async (req, res, next) => {

      let customer;

      // If customer exists, retrieve the customer
      if (req.body.customerId) {
          customer = await stripe.customers.retrieve(req.body.customerId);
      } else {
          // If customer does not exist, create a new customer
          customer = await stripe.customers.create({
              email: req.body.email,
          });
      }

      // Attach the payment method to the customer using the test token
      const paymentMethod =  await stripe.paymentMethods.attach(req.body.paymentMethod.card.token, {
          customer: customer.id,
      });

      // Set the attached payment method as the default payment method
      await stripe.customers.update(customer.id, {
          invoice_settings: {
              default_payment_method: paymentMethod.id
          },
      });

      // Create a subscription using the customer's ID and the specified price
      const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: req.body.items[0].price }],
      });

      generateResponse(subscription, "Subscription created successfully", res);
 
});
