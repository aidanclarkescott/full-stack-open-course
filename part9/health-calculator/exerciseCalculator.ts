export {};

interface InputValues {
  value1: number;
  value2: Array<number>;
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (args: Array<string>): InputValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const [, , target, ...hours] = args;
  const hoursAsNumbers = hours.map((hour) => {
    if (isNaN(Number(hour)))
      throw new Error("Provided values were not numbers");

    return Number(hour);
  });

  if (!isNaN(Number(target))) {
    return {
      value1: Number(target),
      value2: hoursAsNumbers,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (
  exerciseHours: Array<number>,
  dailyTargetHours: number
): Result => {
  const totalHours = exerciseHours.reduce((acc, curr) => acc + curr, 0);
  const goalHours = dailyTargetHours * exerciseHours.length;

  const trainingDays = exerciseHours.reduce(
    (acc, curr) => (curr > 0 ? acc + 1 : acc),
    0
  );

  let success = true;
  exerciseHours.forEach((day) => {
    if (day < dailyTargetHours) success = false;
  });

  const rating =
    totalHours >= goalHours
      ? 3
      : totalHours < goalHours && totalHours > goalHours / 2
      ? 2
      : 1;

  const ratingDescription =
    rating === 3
      ? "fantastic!"
      : rating === 2
      ? "not too bad but could be better"
      : "not great, did not meet goals at all";

  const average = totalHours / exerciseHours.length;

  return {
    periodLength: exerciseHours.length,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target: dailyTargetHours,
    average,
  };
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateExercises(value2, value1));
} catch {
  console.log("there was an error");
}
