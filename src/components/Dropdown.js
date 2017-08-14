import React, { Component } from 'react';
import './Dropdown.scss';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }
  handleOutsideClick(e) {
    const target = e.target || e.srcElement;
    if (!this.ul.contains(target)) {
      this.props.closeContextMenu();
    }
  }
  renderFolderContextMenu() {
    const { editFolder, deleteFolder, newFolder, coordinates } = this.props;
    return (
      <ul ref={ (ul) => { this.ul = ul; }} style={{ left: coordinates[0], top: coordinates[1] }} className='settings-dropdown'>
        <li className='settings-dropdown-item' onClick={() => editFolder()}>Edit Folder</li>
        <li className='settings-dropdown-item' onClick={() => deleteFolder()}>Delete Folder</li>
        <li className='settings-dropdown-item' onClick={() => newFolder()}>New Folder</li>
      </ul>
    );
  }
  renderNoteContextMenu() {
    const { showEditorPopup, deleteNote, coordinates, value } = this.props;
    return (
      <ul
        ref={ (ul) => { this.ul = ul; }}
        style={{ left: coordinates[0], top: coordinates[1] }}
        className='settings-dropdown'>
        <li className='settings-dropdown-item' onClick={() => showEditorPopup(value)}>Edit Note</li>
        <li className='settings-dropdown-item' onClick={() => deleteNote()}>Delete Note</li>
      </ul>
    );
  }
  render() {
    const { from } = this.props;
    return (
      <div>
        { from === 'note' ? this.renderNoteContextMenu() : this.renderFolderContextMenu() }
      </div>
    );
  }
}

export default Dropdown;
