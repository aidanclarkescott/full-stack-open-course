import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteAction } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, clickHandler }) => {
  return (
    <>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={clickHandler}>vote</button>
      </div>
    </>
  );
};

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(voteAction(anecdote));
    dispatch(setNotification(`you voted ${anecdote.content}`, 5));
  };

  return (
    <div>
      {anecdotes
        .filter((anecdote) => anecdote.content.includes(filter))
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            clickHandler={() => vote(anecdote)}
          />
        ))}
    </div>
  );
};

export default AnecdoteList;
