require('dotenv').config();

const https = require("https");
const fs = require("fs")

const express = require('express');
const cookieSession = require('cookie-session');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const demoConfig = require('./demo.config');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');
const { I18n } = require('i18n');


const app = express();

const i18n = new I18n({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  autoReload: true,
  directory: path.join(__dirname, 'locales')
})

app.use(
  cookieSession({
    secret: process.env.SESSION_SECRET_KEY,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Automatically pass session data to Handlebars
app.use((req, res, next) => {
  app.locals.session = req.session;
  next();
});

logger.token('error', function (req, res) {
  return req.error;
});

// Configure template engine and main template file
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      __: function () { return i18n.__.apply(this, arguments); },
      enableAnalytics: function () { return (process.env.ENABLE_ANALYTICS === 'true'); },
      demoConfig() {
        return demoConfig;
      },
      currentYear() {
        return new Date().getFullYear();
      },
      stripePublishableKey() {
        return process.env.STRIPE_PUBLISHABLE_KEY;
      },
      customerPortal(){
        return process.env.CUSTOMER_PORTAL_URL;
      },
      pricingTableId(){
        return process.env.PRICING_TABLE_ID;
      },
      eq(one, two) {
        return one == two;
      },
      ne(one, two) {
        return one !== two;
      },
      lt(one, two) {
        return one < two;
      },
      gt(one, two) {
        return one > two;
      },
      lte(one, two) {
        return one <= two;
      },
      gte(one, two) {
        return one >= two;
      },
      centsToDollars(price) {
        return ((price || 0) / 100).toFixed(2);
      },
      centsToDollarsRounded(price) {
        return (price || 0) / 100;
      },
      json(obj){
        return JSON.stringify(obj)
      },
      formatDate(timestamp) {
        const date = new Date(timestamp * 1000);

        return date.toLocaleDateString(demoConfig.locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      },
      capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
      },
      formatTime(timestamp) {
        const date = new Date(timestamp * 1000);

        return date.toLocaleTimeString(demoConfig.locale, {
          hour: 'numeric',
          minute: '2-digit',
        });
      },
      oddTableRowIndex(index, options) {
        if (index % 2 == 0) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
      userInitials(user = '') {
        return user.slice(0, 1).toUpperCase();
      },
    },
  })
);
app.set('view engine', 'hbs');
app.use(
  logger('dev', {
    skip: function (req, res) {
      return res.statusCode >= 400;
    },
  })
);
app.use(
  logger(':error', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(i18n.init);

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.use(errorHandler);

  // app.listen(4567, () => {
  //   console.log('The web server has started on port 4567');
  // });
  https
  .createServer(
    {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
    app)
  .listen(4567, ()=>{
    console.log('server is runing at port 4567')
  });