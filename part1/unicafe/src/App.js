import React, { useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Statistic = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ values }) => {
  const [good, neutral, bad] = values;
  const calcAverage = () =>
    Math.round(((good + -1 * bad) / (good + neutral + bad)) * 10) / 10;
  const calcPositivePercentage = () =>
    Math.round(((100 * good) / (good + neutral + bad)) * 10) / 10;

  if (good + neutral + bad <= 0) return <p>No feedback given</p>;

  return (
    <>
      <table>
        <tbody>
          <Statistic text="good" value={good} />
          <Statistic text="neutral" value={neutral} />
          <Statistic text="bad" value={bad} />
          <Statistic text="all" value={good + neutral + bad} />
          <Statistic text="average" value={calcAverage()} />
          <Statistic text="positive" value={calcPositivePercentage() + "%"} />
        </tbody>
      </table>
    </>
  );
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text={"good"} />
      <Button handleClick={() => setNeutral(neutral + 1)} text={"neutral"} />
      <Button handleClick={() => setBad(bad + 1)} text={"bad"} />
      <h1>statistics</h1>
      <Statistics values={[good, neutral, bad]} />
    </div>
  );
}

export default App;
