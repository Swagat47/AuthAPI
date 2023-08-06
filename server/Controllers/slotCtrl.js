const User = require("../Models/userModel");
const Sessions = require("../Models/sessionsModel")
  
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

  let startdate = 1;
  if (month === currentMonth && year === currentYear) {
    startdate = currentDate.getDate() + 1;
  }

  for (let day = startdate; day <= lastDayOfMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    const dayOfWeek = currentDate.getDay();
    
    //currentdate format if 2021-05-20T00:00:00.000Z so we split it to get the date
    const dateString = currentDate.toISOString().split("T")[0];

    if (dayOfWeek === 5) {
      const booked = await Sessions.findOne({date: `${dateString}, Thursday`})
      // Thursday (0-based index)
      if (!booked)
        freeSlots.push(`${dateString}, Thursday`);
    } 
    else if (dayOfWeek === 6) {
      // Friday (0-based index)
      const booked = await Sessions.findOne({date: `${dateString}, Friday`})
      if (!booked)
        freeSlots.push(`${dateString}, Friday`);
    }
  }

  return res.json(freeSlots);
};

exports.bookSlot = async (req, res) => {
    const { date } = req.body;
    const student = await User.findById(req.user.id);
    
    if (!student) {
      return res.status(400).json({
        error: "Login to book a slot",
      });
    }
    const booked = await Sessions.findOne({date: date})
    // const dateString = date.split(",")[0];
    if(booked && booked.studentID === student.universityID){
      return res.status(400).json({
        error: "You already have a slot booked"
      })
    }
    //this condition can occur as these transactions are not atomic,
    //so if two students try to book the same slot at the same time, both will be able to book it
    //this will not completely eliminate the problem but will reduce the chances of it
    else if(booked && booked.studentID !== student.universityID){
      return res.status(400).json({
        error: "Slot already booked by another student"
      })
    }
    else{
        const slot = await Sessions.create({
            "date": date,
            "studentID" : student.universityID
        })

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
  if(user.role === "student"){
    const booked = await Sessions.findOne({studentID: user.universityID});
    return res.json({"slot-date": booked.date});
  }
  else{
    const bookedData = await Sessions.find();
    return res.json(bookedData);
  }
  
}
