/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  const bmiString = calculateBmi(height, weight);

  if (!height || !weight) {
    res.status(400).json({ error: "malformed parameters" });
  }

  res.json({ weight, height, bmi: bmiString });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const daily_exercises: any = req.body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target: any = req.body.target;

  if (!daily_exercises || !target)
    res.status(400).json({ error: "parameters missing" });

  let areNumbers = true;
  if (Array.isArray(daily_exercises)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daily_exercises.forEach((day: any) => {
      if (isNaN(Number(day))) areNumbers = false;
    });
  }

  if (isNaN(target) || !Array.isArray(daily_exercises) || !areNumbers)
    res.status(400).json({ error: "malformed parameters" });

  res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
