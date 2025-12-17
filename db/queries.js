const pool = require("./pool");

async function getAllDisciplines() {
  const query = `
    SELECT id, name, description
    FROM disciplines
    WHERE is_deleted = FALSE
    ORDER BY name;`;
  try {
    const results = await pool.query(query);
    return results.rows;
  } catch (error) {
    console.error("Error fetching disciplines:", error);
    throw error;
  }
}

async function getDisciplineById(id) {
  const query = `
    SELECT id, name, description
    FROM disciplines
    WHERE id = $1 AND is_deleted = FALSE;`;
  try {
    const results = await pool.query(query, [id]);
    return results.rows[0];
  } catch (error) {
    console.error(`Error fetching discipline with id ${id}:`, error);
    throw error;
  }
}

async function getCoursesByDisciplineId(disciplineId) {
  const query = `
    SELECT id, name, description, main_content, difficulty, rewards, rating, quantity_available
    FROM courses
    WHERE discipline_id = $1 AND is_deleted = FALSE
    ORDER BY name;`;
  try {
    const results = await pool.query(query, [disciplineId]);
    return results.rows;
  } catch (error) {
    console.error(
      `Error fetching courses for discipline id ${disciplineId}:`,
      error
    );
    throw error;
  }
}

async function getCourseById(id) {
  const query = `
    SELECT id, discipline_id, name, description, main_content, difficulty, rewards, rating, quantity_available
    FROM courses
    WHERE id = $1 AND is_deleted = FALSE;`;
  try {
    const results = await pool.query(query, [id]);
    return results.rows[0];
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error);
    throw error;
  }
}

async function createDiscipline(name, description) {
  const query = `
    INSERT INTO disciplines (name, description)
    VALUES ($1, $2)
    RETURNING id, name, description;`;
  try {
    const results = await pool.query(query, [name, description]);
    return results.rows[0];
  } catch (error) {
    console.error("Error creating discipline:", error);
    throw error;
  }
}

async function updateDiscipline(id, name, description) {
  const query = `
    UPDATE disciplines
    SET name = $1, description = $2
    WHERE id = $3 AND is_deleted = FALSE
    RETURNING id, name, description;`;
  try {
    const results = await pool.query(query, [name, description, id]);
    return results.rows[0];
  } catch (error) {
    console.error(`Error updating discipline with id ${id}:`, error);
    throw error;
  }
}

async function deleteDiscipline(id) {
  const query = `
    UPDATE disciplines
    SET is_deleted = TRUE, deleted_at = NOW()
    WHERE id = $1;`;
  try {
    await pool.query(query, [id]);
  } catch (error) {
    console.error(`Error deleting discipline with id ${id}:`, error);
    throw error;
  }
}

async function createCourse(
  disciplineId,
  name,
  description,
  mainContent,
  difficulty,
  rewards,
  quantityAvailable
) {
  const query = `
    INSERT INTO courses (discipline_id, name, description, main_content, difficulty, rewards, quantity_available)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, description, main_content, difficulty, rewards, rating, quantity_available;`;
  try {
    const results = await pool.query(query, [
      disciplineId,
      name,
      description,
      mainContent,
      difficulty,
      rewards,
      quantityAvailable,
    ]);
    return results.rows[0];
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

async function updateCourse(
  id,
  disciplineId,
  name,
  description,
  mainContent,
  difficulty,
  rewards,
  quantityAvailable
) {
  const query = `
    UPDATE courses
    SET discipline_id = $1, name = $2, description = $3, main_content = $4,
        difficulty = $5, rewards = $6, quantity_available = $7
    WHERE id = $8 AND is_deleted = FALSE
    RETURNING id, name, description, main_content, difficulty, rewards, rating, quantity_available;`;
  try {
    const results = await pool.query(query, [
      disciplineId,
      name,
      description,
      mainContent,
      difficulty,
      rewards,
      quantityAvailable,
      id,
    ]);
    return results.rows[0];
  } catch (error) {
    console.error(`Error updating course with id ${id}:`, error);
    throw error;
  }
}

async function deleteCourse(id) {
  const query = `
    UPDATE courses
    SET is_deleted = TRUE, deleted_at = NOW()
    WHERE id = $1;`;
  try {
    await pool.query(query, [id]);
  } catch (error) {
    console.error(`Error deleting course with id ${id}:`, error);
    throw error;
  }
}

module.exports = {
  getAllDisciplines,
  getDisciplineById,
  getCoursesByDisciplineId,
  getCourseById,
  updateDiscipline,
  createDiscipline,
  deleteDiscipline,
  deleteCourse,
  createCourse,
  updateCourse,
};
