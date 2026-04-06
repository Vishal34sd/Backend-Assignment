import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import recordRoutes from "./src/routes/recordRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import notFound from "./src/middlewares/notFoundMiddleware.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 8080;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();