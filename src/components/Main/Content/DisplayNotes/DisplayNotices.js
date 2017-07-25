import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import notices from '../../../../reducers/notices';
import selectedDirectory from '../../../../reducers/selectedDirectory';
import noteView from '../../../../reducers/noteView';
import filterNotes from '../../../../reducers/filterNotes';
import Scroll from '../../../Scroll';
import * as noticesActions from '../../../../actions/notices';
import './DisplayNotices.scss';

const mapStateToProps = ({ notices, selectedDirectory, noteView, filterNotes }) => ({
  notices,
  selectedDirectory,
  noteView,
  filterNotes,
});

const actions = Object.assign({}, noticesActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

class DisplayNotices extends Component {
  constructor(props) {
    super(props);
    this.state = { value: null, showContextMenu: false, contextMenuCoordinates: [0, 0], };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentDidMount() {
    const { getNotices } = this.props.actions;
    getNotices();
  }
  ComponentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }
  handleOutsideClick(e) {
    const target = e.target || e.srcElement;
    if (!this.ul.contains(target)) {
      this.closeContextMenu();
    }
  }
  filterNotices() {
    const { notices, selectedDirectory } = this.props;
    return notices.filter(item => Number(selectedDirectory) === Number(item.directoryId));
  }
  deleteNote() {
    const { deleteNote } = this.props.actions;
    const { value } = this.state;
    deleteNote(value.id);
    this.closeContextMenu();
  }
  renderContextMenu(e, id) {
    const { showContextMenu, contextMenuCoordinates, value } = this.state
    return (
      <ul
        ref={ul => { this.ul = ul; }}
        style={{ display: showContextMenu ? 'inline-block' : 'none', left: contextMenuCoordinates[0], top: contextMenuCoordinates[1] }}
        className='settings-dropdown'>
        <li className='settings-dropdown-item' onClick={() => this.showEditorPopup(value)}>Edit Note</li>
        <li className='settings-dropdown-item' onClick={() => this.deleteNote()}>Delete Note</li>
      </ul>
    );
  }
  closeContextMenu() {
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.setState({ showContextMenu: false });
  }
  contextMenu(e, note) {
    e.preventDefault();
    document.addEventListener('click', this.handleOutsideClick, false);
    this.selectNote(note);
    this.setState({ showContextMenu: true, contextMenuCoordinates: [e.clientX, e.clientY] });
  }
  selectNote(note) {
    this.setState({ value: note });
  }
  renderListInfo(note) {
    return (
      <span className='item-description'>{ note.description }</span>
    );
  }
  renderListFirstLine() {
    return (
      <div className='first-line'>
        <span className='item-wrap'>Title</span>
        <span className='item-description'>Content</span>
        <span className='item-tags'>Tags</span>
      </div>
    );
  }
  showEditorPopup(note) {
    this.props.showPopup(0, note)
    if (this.state.showContextMenu) {
      this.closeContextMenu();
    }
  }
  render() {
    const { noteView, filterNotes } = this.props;
    const filteredNotices = this.filterNotices()
      .filter(item => item.title.indexOf(filterNotes) !== -1);
    return (
      <article className='files-article'>
        <Scroll>
          <div className={ noteView === 'icon' ? 'note-icons' : 'note-list' }>
            { noteView === 'icon' ? '' : this.renderListFirstLine() }
            { this.renderContextMenu() }
            { filteredNotices
              .sort((note1, note2) => note1.position - note2.position)
              .map((item, index) =>
              <div
                onDoubleClick={() =>  this.showEditorPopup(item)}
                onClick={() => this.selectNote(item)}
                key={index}
                onContextMenu={e => this.contextMenu(e, item)}
                className={ this.state.value && this.state.value.id === item.id ? 'selected-item note-container' : 'note-container' }
              ><div className='item-wrap'>
                  <div className='file-image'></div>
                  <span className='note-title'>{item.title}</span>
                </div>
                { noteView === 'icon' ? '' : this.renderListInfo(item) }
                { noteView === 'icon' ? '' : <span className='item-tags'>{ Array.isArray(item.tags) && item.tags.join(' ') }</span>}
              </div>) }
          </div>
        </Scroll>
      </article>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayNotices);
