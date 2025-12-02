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

  // Page 404
  '/:pathMatch(.*)*': false,
};
