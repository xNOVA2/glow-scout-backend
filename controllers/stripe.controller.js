import { generateResponse, asyncHandler } from '../utils/helpers.js';
import Stripe from 'stripe';
import dotenv from "dotenv";
import { findUser } from '../models/user.model.js';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const subscription = asyncHandler(async (req, res, next) => {
   
    const { session_id } = req.query;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    const user = await findUser({ email:session.customer_details.email });
    if (user) {
        user.subscriptionId = subscription.id;
        user.subscription = "active";
        user.tier = subscription.plan.id;
        await user.save();
        res.redirect('https://glow-scout.vercel.app/plan&price/success');
    } else {
        // Handle case where user is not found
        res.status(404).json({ message: "User not found" });
    }
    
});

export const createStripeSession = asyncHandler(async (req, res, next) => {

    const priceId = req.body.items[0].price; 
    const customer = req.body.customer;
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: customer,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],

        success_url: `http://128.199.30.51:5007/api/subcription/create?session_id={CHECKOUT_SESSION_ID}`, // Update success URL with placeholder
        cancel_url: 'https://glow-scout.vercel.app/plan&price/success/error',
    });

    generateResponse({ session: session, priceId }, "Stripe session created successfully", res);
});

export const cancelSubscription = asyncHandler(async (req, res, next) => {
        // Retrieve the subscription
        const subscription = await stripe.subscriptions.retrieve(req.body.subscriptionId);
        console.log(subscription);
        // Cancel the subscription
        await stripe.subscriptions.cancel(subscription.id);
        const user = await findUser({ subscriptionId:subscription.id });
        user.subscription = "disable";
        user.subscriptionId = null;
        await user.save();
        console.log('Subscription successfully canceled.');
        generateResponse(null,"Subscription successfully canceled", res);
      
});


export const fetchPriceIds = asyncHandler(async (req, res, next) => {
    const prices =  await stripe.prices.list({ active: true });

    generateResponse(prices, "Prices fetched successfully", res);
})




async function disableSubscription(customerId) {

    await User.findOneAndUpdate({ customerId }, { subscriptionStatus: 'disabled' });
}


export const createStripeCustomer = (email) => stripe.customers.create({email:email});