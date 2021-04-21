import React from "react";

const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Content = ({ course: { parts } }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const exercises = parts.map((part) => part.exercises);
  return (
    <strong>
      Number of exercises {exercises.reduce((acc, curr) => acc + curr, 0)}
    </strong>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content course={course} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
