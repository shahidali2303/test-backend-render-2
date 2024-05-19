const express = require("express");
const app = express();
const cors = require("cors");
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51P7sdzSFu9s4DcBCEpyGBRnoW5R8nhL8khB7Io23Q4U7pTdlOM3EdfJ6M1duRckj8Px40AJ2iTqEmSwDcQ0JzQg500DLpF3bHE"
);

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.listen(4242, () => console.log("Node server listening on port 4242!"));