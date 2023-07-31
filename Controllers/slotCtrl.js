const User = require("../Models/userModel");

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
    const dateString = currentDate.toISOString().split("T")[0];
    if (dayOfWeek === 4) {
      // Thursday (0-based index)
      if (!deanCalendar.includes(dateString))
        freeSlots.push(`${dateString}, Thursday`);
    } else if (dayOfWeek === 5) {
      // Friday (0-based index)
      if (!deanCalendar.includes(dateString))
        freeSlots.push(`${dateString}, Friday`);
    }
  }

  return res.json(freeSlots);
};
