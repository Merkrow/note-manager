const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTICES':
      return action.payload;
    case 'ADD_NOTICE':
      return [...state, action.payload];
    case 'UPDATE_NOTE':
      return state.map(item => item.id === action.payload.id ? action.payload : item);
    case 'DELETE_NOTE':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};
