const express = require('express');
const stripe = require('stripe')('sk_test_51PFA92RufsXPCz6Pj8F4z5wSwuh8sjHxkN36vW0PEkvVglhW5YCqbSuBgX1A6kLSmQpiig4zoNB1594uMDQMbFGS00MkNzM3rt'); // Replace with your secret key
const cors = require('cors');

// Create an instance of Express app
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Route to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { productName, price } = req.body;

  const baseUrl = '35.192.9.96';
  const successUrl = `${baseUrl}`;
  const cancelUrl = `${baseUrl}/cancel`;

  // Create a checkout session using Stripe API
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName || 'Sample Product',
          },
          unit_amount: price || 1000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  // Return the session ID as JSON response
  res.json({ id: session.id });
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});