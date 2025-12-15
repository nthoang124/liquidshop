const Wishlist = require('../../models/wishlistModel')

const addWithList = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    await Wishlist.updateOne(
      { userId },
      {
        $addToSet: { products: id },
        $setOnInsert: {
          userId,
          createdAt: new Date()
        },
        $set: {
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    const wishlist = await Wishlist.find({ userId })

    res.status(200).json({
      message: "Add wish list successful",
      wishlist
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Add wish list error",
      error
    })
  }
}

const removeWithList = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    await Wishlist.updateOne(
      { userId },
      {
        $pull: { products: id },
        $set: { updatedAt: new Date() }
      }
    );

    const wishlist = await Wishlist.find({ userId })

    res.status(200).json({
      message: "Remove wish list successful",
      wishlist
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Remove wish list error",
      error
    })
  }

}

const getWishList = async (req, res) => {
  const userId = req.user.id

  try {
    const wishlist = await Wishlist.find({ userId })

    if (!wishlist) {
      return res.status(404).json({
        message: "Wish list not found"
      })
    }

    res.status(200).json({
      message: "Get wish list successful",
      wishlist
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Get wish list error",
      error
    })
  }
}

module.exports = { addWithList, removeWithList, getWishList }