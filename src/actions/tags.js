export const addTag = tag => ({
  type: 'ADD_TAG',
  payload: tag,
});

export const removeTag = tag => ({
  type: 'REMOVE_TAG',
  payload: tag,
});

export const setTags = tags => ({
  type: 'SET_TAGS',
  payload: tags,
});

export const clearTags = () => ({
  type: 'CLEAR_TAGS',
});
