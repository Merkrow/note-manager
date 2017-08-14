import config from '../config/config';

export const postNote = params => async (dispatch) => {
  try {
    const { id, title, description, tags } = params;
    const response = await fetch(`${config.url}notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directoryId: id, title, description, tags }),
    });
    const data = await response.json();
    dispatch({ type: 'ADD_NOTICE', payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const getNotices = () => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}notices`);
    const data = await response.json();
    dispatch({ type: 'SET_NOTICES', payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const updateNote = (id, params) => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}notices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    dispatch({ type: 'UPDATE_NOTE', payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const deleteNote = id => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}notices/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.id) {
      dispatch({ type: 'DELETE_NOTE', payload: data.id });
    }
  } catch (err) {
    console.log(err);
  }
};
