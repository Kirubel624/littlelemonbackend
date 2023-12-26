const mongoose = require('mongoose')


const availableDates= new mongoose.Schema({
date:{
    type:Date,
    required: [true,"A date is required to reserve a table"],
},
availableTimes:[
       {
         time:String,
    }
]
})

const AvailableDates = mongoose.model('AvailableDates',availableDates)

module.exports = AvailableDates