const getAccount = ({ name, email, verificationDocumentFrontId, verificationDocumentBackId }) => {
  const [firstName, lastName] = name.split(/\s+/);

  return {
    type: 'express',
    country: 'th',
    email,
    business_type: 'individual',
    individual: {
      address: {
        city: 'Singapore',
        country: 'sg',
        line1: 'address_full_match',
        postal_code: '309657',
        state: 'NA',
      },
      dob: {
        day: '01',
        month: '01',
        year: 1970,
      },
      email,
      first_name: firstName,
      id_number: '123450000',
      last_name: lastName || 'last name',
      phone: '+10000000000',
      verification: {
        document: {
          front: verificationDocumentFrontId,
          back: verificationDocumentBackId,
        },
      },
    },
    business_profile: {
      // mcc code from https://stripe.com/docs/connect/setting-mcc#list
      mcc: 8999,
      name,
      product_description: 'Delivery Services',
      support_email: email,
      support_phone: '+10000000000',
      support_url: 'https://rocket.com',
      url: 'https://rocket.com',
    },
    external_account: {
        "object": "bank_account",
        "account_holder_name": "Jane Austen",
        "account_holder_type": "individual",
        "country": "SG",
        "currency": "sgd",
        "routing_number": "1100-000",
        "account_number": "000123456"
    },
    settings: {
      card_payments: {
        statement_descriptor_prefix: 'rocket',
      },
      payments: {
        statement_descriptor: 'rocket.com',
      },
      payouts: {
        schedule: {
          interval: 'manual',
        },
      },
    },
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
  };
};

module.exports = {
  // ========================================================================
  // Global
  // ========================================================================
  currency: 'sgd',
  locale: 'en-US',
  paymentMethods: [],
  products: [
    {
      id:0,
      name: 'Chicken Green Curry',
      description: 'Bamboo shoots, bell peppers, basil leaves in red curry paste mixed with coconut milk',
      display_price: 13,
      price: 1300,
      image: 'https://www.riversidethaicooking.com/wp-content/uploads/2020/05/green-curry-feature.jpg',
      local_img: 'images/food/greencurry.jpeg',
      show_pay_button: false,
      payment_method_types: ['card'],
      payment_methods_order: ['card'],
      upe_wallets: {
        applePay:'never',
        googlePay:'never'
      },
      layout: {
        type: 'tabs'
      }
    },
    {
      id:1,
      name: 'Signature Tom Yum',
      description: 'Tom Yum with freshwater prawns for a richer authentic Thai taste.',
      price: 1500,
      display_price: 15,
      image: 'https://hot-thai-kitchen.com/wp-content/uploads/2013/03/tom-yum-goong-blog.jpg',
      local_img: 'images/food/tomyum.jpeg',
      payment_method_types: [],
      payment_methods_order: ['applepay','googlepay'],
      show_pay_button: false,
      upe_wallets: {
        applePay:'auto',
        googlePay:'auto'
      },
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
      }
    },
    {
      id:2,
      name: 'Mango Sticky Rice',
      description: 'The sticky rice is steamed, mixed with thick coconut cream and sugar, paired with perfectly ripe yellow sweet mango',
      price: 700,
      display_price: 7,
      image: 'https://www.hyattrestaurants.com/uploaded/recipes/Sticky-Rice-with-Mango-and-Coconut-Cream---3-edited.jpg',
      local_img: 'images/food/mangorice.jpeg',
      show_pay_button: true,
      payment_method_types: [],
      payment_methods_order: ['paynow', 'grabpay', 'card'],
      upe_wallets: {
        applePay:'auto',
        googlePay:'auto'
      },
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
      }
    },
  ],
  subscriptions: [
    {
      name: 'Starter',
      description: '3 Meals / week, get started with our meal subscription',
      price: 5000,
      interval: "week",
      image: 'https://img.i-scmp.com/cdn-cgi/image/fit=contain,width=1098,format=auto/sites/default/files/styles/1200x800/public/d8/images/methode/2020/01/15/fbdf06ac-3749-11ea-9933-e21be988cd59_image_hires_135808.jpg?itok=faR5ovD-&v=1579067897'
    },
    {
      name: 'The Office',
      description: '5 Meals / week to get your launch sorted Monday to Friday',
      price: 8000,
      interval: "week",
      image: 'https://www.seriouseats.com/thmb/5hyi6EbUbPxoWA4Kj6V9EVH1fEE=/1500x1125/filters:fill(auto,1)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__10__20201030-thai-table-full-spread-derek-lucci-2-98b68d326aa3474a8d972a5c2c473e38.jpg'
    },
    {
      name: 'All inclusive',
      description: 'Our stress free meal program that fits your diet and lifestyle with 10 meals',
      price: 12000,
      interval: "week",
      image: 'https://travelandleisureasia.com/wp-content/uploads/2021/10/Thai-Dishes.png'
    },
  ],
  // ========================================================================
  // Branding
  // ========================================================================
  branding: {
    logo: '/images/logo.svg',
    onboardingSidePanelColor: '#C45153',
    onboardingButtonColor: '#F56568',
  },
  // ========================================================================
  // Returns data to be pre filled in Stripe connect onboarding
  // ========================================================================
  getAccount,
  // ========================================================================
  // Application fee in %
  // ========================================================================
  applicationFee: 0.7,
  // ========================================================================
  // Pages
  // ========================================================================
  pages: {
    // All are for elements that show on all/most pages like footer, headers, etc.
    all: {
      banner: {
        show: true,
        text: 'This is a demo powered by Stripe. Learn more at',
      },
    },
    // Index is the homepage
    index: {},
  },
};
