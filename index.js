import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import connectDB from "./config/database.config.js";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares/index.js";
import API from "./routes/index.js";
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// initialize environment variables
dotenv.config();

// initialize express app
const app = express();

const endpointSecret = "whsec_ad57be45a3bddba80be5ecd5fe2baff5d9860063829203ef7ee1aee102ee4182";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  
  if (event.type === 'customer.subscription.deleted') {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    console.log("<<<<<<<<<<<>>>>>>>>>>>>");
    console.log(customerId);
    // Cancel the subscription for the customer
    // await cancelSubscription(customerId);

    // You might want to notify the user or take additional actions here
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
// connect to database
connectDB();

// set port
const PORT = process.env.PORT || 5005;

// initialize http server
const httpServer = createServer(app);
// webhook 

// set up middlewares
app.use(requestIp.mw());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use('/uploads', express.static('uploads'));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}));
app.use(cors({ origin: "*", credentials: true }));
app.use(rateLimiter);

app.get('/', (req, res) => res.json({ message: `${process.env.APP_NAME} - API`, data: null }));
// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
  if (request.session && !request.session.regenerate) {
      request.session.regenerate = (cb) => {
          cb()
      }
  }
  if (request.session && !request.session.save) {
      request.session.save = (cb) => {
          cb()
      }
  }
  next()
})
app.use(log);
new API(app).registerGroups();
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
