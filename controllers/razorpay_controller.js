const Razorpay = require('razorpay');
const crypto = require('crypto');

var instance = new Razorpay({
  key_id: 'rzp_test_1rvf7wP1DFIRwM',
  key_secret: 'eCM7m8F9YBXon4K3bqFJZgqb',
});



module.exports = {
  intiateRazorpay: async(orderId, amount) => { 
    
    console.log('this is working');
   value= await instance.orders.create({
    amount: amount,
    currency: "INR",
    receipt: orderId+" ",
    notes: {
      key1: "value3",
      key2: "value2"
    }
   })
    return value;
   
  },
  validate: async (razorData) => {
 
    
    
   
    let hmac = crypto.createHmac('sha256',"eCM7m8F9YBXon4K3bqFJZgqb" );
   await  hmac.update(razorData['razorResponse[razorpay_order_id]'] + '|' + razorData['razorResponse[razorpay_payment_id]']);
    hmac =await hmac.digest('hex');
    if (hmac == razorData['razorResponse[razorpay_signature]'])
      return orderConfirmed = true;
    console.log('its not working');
    return orderConfirmed = false;
  }
  
}