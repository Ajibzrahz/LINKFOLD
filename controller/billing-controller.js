// controller/billing-controller.js
import stripe from "../config/stripe.js";
import User from "../model/user.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const checkout = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}?upgraded=true`,
      cancel_url: process.env.CLIENT_URL,
      client_reference_id: req.user.id,
    });
    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

const webhook = async (req, res, next) => {
  let event;
  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.log("⚠️ Webhook signature verification failed.", err.message);
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const supabaseId = session.client_reference_id;
        await User.findOneAndUpdate(
          { supabaseId },
          { isPro: true, stripeCustomerId: session.customer },
          { upsert: true },
        );
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { stripeCustomerId: subscription.customer },
          { isPro: false },
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export { checkout, webhook };
