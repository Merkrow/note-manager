const initialState = 'icon';

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ICON_VIEW':
      return 'icon';
    case 'SET_LINE_VIEW':
      return 'line';
    default:
      return state;
  }
};
