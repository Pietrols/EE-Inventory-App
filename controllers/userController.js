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

async function createDisciplinePost(req, res, next) {
  try {
    const { name, description } = req.body;
    const newDiscipline = await db.createDiscipline(name, description);
    res.redirect("/disciplines");
  } catch (error) {
    console.error("Error in createDisciplinePost controller:", error);
    next(error);
  }
}

async function disciplineUpdateGet(req, res, next) {
  try {
    const disciplineId = req.params.id;
    const discipline = await db.getDisciplineById(disciplineId);
    if (!discipline) {
      return res.status(404).send("Discipline not found");
    }
    res.render("disciplineForm", {
      title: "Update Discipline",
      discipline: discipline,
    });
  } catch (error) {
    console.error("Error in disciplineUpdateGet controller:", error);
    next(error);
  }
}

async function disciplineUpdatePost(req, res, next) {
  try {
    const disciplineId = req.params.id;
    const { name, description } = req.body;

    const updatedDiscipline = await db.updateDiscipline(
      disciplineId,
      name,
      description
    );

    res.redirect("/disciplines");
  } catch (error) {
    console.error("Error in disciplineUpdatePost controller:", error);
    next(error);
  }
}

async function createCourse(
  disciplineId,
  name,
  description,
  main_content,
  difficulty,
  rewards,
  stock_quantity
) {
  const query = `
    INSERT INTO courses (discipline_id, name, description, main_content, difficulty, rewards, stock_quantity)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, description, main_content, difficulty, rewards, stock_quantity;`;
  try {
    const results = await pool.query(query, [
      disciplineId,
      name,
      description,
      main_content,
      difficulty,
      rewards,
      stock_quantity,
    ]);
    return results.rows[0];
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

module.exports = {
  disciplineList,
  disciplineUpdateGet,
  disciplineUpdatePost,
  createDisciplinePost,
};
