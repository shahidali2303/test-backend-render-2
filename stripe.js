const express = require("express");
const cors = require("cors");
// add a stripe key
const stripe = require("stripe")(
  "sk_test_51P7sdzSFu9s4DcBCEpyGBRnoW5R8nhL8khB7Io23Q4U7pTdlOM3EdfJ6M1duRckj8Px40AJ2iTqEmSwDcQ0JzQg500DLpF3bHE"
);
const uuid = require("uuid").v4;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// post request
app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product-> ", product);
  console.log("Price-> ", product.price);
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.paymentIntents.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
