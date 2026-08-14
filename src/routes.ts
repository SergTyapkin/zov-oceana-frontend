export default {
  // Other pages
  '/': false, // root is always false

  // User pages
  '/profile': true,
  '/login': true,
  '/signup': true,
  '/password/restore': false,
  '/password/change': false,
  '/email/confirm': false,

  // Market
  '/market': true,
  '/goods/:id': true,
  '/cart': true,
  '/order/:id': true,
  '/partnership': true,
  '/admin': false,

  // Payment
  '/payment/order/:id': false,
  '/payment/takeout': false,

  // Documents
  '/documents': false,
  '/documents/politics': true,
  '/documents/offer': true,
  '/documents/contacts': true,
  '/documents/delivery': true,
  '/documents/refund': true,

  // Page 404
  '/:pathMatch(.*)*': false,
};
