const mongoose = require('mongoose')

const reservationInformation = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    required: [true, "A reservattion must have a user"],
  },
  reservationDate: {
    type: Date,
    required: [true, "A reservattion must have a date"],
  },
  reservationTime: {
    type: String,
    required: [true, "A reservattion must have a time"],
  },
  numberOfGuests: {
    type: Number,
    required: [true, "A reservattion must have a number of guest"],
  },
  occassion: {
    type: String,
    required: [true, "A reservattion must have a occassion"],
  },
});

const ReservationInformation = mongoose.model('ReservationInformation', reservationInformation)

module.exports = ReservationInformation