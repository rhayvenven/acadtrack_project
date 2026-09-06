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

const assessmentTypesRoutes = require("./routes/assessmentTypes");
app.use("/assessment-types", assessmentTypesRoutes);

const gradesRoutes = require("./routes/grades");
app.use("/grades", gradesRoutes);

const attendanceLogsRoutes = require("./routes/attendanceLogs");
app.use("/attendance-logs", attendanceLogsRoutes);

const studyLogsRoutes = require("./routes/studyLogs");
app.use("/study-logs", studyLogsRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("AcadTrack API is running");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
