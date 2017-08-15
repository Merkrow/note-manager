import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DirectorySelector from '../DirectorySelector/DirectorySelector';
import TagsInput from '../../TagsInput';
import * as noticesActions from '../../../actions/notices';
import * as tagsActions from '../../../actions/tags';
import tags from '../../../reducers/tags';
import directories from '../../../reducers/directories';
import selectedDirectory from '../../../reducers/selectedDirectory';
import './NotePopup.scss';

const mapStateToProps = ({ directories, selectedDirectory, tags }) => ({
  directories,
  selectedDirectory,
  tags,
});

const actions = Object.assign({}, noticesActions, tagsActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

class NotePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directoryId: 1,
      title: '',
      description: '',
      id: null,
      updating: false,
      position: null,
      showDropdown: false,
      save: true,
    };
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.saveAndExit = this.saveAndExit.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.exit = this.exit.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDownHandler, false);
    document.addEventListener('click', this.handleOutsideClick, false);
    document.addEventListener('keyup', this.onKeyUpHandler, false);
    const { note, selectedDirectory } = this.props;
    const { setTags } = this.props.actions;
    if (note) {
      const { title, description, tags, id, directoryId, position } = note;
      this.setState({ updating: true, directoryId, id, title, description, position });
      setTags(tags);
      return;
    }
    this.setState({ title: 'text', directoryId: selectedDirectory || 1 });
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDownHandler, false);
    document.removeEventListener('click', this.handleOutsideClick, false);
    document.removeEventListener('keyup', this.onKeyUpHandler, false);
    document.removeEventListener('keypress', this.onKeyPressHandler, false);
  }
  onKeyUpHandler(e) {
    if (e.key === 'Control') {
      document.removeEventListener('keypress', this.onKeyPressHandler, false);
    }
  }
  onKeyPressHandler(e) {
    const { saveNote, exit } = this;
    const { deleteNote } = this.props.actions;
    const { id } = this.state;
    if (e.key === 's') {
      saveNote();
    }
    if (e.key === 'Backspace') {
      deleteNote(id);
      exit();
    }
  }
  onKeyDownHandler(e) {
    const { exit } = this;
    if (e.key === 'Escape') {
      exit();
    }
    if (e.key === 'Control') {
      document.addEventListener('keypress', this.onKeyPressHandler, false);
    }
  }
  handleOutsideClick(e) {
    const { showDropdown } = this.state;
    const target = e.target || e.srcElement;
    if (target.id === 'modal') {
      this.exit();
      return;
    }
    if (showDropdown && !this.div.contains(e.target) && !this.span.contains(e.target)) {
      this.setState({ showDropdown: false });
    }
  }
  handleInputChange(e) {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      save: false,
    });
  }
  changeDirectory(e) {
    this.setState({
      directoryId: e.target.value,
      save: false,
    });
  }
  saveNote() {
    if (this.state.save === true) {
      return;
    }
    const { postNote, updateNote } = this.props.actions;
    const { id, title, description, updating, directoryId, position } = this.state;
    const { tags } = this.props;
    if (!updating) {
      postNote({ id: directoryId, title: title || 'text', description, tags });
    } else {
      updateNote(id, { id, title: title || 'text', description, tags, directoryId, position });
    }
    this.setState({ save: true });
  }
  saveAndExit() {
    this.saveNote();
    this.setState({ save: true }, () => this.exit());
  }
  exit() {
    const { closePopup } = this.props;
    const { save } = this.state;
    if (save) {
      closePopup();
      this.props.actions.clearTags();
      return;
    }
    const answer = confirm('Do you want to save?');
    if (answer) {
      this.saveAndExit();
    } else {
      closePopup();
    }
    this.props.actions.clearTags();
  }
  deleteNote() {
    const { deleteNote } = this.props.actions;
    deleteNote(this.state.id);
    this.exit();
  }
  addNote() {
    const { description } = this.state;
    return (
      <textarea className='description-input' onChange={e => this.handleInputChange(e)} value={description} name='description' type='text' />
    );
  }
  toggleDropdown() {
    this.setState({ showDropdown: !this.state.showDropdown });
  }
  deleteTag(tag) {
    const { removeTag } = this.props.actions;
    this.setState({ save: false });
    removeTag(tag);
  }
  addTag(tag) {
    const { addTag } = this.props.actions;
    this.setState({ save: false });
    addTag(tag);
  }
  closeByButton() {
    this.exit();
  }
  renderEditor() {
    const { title } = this.state;
    const { directories, note, selectedDirectory, tags } = this.props;
    const selectedId = selectedDirectory || 1;
    return (
      <div ref={(div) => { this.div = div; }} className='dropdown arrow_box'>
        <div className='dropdown-wrap'>
          <div className='input-container'>
            <span className='name-span'>Name:</span>
            <input
              className='input-dropdown'
              onChange={e => this.handleInputChange(e)}
              value={title} name='title'
              placeholder='enter title'
              autoFocus
              type='text' />
          </div>
          <div className='input-container'>
            <span className='name-span-2'>Tags:</span>
            <TagsInput deleteTag={this.deleteTag} addTag={this.addTag} tags={tags} />
          </div>
          <div className='selector-wrap'><span className='name-span-3'>Where:</span>
            <DirectorySelector
              changeDirectory={this.changeDirectory.bind(this)}
              directories={directories}
              selectedId={selectedId}
            />
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { showDropdown } = this.state;
    return (
      <div id='modal' className='modal-background'>
        <div className='note-popup'>
          <header className='popup-header'>
            <button className='close-button' onClick={() => this.closeByButton()}></button>
            <span ref={(span) => { this.span = span; }} className='title' onClick={() => this.toggleDropdown()}>
              <span className='title-text'>{this.state.title || 'text'}</span><span className='edit-message'><span>—</span>Edited</span><img className='triangle' src='./images/dropdown.png'></img>
            </span>
            { showDropdown ? this.renderEditor() : '' }
          </header>
          { this.addNote() }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePopup);
