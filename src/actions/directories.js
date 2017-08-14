import config from '../config/config';

export const postDirectory = params => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}directories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId: params.id, name: params.name }),
    });
    const data = await response.json();
    dispatch({ type: 'ADD_DIRECTORIES', payload: data });
    dispatch({ type: 'SET_EDIT_DIRECTORY', payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const getDirectories = () => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}directories`);
    const data = await response.json();
    dispatch({ type: 'SET_DIRECTORIES', payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const updateDirectory = (id, params) => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}directories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    dispatch({ type: 'UPDATE_DIRECTORY', payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const deleteDirectory = id => async (dispatch) => {
  try {
    const response = await fetch(`${config.url}directories/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    dispatch({ type: 'DELETE_DIRECTORY', payload: data.id });
  } catch (err) {
    console.log(err);
  }
};
