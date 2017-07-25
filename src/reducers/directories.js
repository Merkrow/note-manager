const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DIRECTORIES':
      return action.payload;
    case 'ADD_DIRECTORIES':
      return [...state, action.payload];
    case 'UPDATE_DIRECTORY':
      return state.map(item => item.id === action.payload.id ? action.payload : item);
    case 'DELETE_DIRECTORY':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};
