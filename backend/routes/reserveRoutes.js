const express = require('express');

const router= express.Router();
const {
    reserveTable, getAvailableDates, cancelReservation, getBookings
}=require('../controllers/bookingController')


router.post('/reserve',reserveTable)
router.get('/reserve/getAvailableDates',getAvailableDates)
router.get('/reserve/:id',getBookings)
router.post('/reserve/cancelReservation',cancelReservation)



module.exports=router