export {};

interface InputValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): InputValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmiValue = weight / Math.pow(heightInMeters, 2);

  if (bmiValue < 18.5) {
    return "Underweight (unhealthy weight)";
  } else if (bmiValue >= 18.5 && bmiValue <= 25) {
    return "Normal (healthy weight)";
  } else if (bmiValue > 25 && bmiValue < 30) {
    return "Overweight (unhealthy weight)";
  } else {
    return "Obese (unhealthy weight)";
  }
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateBmi(value1, value2));
} catch {
  console.log("there was an error");
}
