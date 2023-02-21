const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: "stripe-demo-rocket",
    version: "0.0.1",
    url: "https://github.com/stripe-samples"
  }
});

const fs = require('fs').promises;

const { getAccount } = require('../demo.config');

const getSignInPage = (req, res) => {
  res.render('signin');
};

const loginUser = async (req, res, next) => {
  try {
    const {
      body: { email },
    } = req;

    if (!email) {
      throw new Error("Email shouldn't be empty!");
    }

    const { data: customers } = await stripe.customers.list({ email });

    if (!customers.length) {
      throw new Error('Account does not exist. Please Sign Up!');
    }

    const customer = customers[0];

    const account = await stripe.accounts.retrieve(customer.metadata.accountId);

    if (!account) {
      throw new Error('Account does not exist. Please Sign Up!');
    }

    req.session.customerId = customer.id;
    req.session.accountId = customer.metadata.accountId;
    req.session.userName = customer.name;
    req.session.userEmail = customer.email;
    req.session.created = customer.created;
    req.session.isAuthenticated = true;

    return res.json(customer);
  } catch (err) {
    next(err);
  }
};

const logoutUser = (req, res) => {
  req.session = null;
  res.redirect('/');
};

const createUser = async (req, res, next) => {
  let account, customer;
  try {
    const {
      body: { name, email },
    } = req;

    const { data: customers } = await stripe.customers.list({ email });

    if (customers.length) {
      throw new Error('Account already exists. Please Sign In!');
    }

    const identityFile = await fs.readFile(`${process.cwd()}/config/identity_document.png`);
    const [verificationDocumentFront, verificationDocumentBack] = await Promise.all([
      stripe.files.create({
        purpose: 'identity_document',
        file: {
          data: identityFile,
          name: 'identity_document.png',
          type: 'application/octet-stream',
        },
      }),
      stripe.files.create({
        purpose: 'identity_document',
        file: {
          data: identityFile,
          name: 'identity_document.png',
          type: 'application/octet-stream',
        },
      }),
    ]);

    account = await stripe.accounts.create({
      ...getAccount({
        name,
        email,
        verificationDocumentFrontId: verificationDocumentFront.id,
        verificationDocumentBackId: verificationDocumentBack.id,
      }),
    });

    customer = await stripe.customers.create({
      name,
      email,
      metadata: {
        accountId: account.id,
      },
    });

    req.session.customerId = customer.id;
    req.session.accountId = account.id;
    req.session.userName = customer.name;
    req.session.userEmail = customer.email;
    req.session.created = customer.created;

    req.session.isAuthenticated = true;

    res.json({ customer, account });
  } catch (err) {
    if (customer) {
      stripe.customers.del(customer.id).catch(() => {});
    }
    if (account) {
      stripe.accounts.del(account.id).catch(() => {});
    }
    next(err);
  }
};

const getSignUpPage = async (req, res) => {
  res.render('signup');
};

const getSignupOnboarding = async (req, res, next) => {
  try {
    const {
      session: { accountId },
      headers: { secure, host },
    } = req;

    const origin = secure ? `https://${host}` : `http://${host}`;
    const { url } = await stripe.accountLinks.create({
      type: 'account_onboarding',
      account: accountId,
      refresh_url: `${origin}/signup/onboarding`,
      return_url: `${origin}/dashboard`,
    });
    res.redirect(url);
  } catch (err) {
    res.render('error', { error: err.message });
  }
};

const createPayout = async (req, res, next) => {
  try {
    const {
      session: { accountId },
      body: { amount },
    } = req;

    const createdPayout = await stripe.payouts.create(
      {
        amount,
        currency: 'usd',
      },
      { stripeAccount: accountId }
    );

    res.json(createdPayout);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSignInPage,
  getSignUpPage,
  loginUser,
  createUser,
  getSignupOnboarding,
  logoutUser,
  createPayout,
};
