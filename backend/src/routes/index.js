import express from "express";
import authRoute from "./auth.routes.js";
import employeeRoute from "./employee.routes.js";
import orgRoute from "./org.routes.js";
import userRoute from "./user.routes.js"
const router = express.Router();
// Routes index
const defaultRoutes = [
    {
      path: "/auth", // base path for auth routes
      route: authRoute,
    },
    {
      path: "/employees", // base path for user routes
      route: employeeRoute,
    },
    {
        path: "/org",
        route: orgRoute
    },
    {
      path: "/user",
      route: userRoute
    }
  ];
  
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

  export default router;