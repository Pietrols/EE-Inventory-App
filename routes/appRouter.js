const { Router } = require("express");
const appRouter = Router();
const disciplineController = require("../controllers/userController");

// Root redirect
appRouter.get("/", (req, res) => {
  return res.redirect("/disciplines");
});

// ===== DISCIPLINE ROUTES =====
appRouter.get("/disciplines", disciplineController.disciplineList);

// Create discipline (GET shows form, POST handles submission)
appRouter.get("/disciplines/create", disciplineController.createDisciplineGet);
appRouter.post(
  "/disciplines/create",
  disciplineController.createDisciplinePost
);

// Detail view for a specific discipline
appRouter.get("/disciplines/:id", disciplineController.disciplineDetailGet);

// Update discipline (GET shows form, POST handles submission)
appRouter.get(
  "/disciplines/:id/update",
  disciplineController.disciplineUpdateGet
);
appRouter.post(
  "/disciplines/:id/update",
  disciplineController.disciplineUpdatePost
);

// Delete discipline
appRouter.post(
  "/disciplines/:id/delete",
  disciplineController.disciplineDeletePost
);

// ===== COURSE ROUTES =====
// Create course (GET shows form, POST handles submission)
appRouter.get(
  "/disciplines/:disciplineId/courses/create",
  disciplineController.createCourseGet
);
appRouter.post(
  "/disciplines/:disciplineId/courses/create",
  disciplineController.createCoursePost
);

// Detail view for a specific course
appRouter.get("/courses/:courseId", disciplineController.courseDetailGet);

// Update course (GET shows form, POST handles submission)
appRouter.get(
  "/courses/:courseId/update",
  disciplineController.courseUpdateGet
);
appRouter.post(
  "/courses/:courseId/update",
  disciplineController.courseUpdatePost
);

// Delete course
appRouter.post(
  "/courses/:courseId/delete",
  disciplineController.courseDeletePost
);

module.exports = appRouter;
