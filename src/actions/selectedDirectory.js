export const setActiveDirectory = item => ({
  type: 'SET_ACTIVE_DIRECTORY',
  payload: item
});

export const removeActiveDirectory = () => ({ type: 'REMOVE_ACTIVE_DIRECTORY' });
