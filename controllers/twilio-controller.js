

// const config = {
//   serviceSid: 'VAed38d3ea63edd28bbfae7dfca3694b89',
//   accoundSid: 'AC238d8b93a2608f5eef81745b2d5e41a7',
//   authToken: 'a0225c0b7a36f334dc5182c2c2567474'
// }
// const client = require('twilio')(config.accoundSid, config.authToken);


// module.exports = {
//     dosms: (noData) => {
//         try {
            
//             let res = {}
//             return new Promise(async (resolve, reject) => {
//                 client.verify.services(config.serviceSid).verifications.create({
//                     to: `+91${noData.phone}`,
//                     channel: "sms"
//                 }).then((res) => {
//                     res.valid = true;
//                     resolve(res)
//                     console.log(res);
//                 })
//             })
//         } catch (error) {
//             console.log(error)
//         }
//     },
//     otpVerifysign: (otpData, nuData) => {
//         try {
            
//             console.log(otpData);
//             console.log(nuData,'nuData');
//               let resp = {}
//               return new Promise(async (resolve, reject) => {
//                   client.verify.services(serviceSid).verificationChecks.create({
//                       to: `+91${nuData.phone}`,
//                       code: otpData
//                   }).then((resp) => {
//                       console.log("verification failed");
//                       console.log(resp);
//                       resolve(resp)
//                   })
//               })
//         } catch (error) {
//             console.log(error)
//         }
//     },

//     otpVerify: (Data) => {
//         try {
            
//             let resp = {}
//             return new Promise(async (resolve, reject) => {
//                 client.verify.services(serviceSid).verificationChecks.create({
//                     to: `+91${Data.phone}`,
//                     code: Data.otp
//                 }).then((resp) => {
//                     console.log("verification failed");
//                     console.log(resp);
//                     resolve(resp)
//                 })
//             })
//         } catch (error) {
//             console.log(error)
//         }
//     }

// }