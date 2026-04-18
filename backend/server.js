const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://admin:Admin123@expensetracker.3uw3ksa.mongodb.net/expenseDB")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API working");
});

const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));