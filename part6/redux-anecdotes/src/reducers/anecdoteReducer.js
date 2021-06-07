import anecdoteService from "../services/anecdotes";

const reducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_ANECDOTE":
      return [...state, action.data];
    case "INIT_ANECDOTES":
      return action.data;
    case "VOTE": {
      const updatedAnecdote = action.data.anecdote;
      return state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
    }
    default:
      return state;
  }
};

export const voteAction = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const updatedAnecdote = await anecdoteService.incrementAnecdoteVotes(
      anecdote.id,
      newAnecdote
    );
    dispatch({ type: "VOTE", data: { anecdote: updatedAnecdote } });
  };
};

export const addAction = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createAnecdote(content);
    dispatch({ type: "ADD_ANECDOTE", data: newAnecdote });
  };
};

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: "INIT_ANECDOTES",
      data: anecdotes,
    });
  };
};

export default reducer;
