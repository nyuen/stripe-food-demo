const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: "stripe-demo-rocket",
    version: "0.0.1",
    url: "https://github.com/stripe-samples"
  }
});

const TH_CONNECTED_ACCOUNT = "acct_1LE57bQljXBG0Wog";

const faker = require('faker');

const { applicationFee } = require('../demo.config');


const subscribe = async (req, res, next) => {
  try {
    res.render('subscribe');
  } catch (err) {
    next(err);
  }
};


module.exports = {
subscribe
};
