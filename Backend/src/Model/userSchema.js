// const {Schema, model} = require('mongoose');

// const userSchema = new Schema({
//     userName: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// }, {timestamps: true}) ;

// module.exports = model('User', userSchema);


const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true,  }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)