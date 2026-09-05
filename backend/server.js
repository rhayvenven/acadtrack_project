require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const gradingScalesRoutes = require("./routes/gradingScales");
app.use("/grading-scales", gradingScalesRoutes);

const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

const termsRoutes = require("./routes/terms");
app.use("/terms", termsRoutes);

const subjectsRoutes = require("./routes/subjects");
app.use("/subjects", subjectsRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("AcadTrack API is running");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
