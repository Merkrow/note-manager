const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_DIRECTORY':
      return action.payload;
    case 'REMOVE_ACTIVE_DIRECTORY':
      return null;
    default:
      return state;
  }
};
