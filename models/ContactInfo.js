const mongoose = require('mongoose')

const contactInfo = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,

        },
        phone: {
            type: String,
            required: true,


        },
        message: {
            type: String,
            required: true,


        },
        createdOn: {
            type: Date,
            default: Date.now

        },



    },
    { collection: 'contact-info' }
)

const model = mongoose.model('contactInfo', contactInfo)

module.exports = model