//////////////////////////////////

/* REQUIRE */
const Razorpay = require("razorpay");
const crypto = require("crypto");

//////////////////////////////////

/* --- */
var instance = new Razorpay({
  key_id: "rzp_test_1rvf7wP1DFIRwM",
  key_secret: "eCM7m8F9YBXon4K3bqFJZgqb",
});

//////////////////////////////////

/* EXPORTS */
module.exports = {
  intiateRazorpay: async (orderId, amount) => {
    try {
      value = await instance.orders.create({
        amount: amount,
        currency: "INR",
        receipt: orderId + " ",
        notes: {
          key1: "value3",
          key2: "value2",
        },
      });
      return value;
    } catch (error) {
      console.log(error);
    }
  },

  validate: async (razorData) => {
    try {
      let hmac = crypto.createHmac("sha256", "eCM7m8F9YBXon4K3bqFJZgqb");
      await hmac.update(
        razorData["razorResponse[razorpay_order_id]"] +
          "|" +
          razorData["razorResponse[razorpay_payment_id]"]
      );
      hmac = await hmac.digest("hex");
      if (hmac == razorData["razorResponse[razorpay_signature]"])
        return (orderConfirmed = true);
      return (orderConfirmed = false);
    } catch (error) {
      console.log(error);
    }
  },
};
