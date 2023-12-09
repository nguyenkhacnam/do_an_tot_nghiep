const mongoose = require('mongoose')

const JWTRefTokens = new mongoose.Schema({
   refreshTokens :{
       type: Array,
       default:[]
   }

})
module.exports = mongoose.model("JWT", JWTRefTokens);