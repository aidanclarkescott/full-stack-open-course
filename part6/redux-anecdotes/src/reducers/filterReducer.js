const filterReducer = (state = "", action) => {
  switch (action.type) {
    case "CHANGE_FILTER":
      return action.filter;
    default:
      return state;
  }
};

export const changeFilter = (text) => {
  return {
    type: "CHANGE_FILTER",
    filter: text,
  };
};

export default filterReducer;
