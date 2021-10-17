const express = require("express");

const CartServices = require("../services/cart_services");
const router = express.Router();

// display all items in shopping cart
router.get("/", async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  let cartContent = await cart.getCart();
  res.render("cart/index", {
    shoppingCart: cartContent.toJSON(),
  });
});

// add poster to shopping cart
router.get("/poster_id/add", async (req, res) => {
  console.log("HI");
  let cart = new CartServices(req.session.user.id);
  await cart.addToCart(req.params.poster_id, 1);
  req.flash("susccess_messages", "Yay! Successfully added to cart");
  res.redirect("/poster");
});

// remove poster from shopping cart

router.get("/:poster_id/remove", async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  await cart.remove(req.params.poster_id);
  req.flash("success_messages", "Item has been removed");
  res.redirect("/cart");
});

module.exports = router;
