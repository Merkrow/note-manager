const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EDIT_DIRECTORY':
      return action.payload;
    case 'REMOVE_EDIT_DIRECTORY':
      return null;
    default:
      return state;
  }
};
