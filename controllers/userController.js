const db = require("../db/queries");

async function disciplineList(req, res, next) {
  try {
    // call the model (db/queries) to get data
    const disciplines = await db.getAllDisciplines();

    // call the view and pass the data
    res.render("disciplineList", {
      title: "Electrical Engineering Disciplines",
      disciplineList: disciplines,
    });
  } catch (error) {
    console.error("Error in discliplineList controller:", error);
    next(error);
  }
}

module.exports = {
  disciplineList,
};
