const db = require("../db/queries");

async function disciplineList(req, res, next) {
  try {
    const disciplines = await db.getAllDisciplines();
    res.render("disciplineList", {
      title: "Electrical Engineering Disciplines",
      disciplineList: disciplines,
    });
  } catch (error) {
    console.error("Error in disciplineList controller:", error);
    next(error);
  }
}

async function createDisciplineGet(req, res, next) {
  try {
    res.render("disciplineForm", {
      title: "Create New Discipline",
      discipline: null,
    });
  } catch (error) {
    console.error("Error in createDisciplineGet controller:", error);
    next(error);
  }
}

async function createDisciplinePost(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).render("error", {
        title: "Validation Error",
        message: "Name and description are required",
      });
    }
    const newDiscipline = await db.createDiscipline(name, description);
    res.redirect("/disciplines");
  } catch (error) {
    console.error("Error in createDisciplinePost controller:", error);
    next(error);
  }
}

async function disciplineDetailGet(req, res, next) {
  try {
    const disciplineId = req.params.id;
    console.log("Fetching discipline with ID:", disciplineId);

    const discipline = await db.getDisciplineById(disciplineId);
    if (!discipline) {
      console.log("Discipline not found for ID:", disciplineId);
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Discipline not found",
      });
    }

    console.log("Discipline found:", discipline);
    const courses = await db.getCoursesByDisciplineId(disciplineId);
    console.log("Courses found:", courses);

    res.render("disciplineDetail", {
      title: discipline.name,
      discipline: discipline,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Error in disciplineDetailGet controller:", error);
    next(error);
  }
}

async function disciplineUpdateGet(req, res, next) {
  try {
    const disciplineId = req.params.id;
    const discipline = await db.getDisciplineById(disciplineId);
    if (!discipline) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Discipline not found",
      });
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
    if (!name || !description) {
      return res.status(400).render("error", {
        title: "Validation Error",
        message: "Name and description are required",
      });
    }
    const updatedDiscipline = await db.updateDiscipline(
      disciplineId,
      name,
      description
    );
    res.redirect(`/disciplines/${disciplineId}`);
  } catch (error) {
    console.error("Error in disciplineUpdatePost controller:", error);
    next(error);
  }
}

async function disciplineDeletePost(req, res, next) {
  try {
    const disciplineId = req.params.id;
    await db.deleteDiscipline(disciplineId);
    res.redirect("/disciplines");
  } catch (error) {
    console.error("Error in disciplineDeletePost controller:", error);
    next(error);
  }
}

async function createCourseGet(req, res, next) {
  try {
    const { disciplineId } = req.params;
    console.log("Creating course for discipline ID:", disciplineId);

    const discipline = await db.getDisciplineById(disciplineId);
    if (!discipline) {
      console.log("Discipline not found for ID:", disciplineId);
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Discipline not found",
      });
    }

    res.render("courseForm", {
      title: `Create New Course for ${discipline.name}`,
      discipline: discipline,
      course: null,
      disciplines: null,
    });
  } catch (error) {
    console.error("Error in createCourseGet controller:", error);
    next(error);
  }
}

async function createCoursePost(req, res, next) {
  try {
    const { disciplineId } = req.params;
    const {
      name,
      description,
      mainContent,
      difficulty,
      rewards,
      quantityAvailable,
    } = req.body;

    console.log("Creating course with body:", req.body);

    if (!name || !description) {
      return res.status(400).render("error", {
        title: "Validation Error",
        message: "Course name and description are required",
      });
    }

    const newCourse = await db.createCourse(
      disciplineId,
      name,
      description,
      mainContent || "",
      parseInt(difficulty) || 5,
      parseInt(rewards) || 5,
      parseInt(quantityAvailable) || 0
    );

    console.log("Course created:", newCourse);
    res.redirect(`/disciplines/${disciplineId}`);
  } catch (error) {
    console.error("Error in createCoursePost controller:", error);
    next(error);
  }
}

async function courseDetailGet(req, res, next) {
  try {
    const { courseId } = req.params;
    console.log("Fetching course with ID:", courseId);

    const course = await db.getCourseById(courseId);
    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Course not found",
      });
    }

    const discipline = await db.getDisciplineById(course.discipline_id);
    console.log("Course found:", course);

    res.render("courseDetail", {
      title: course.name,
      course: course,
      discipline: discipline,
    });
  } catch (error) {
    console.error("Error in courseDetailGet controller:", error);
    next(error);
  }
}

async function courseUpdateGet(req, res, next) {
  try {
    const { courseId } = req.params;
    console.log("Updating course with ID:", courseId);

    const course = await db.getCourseById(courseId);
    if (!course) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Course not found",
      });
    }

    const discipline = await db.getDisciplineById(course.discipline_id);
    const disciplines = await db.getAllDisciplines();

    res.render("courseForm", {
      title: `Update Course: ${course.name}`,
      course: course,
      discipline: discipline,
      disciplines: disciplines,
    });
  } catch (error) {
    console.error("Error in courseUpdateGet controller:", error);
    next(error);
  }
}

async function courseUpdatePost(req, res, next) {
  try {
    const { courseId } = req.params;
    const {
      disciplineId,
      name,
      description,
      mainContent,
      difficulty,
      rewards,
      quantityAvailable,
    } = req.body;

    console.log("Updating course ID:", courseId, "with body:", req.body);

    if (!name || !description) {
      return res.status(400).render("error", {
        title: "Validation Error",
        message: "Course name and description are required",
      });
    }

    const updatedCourse = await db.updateCourse(
      courseId,
      disciplineId,
      name,
      description,
      mainContent || "",
      parseInt(difficulty) || 5,
      parseInt(rewards) || 5,
      parseInt(quantityAvailable) || 0
    );

    console.log("Course updated:", updatedCourse);
    res.redirect(`/courses/${courseId}`);
  } catch (error) {
    console.error("Error in courseUpdatePost controller:", error);
    next(error);
  }
}

async function courseDeletePost(req, res, next) {
  try {
    const { courseId } = req.params;
    console.log("Deleting course with ID:", courseId);

    const course = await db.getCourseById(courseId);
    if (!course) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Course not found",
      });
    }

    await db.deleteCourse(courseId);
    console.log("Course deleted:", courseId);
    res.redirect(`/disciplines/${course.discipline_id}`);
  } catch (error) {
    console.error("Error in courseDeletePost controller:", error);
    next(error);
  }
}

module.exports = {
  disciplineList,
  createDisciplineGet,
  createDisciplinePost,
  disciplineDetailGet,
  disciplineUpdateGet,
  disciplineUpdatePost,
  disciplineDeletePost,
  createCourseGet,
  createCoursePost,
  courseDetailGet,
  courseUpdateGet,
  courseUpdatePost,
  courseDeletePost,
};
