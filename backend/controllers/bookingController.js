const ReservationInformation= require('../models/reservationInformation')
const AvailableDates=require('../models/availableDates')


const reserveTable = async (req, res, next) => {
  const reservationInformation = req.body;
console.log(reservationInformation)
const reservationDate = new Date(reservationInformation.reservationDate);
console.log(reservationDate.toLocaleDateString())
  try {
    // Check if the date already exists in AvailableDates collection
    const existingDate = await AvailableDates.findOne({ date: reservationDate });

    if (existingDate) {
      console.log("its an existing date")
      // Date exists, check if the time is already booked
      const isTimeBooked = existingDate.availableTimes.some(
        (time) => time.time === reservationInformation.reservationTime
      );

      if (isTimeBooked) {
        // The time is already booked, return a response indicating it's already booked
        res.status(409).json({
          status: 'error',
          error: 'Time already booked',
        });
        return;
      }

      // Time is not booked, update the existing AvailableDates document
      existingDate.availableTimes.push({ time: reservationInformation.reservationTime });
      await existingDate.save();
    } else {
      // Date doesn't exist, create a new AvailableDates document
      const newAvailableDate = await AvailableDates.create({
        date: reservationInformation.reservationDate,
        availableTimes: [{ time: reservationInformation.reservationTime }],
      });
console.log("here###############")

    }
console.log("here(((((((((")
    // Save ReservationInformation
    const reservation = await ReservationInformation.create(
      {...reservationInformation,
      reservationDate:reservationInformation.reservationDate
      }
      );
    console.log("here@@@@@@@@@@@@@")

    res.status(201).json({
      status: 'success',
      data: reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      error: 'Internal Server Error',
    });
  }
};

const getAvailableDates = async (req, res, next) => {
  const { date } = req.query;
  console.log(date,"here###############")
const reservationDate = new Date(date);
console.log(reservationDate,"here###############rdate")

  try {
    // Query the database to find the document for the selected date
    const result = await AvailableDates.findOne({ date:reservationDate });

    if (result) {
      // If a document is found, get the already booked times
      const bookedTimes = result.availableTimes.map(time => time.time);
      console.log(bookedTimes,"document found###############")

      // Generate available times within the restaurant's working hours excluding the booked times
      const availableTimes = generateAvailableTimes(bookedTimes);
      console.log(availableTimes,"document found2###############")

      res.status(200).json({
        status: 'success',
        data: {
          bookedTimes,
          availableTimes,
        },
      });
    } else {
      // If no document is found, generate all possible times within the working hours
      const allTimes = generateAllTimes();
      console.log(allTimes,"document generate all times###############")

      res.status(200).json({
        status: 'success',
        data: {
          bookedTimes: [],
          availableTimes: allTimes,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching available times:', error);
    res.status(500).json({
      status: 'error',
      error: 'Internal Server Error',
    });
  }
};

function generateAvailableTimes(bookedTimes) {
  const restaurantWorkingHours = {
    start: 17 * 60, // 17:00 converted to minutes
    end: 22 * 60,   // 21:00 converted to minutes
  };

  const { start, end } = restaurantWorkingHours;

  // Generate all possible times within the working hours
  const allTimes = generateAllTimes();

  // Exclude the already booked times
  const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));

  return availableTimes;
}

function generateAllTimes() {
  const restaurantWorkingHours = {
    start: 17 * 60, // 17:00 converted to minutes
    end: 22 * 60,   // 21:00 converted to minutes
  };

  const { start, end } = restaurantWorkingHours;

  // Generate all possible times within the working hours
  const allTimes = [];
  for (let time = start; time < end; time += 60) {
    const formattedTime = formatTime(time);
    allTimes.push(formattedTime);
  }

  return allTimes;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const minutesPart = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutesPart).padStart(2, '0')}`;
}

const getBookings=async(req,res,next)=>{
const {id}=req.params
console.log("inside bookings")
const Reservations=await ReservationInformation.find({userID:id}).exec()

res.status(200).json({
  status:'Success',
  data:Reservations
})

}

const cancelReservation = async (req, res, next) => {
  const { id } = req.body;
  const reservationId=id
  try {
    // Find the reservation information by ID
    const reservation = await ReservationInformation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        status: "error",
        error: "Reservation not found",
      });
    }

    const { reservationDate, reservationTime } = reservation;

    // Remove the reservation information
    await ReservationInformation.findByIdAndDelete(reservationId);

    // Find the document for the selected date
    const result = await AvailableDates.findOne({ date: reservationDate });

    if (result) {
      // Filter out the canceled time from the available times
      const updatedAvailableTimes = result.availableTimes.filter(
        (availableTime) => availableTime.time !== reservationTime
      );

      // Update the document with the modified available times
      const updatedResult = await AvailableDates.findOneAndUpdate(
        { date: reservationDate },
        { availableTimes: updatedAvailableTimes },
        { new: true }
      );

      res.status(200).json({
        status: "success",
        data: updatedResult.availableTimes.map((time) => time.time),
      });
    } else {
      res.status(404).json({
        status: "error",
        error: "Date not found",
      });
    }
  } catch (error) {
    console.error("Error canceling reservation:", error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

module.exports ={
    reserveTable,
    getAvailableDates,
    cancelReservation,
    getBookings
}