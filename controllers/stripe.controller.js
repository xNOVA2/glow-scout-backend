import { generateResponse, asyncHandler } from '../utils/helpers.js';
import Stripe from 'stripe';
import dotenv from "dotenv";
import { findUser } from '../models/user.model.js';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const subscription = asyncHandler(async (req, res, next) => {
   
    const { session_id,email } = req.query;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(session.customer_details.email);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    const user = await findUser({ email:session.customer_details.email });
    console.log(user);
    console.log(subscription.id);
    if (user) {
        user.subscriptionId = subscription.id;
        user.subscription = "active";
        await user.save();
        console.log(user);
        console.log("Data has been saved");
        res.redirect('https://glow-scout.vercel.app/plan&price/success');
    } else {
        // Handle case where user is not found
        res.status(404).json({ message: "User not found" });
    }
    
    // generateResponse({ customerId, userEmail }, "Subscription created successfully", res);
});

export const createStripeSession = asyncHandler(async (req, res, next) => {

    const priceId = req.body.items[0].price; 
    const customer = req.body.customer;
    console.log("<<<<<<<<<<<<<<<<<");
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



export const stripeWebhook = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

        event = stripe.webhooks.constructEvent(req.body, sig, "whsec_ad57be45a3bddba80be5ecd5fe2baff5d9860063829203ef7ee1aee102ee4182");
    

    switch (event.type) {
        case 'customer.subscription.created':
            const paymentIntent = event.data.object;
            console.log("WEBHOOK HAS BEEN CALLED");
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
       
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    generateResponse("event", "Stripe Webhook received successfully", res);
});