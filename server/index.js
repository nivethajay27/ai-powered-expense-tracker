import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import expensesRoutes from "./routes/expenses.js";
import aiRoutes from "./routes/ai.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/expenses", expensesRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));