const { CartItem } = require("../models");

// get all cart items of a user
const getCart = async (userId) => {
  return await CartItem.collection()
    .where({
      user_id: userId,
    })
    .fetch({
      require: false,
      withRelated: ["poster", "poster.mediaProperty"],
    });
};

// get cart item in a user's shopping cart
// Check if a specific poster exists in a user's shopping cart, if it does, it will return the cart item
const getCartItemByUserAndPoster = async (userId, posterId) => {
  return await CartItem.where({
    user_id: userId,
    poster_id: posterId,
  }).fetch({
    require: false,
  });
};

// add a poster to a user's shopping cart
const createCartItem = async (userId, posterId, quantity) => {
  let cartItem = new CartItem({
    user_id: userId,
    poster_id: posterId,
    quantity: quantity,
  });
  await CartItem.save();
  return cartItem;
};

// remove a poster from the user's shopping cart
const removeFromCart = async (userId, posterId) => {
  let cartItem = await getCartItemByUserAndPoster(userId, posterId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  } else {
    return false;
  }
};

// change the quantity of an item in the user's shopping cart
const updateQuantity = async (userId, posterId, newQuantity) => {
  let cartItem = getCartItemByUserAndPoster(userId, posterId);
  if (cartItem) {
    cartItem.set("quantity", newQuantity);
    cartItem.save();
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getCart,
  getCartItemByUserAndPoster,
  createCartItem,
  removeFromCart,
  updateQuantity,
};
