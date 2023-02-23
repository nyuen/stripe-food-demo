const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: "stripe-demo-rocket",
    version: "0.0.1",
    url: "https://github.com/stripe-samples"
  }
});

const TH_CONNECTED_ACCOUNT = "acct_1LE57bQljXBG0Wog";

const faker = require('faker');

const { applicationFee, products } = require('../demo.config');

const createOrder = async (req, res, next) => {
  try {
    const {
      body: { amount },
      session: { accountId },
    } = req;

    if (!amount) {
      throw new Error('Please specify the amount');
    }

    const applicationFeeAmount = (applicationFee * parseInt(amount)).toFixed(0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      confirm: true,
      payment_method: 'pm_card_bypassPending',
      currency: 'sgd',
      on_behalf_of: accountId,
      transfer_data: {
        destination: accountId,
        amount: (parseInt(amount) - applicationFeeAmount).toFixed(0),
      },
      metadata: {
        order_id: Math.floor(Math.random() * 90000) + 10000, // generate random 5 digits number
        customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    });

    res.json(paymentIntent);
  } catch (err) {
    next(err);
  }
};

const getOnline = async (req, res, next) => {
  try {
    let product_id = req.query.product != null ? req.query.product: 0;

    let product = products[product_id];

    payment_intent_options = {
      amount: product.price,
      // application_fee_amount: product.price/10,
       currency: "sgd",
    }

    const paymentIntent = await stripe.paymentIntents.create(payment_intent_options);
    res.render('online', {"product":product, clientSecret:paymentIntent.client_secret});
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    
    res.render('products', {"products": products});
  } catch (err) {
    next(err);
  }
};

const getQR = async (req, res, next) => {
  try {

    res.render('qr');
  } catch (err) {
    next(err);
  }
};

const getCheckout = async (req, res, next) => {
  try {
    const green_curry = "price_1Ltm71DEoGxW0yF0acvcUnyw";
    const session = await stripe.checkout.sessions.create({
      success_url: '/success',
      cancel_url: '/success',
      line_items: [
        {price: green_curry, quantity: 1},
      ],
      mode: 'payment',
      locale: "en"
    });
    res.redirect(session.url);
  } catch (err) {
    next(err);
  }
};

const getSuccess = async (req, res, next) => {
  try {
    let product_id = req.query.product != null ? req.query.product: 0;
    let product = products[product_id];
    res.render('success', {"product": product});
  } catch (err) {
    next(err);
  }
};

const postProcessTerminal = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      application_fee_amount: 100,
      currency: 'sgd',
      payment_method_types: ['card_present'],
      transfer_data: {
        destination: TH_CONNECTED_ACCOUNT,
      },
    });

    // server side integration not working yet in SG
    // const reader_id = "tmr_EzB3zANu1bvPWj";
    
    // const reader = await stripe.terminal.readers.processPaymentIntent(
    //   reader_id,
    //   {payment_intent: paymentIntent.id}
    // );
    //   const payment_intent = await stripe.paymentIntents.retrieve(paymentIntent.id);
      res.statusCode = 200;
      res.json(paymentIntent); 
    } catch (error){
      res.statusCode = 500;
      res.send();
    }
};

const fetchConnectionToken = async(req,res) => {
  const token = await stripe.terminal.connectionTokens.create();
  res.json({secret: token.secret});

}

module.exports = {
  createOrder,
  getOnline,
  getProducts,
  getQR,
  getCheckout,
  postProcessTerminal,
  fetchConnectionToken,
  getSuccess
};
