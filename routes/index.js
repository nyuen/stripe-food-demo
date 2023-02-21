const express = require('express');
const router = express.Router();

const noAuth = require('../middlewares/noAuth');
const auth = require('../middlewares/auth');

const { getHomePage, getDashboardPage, getUserPage, getNotFound } = require('./main');

const {
  getSignInPage,
  getSignUpPage,
  loginUser,
  logoutUser,
  createUser,
  getSignupOnboarding,
  createPayout,
} = require('./user');

const { createOrder, getOnline, getProducts, getQR, getCheckout, postProcessTerminal, fetchConnectionToken, getSuccess} = require('./order');

const { subscribe } = require('./subscribe');

// Main router

router.get('/', noAuth, getHomePage);
router.get('/dashboard', auth, getDashboardPage);
router.get('/user', auth, getUserPage);

// User router

router.get('/signin', noAuth, getSignInPage);
router.get('/signup', noAuth, getSignUpPage);
router.get('/signout', auth, logoutUser);
router.get('/signup/onboarding', auth, getSignupOnboarding);
router.post('/signin', noAuth, loginUser);
router.post('/signup', noAuth, createUser);
router.post('/payout', createPayout);

// Orders router

router.post('/order', createOrder);
router.get('/online', getOnline);
router.get('/qr', getQR);
router.get('/products', getProducts);
router.get('/checkout', getCheckout);
router.post('/processTerminal', postProcessTerminal);
router.post('/fetchConnectionToken', fetchConnectionToken);
router.get('/success', getSuccess);

//subscription management
router.get('/subscribe', subscribe);

// 404
router.get('*', getNotFound);

module.exports = router;
