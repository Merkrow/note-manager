import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from '../../../Dropdown';
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
    this.deleteNote = this.deleteNote.bind(this);
    this.showEditorPopup = this.showEditorPopup.bind(this);
    this.closeContextMenu = this.closeContextMenu.bind(this);
  }
  componentDidMount() {
    const { getNotices } = this.props.actions;
    getNotices();
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
    const { contextMenuCoordinates, value } = this.state;
    return (
      <Dropdown
        from='note'
        closeContextMenu={this.closeContextMenu}
        value={value}
        deleteNote={this.deleteNote}
        showEditorPopup={this.showEditorPopup}
        coordinates={contextMenuCoordinates} />
    );
  }
  closeContextMenu() {
    this.setState({ showContextMenu: false });
  }
  contextMenu(e, note) {
    e.preventDefault();
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
    this.props.showPopup(0, note);
    if (this.state.showContextMenu) {
      this.closeContextMenu();
    }
  }
  render() {
    const { noteView, filterNotes } = this.props;
    const { showContextMenu } = this.state;
    const filteredNotices = this.filterNotices()
      .filter(item => item.title.indexOf(filterNotes) !== -1);
    return (
      <article className='files-article'>
        <Scroll>
          <div className={ noteView === 'icon' ? 'note-icons' : 'note-list' }>
            { noteView === 'icon' ? '' : this.renderListFirstLine() }
            { showContextMenu && this.renderContextMenu() }
            { filteredNotices
              .sort((note1, note2) => note1.position - note2.position)
              .map((item, index) =>
                <div
                  onDoubleClick={() => this.showEditorPopup(item)}
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
