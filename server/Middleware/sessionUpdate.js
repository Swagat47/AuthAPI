const Sessions = require("../Models/sessionsModel");

exports.updateSession = async(req, res, next) =>{

    const bookedSlots = await Sessions.find();
    for(let i=0; i<bookedSlots.length; i++) {
        const slotdate = bookedSlots[i].date.split(",")[0];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        const date = new Date(slotdate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if(year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && day < currentDay)) {
          bookedSlots.splice(i, 1);
          await save();
        }
    }
    next();
}