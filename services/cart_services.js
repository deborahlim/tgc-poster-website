const cartDataLayer = require("../dal/cart_items");

class CartServices {
  constructor(userId) {
    this.user_id = userId;
  }

  async addToCart(posterId, quantity) {
    // check if the user has added the poster to the shopping cart before
    let cartItem = await cartDataLayer.getCartItemByUserAndPoster(
      this.user_id,
      posterId
    );
    if (cartItem) {
      return await cartDataLayer.updateQuantity(
        this.user_id,
        posterId,
        cartItem.get("quantity") + 1
      );
    } else {
      let newCartItem = await cartDataLayer.createCartItem(
        this.user_id,
        posterId,
        quantity
      );
      return newCartItem;
    }
  }

  async remove(posterId) {
    return cartDataLayer.removeFromCart(this.user_id, posterId);
  }

  async setQuantity(posterId, quantity) {
    cartDataLayer.updateQuantity(this.user_id, posterId, quantity);
  }

  async getCart() {
    return await cartDataLayer.getCart(this.user_id);
  }
}

module.exports = CartServices;
