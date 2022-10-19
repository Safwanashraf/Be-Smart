//////////////////////////////////

/* EXPORTS */
module.exports = {
  totalAmount: (cartdata) => {
    try {
      total = cartdata.products.reduce((acc, curr) => {
        acc += curr.productId.current_price * curr.quantity;
        return acc;
      }, 0);
      return total;
    } catch (error) {
      console.log(error);
    }
  },
};
