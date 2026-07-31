module.exports = async () => {
  if (!global.__TEST_CART__) return;
  global.__TEST_CART__.cart = { items: [] };
};
