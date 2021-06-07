let timeoutID;

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case "CHANGE_NOTIFICATION":
      return action.notification;
    default:
      return state;
  }
};

export const setNotification = (notification, time) => {
  return async (dispatch) => {
    if (timeoutID !== undefined) clearTimeout(timeoutID);

    dispatch({
      type: "CHANGE_NOTIFICATION",
      notification,
    });

    timeoutID = setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export const clearNotification = () => {
  return {
    type: "CHANGE_NOTIFICATION",
    notification: null,
  };
};

export default notificationReducer;
