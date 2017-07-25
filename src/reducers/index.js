import { combineReducers } from 'redux';
import directories from './directories';
import notices from './notices';
import selectedDirectory from './selectedDirectory';
import noteView from './noteView';
import filterNotes from './filterNotes';
import editDirectory from './editDirectory';
import tags from './tags';

export default combineReducers({
  directories,
  notices,
  selectedDirectory,
  noteView,
  filterNotes,
  editDirectory,
  tags,
});
