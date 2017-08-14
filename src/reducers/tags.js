const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TAGS':
      return action.payload;
    case 'ADD_TAG':
      if (state.length && state.indexOf(action.payload) !== -1) {
        return state;
      }
      return [...state, action.payload];
    case 'REMOVE_TAG':
      return state.filter(tag => tag !== action.payload);
    case 'CLEAR_TAGS':
      return [];
    default:
      return state;
  }
};
