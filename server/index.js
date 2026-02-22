import express from "express";
import cors from "cors";
import "dotenv/config";


import expenseRoutes from "./routes/expenses.js";
import aiRoutes from "./routes/ai.js";


const app = express();
app.use(cors());
app.use(express.json());


app.use("/expenses", expenseRoutes);
app.use("/ai", aiRoutes);


app.listen(5001, () => {
console.log("Server running on http://localhost:5001");
});