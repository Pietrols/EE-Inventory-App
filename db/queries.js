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

module.exports = {
  getAllDisciplines,
};
