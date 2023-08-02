const User = require("../Models/userModel");

function checkIfDatePresent({date, slots}) {
  
  for(let i=0; i<slots.length; i++) {
    const slotdate = slots[i].date.split(",")[0];
    if( slotdate === date) {
      return false;
    }
  }
  return true;
}
  
exports.availableSlots = async (req, res) => {
  let { month, year } = req.body;

  //parsing the month and year to integer
  month = parseInt(month);
  year = parseInt(year);

  // Get the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;


  // Check if the provided year and month are greater than or equal to the current year and month
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return res.status(400).json({
      error:
        "Invalid month and year. Must be greater than or equal to the current date.",
    });
  }

  // Calculate the number of days in the given month
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  // Find all Thursdays and Fridays
  const freeSlots = [];

  //get dean's Calendar
  const dean = await User.findOne({ role: "dean" });
  // console.log(dean);
  const deanCalendar = dean.bookedSlots;

  let startdate = 1;
  if (month === currentMonth && year === currentYear) {
    startdate = currentDate.getDate() + 1;
  }
  // console.log(startdate, "startdate");

  for (let day = startdate; day <= lastDayOfMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    const dayOfWeek = currentDate.getDay();
    
    //currentdate format if 2021-05-20T00:00:00.000Z so we split it to get the date
    const dateString = currentDate.toISOString().split("T")[0];
    if (dayOfWeek === 5) {
      // Thursday (0-based index)
      if (checkIfDatePresent({date: dateString, slots: deanCalendar}))
        freeSlots.push(`${dateString}, Thursday`);
    } 
    else if (dayOfWeek === 6) {
      // Friday (0-based index)
      if (checkIfDatePresent({date: dateString, slots: deanCalendar}))
        freeSlots.push(`${dateString}, Friday`);
    }
  }

  return res.json(freeSlots);
};

exports.bookSlot = async (req, res) => {
    const { date } = req.body;
    const student = await User.findById(req.user.id);
    const dean = await User.findOne({ role: "dean" });

    const deanCalendar = dean.bookedSlots;
    const dateString = date.split(",")[0];
    if (!checkIfDatePresent({date: dateString, slots: deanCalendar})) {
        return res.status(400).json({
            error: "Slot is already booked",
        });
    }
    
    else{
        dean.bookedSlots.push({
            "date":date,
            "name":student.name,
            "university ID":student.universityID,
        });
        student.bookedSlots.push({"date":date});
        await dean.save();
        await student.save();
        return res.json({
            message: "Slot booked successfully",
        });
    }
};


exports.viewSessions = async (req, res) => {
  const user = await User.findById(req.user.id);

  if(!user) {
    return res.status(400).json({
      error: "Login to view your sessions",
    });
  }
  for(let i=0; i<user.bookedSlots.length; i++) {
    const slotdate = user.bookedSlots[i].date.split(",")[0];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const date = new Date(slotdate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if(year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && day < currentDay)) {
      user.bookedSlots.splice(i, 1);
      await user.save();
    }
  }
  const userCalendar = user.bookedSlots;
  return res.json(userCalendar);
}
