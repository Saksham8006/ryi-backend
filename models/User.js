const mongoose = require('mongoose')

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true

    },
    password: {
       type: String,
        required: true 
      },
    
  },
  { collection: 'user-data' }
)

const model = mongoose.model('UserData', User)

module.exports = model