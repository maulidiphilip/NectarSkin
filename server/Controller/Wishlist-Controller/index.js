const Wishlist = require("../../Models/Wishlist");

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    res
      .status(200)
      .json({ success: true, data: wishlist ? wishlist.items : [] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, items: [] });
    }
    if (
      !wishlist.items.some((item) => item.productId.toString() === productId)
    ) {
      wishlist.items.push({ productId });
    }
    await wishlist.save();
    await wishlist.populate("items.productId");
    res.status(200).json({ success: true, data: wishlist.items });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(
        (item) => item.productId.toString() !== productId
      );
      await wishlist.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
