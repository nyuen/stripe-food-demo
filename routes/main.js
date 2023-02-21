const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: "stripe-demo-rocket",
    version: "0.0.1",
    url: "https://github.com/stripe-samples"
  }
});

const faker = require('faker');

const getHomePage = (req, res) => {
  res.render('index');
};

const getDashboardPage = async (req, res) => {
  try {
    const {
      session: { accountId, userName, created },
    } = req;

    const account = await stripe.accounts.retrieve(accountId);
    const {
      capabilities: { card_payments: cardPayments, transfers },
    } = account;
    const isOnboarded = cardPayments === 'active' && transfers === 'active';
    req.session.isOnboarded = isOnboarded;

    const [balance, { data: orders }, loginLink] = await Promise.all([
      stripe.balance.retrieve({ stripeAccount: accountId }),
      stripe.charges.list(
        {
          limit: 10,
          expand: ['data.source_transfer.source_transaction'],
        },
        { stripeAccount: account.id }
      ),
      isOnboarded && stripe.accounts.createLoginLink(accountId),
    ]);

    const payoutsLink = loginLink ? `${loginLink.url}#earnings` : undefined;
    const accountLink = loginLink ? `${loginLink.url}#settings` : undefined;

    res.render('dashboard', {
      account,
      accountLink,
      payoutsLink,
      balance: balance.available[0].amount,
      isOnboarded,
      userName,
      created,
      orders,
    });
  } catch (err) {
    res.render('error', { error: err.message, routeName: 'Dashboard' });
  }
};

const getUserPage = (req, res) => {
  try {
    const orderAmount = faker.datatype.number({ min: 5000, max: 10000 });
    res.render('user', { orderAmount });
  } catch (err) {
    res.render('error', { error: err.message, routeName: 'User' });
  }
};

const getNotFound = (req, res) => {
  res.render('404');
};

module.exports = {
  getHomePage,
  getNotFound,
  getDashboardPage,
  getUserPage,
};
