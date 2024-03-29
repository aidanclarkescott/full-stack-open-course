import React, { useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Anecdote = ({ anecdote, votes }) => {
  return (
    <>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const setRandomQuote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const increaseSelectedQuoteVotes = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const getIndexOfMostVotes = () => votes.indexOf(Math.max(...votes));
  const highestVoted = getIndexOfMostVotes();

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={increaseSelectedQuoteVotes} text="vote" />
      <Button handleClick={setRandomQuote} text="next anecdote" />

      <h1>Anecdote with most votes</h1>
      <Anecdote
        anecdote={anecdotes[highestVoted]}
        votes={votes[highestVoted]}
      />
    </div>
  );
};

export default App;
