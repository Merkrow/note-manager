import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as directoriesActions from '../../../../actions/directories'
import * as selectDirectoryActions from '../../../../actions/selectedDirectory';
import * as editDirectoryActions from '../../../../actions/editDirectory';
import directories from '../../../../reducers/directories';
import selectedDirectory from '../../../../reducers/selectedDirectory';
import editDirectory from '../../../../reducers/editDirectory';
import Scroll from '../../../Scroll';
import './DisplayDirectories.scss';

const mapStateToProps = ({ directories, selectedDirectory, editDirectory }) => ({
  directories,
  selectedDirectory,
  editDirectory
});

const actions = Object.assign({}, directoriesActions, selectDirectoryActions, editDirectoryActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

class DisplayDirectories extends Component {
  constructor(props) {
    super(props);
    this.state = { opened: [0], showDropdown: false, dropdownCoordinates: [0, 0], value: '', save: true };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentDidMount() {
    const { getDirectories } = this.props.actions;
    getDirectories();
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }
  handleOnChange(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value, save: false });
  }
  handleOutsideClick(e) {
    const target = e.target || e.srcElement;
    const { showDropdown } = this.state;
    if (showDropdown && !this.ul.contains(target)) {
      this.closeContextMenu();
    }
  }
  toggleDirectory(folder) {
    const { opened } = this.state;
    const { id } = folder;
    if (opened.indexOf(id) === -1) {
      this.setState({ opened: [...opened, id] });
    } else {
      this.setState({ opened: opened.filter(val => val !== id) });
    }
  }
  openDirectory(folder) {
    const { setActiveDirectory } = this.props.actions;
    setActiveDirectory(folder.id);
  }
  openContextMenu(e, item) {
    e.preventDefault();
    document.addEventListener('click', this.handleOutsideClick, false);
    this.openDirectory(item);
    this.setState({ showDropdown: true, dropdownCoordinates: [e.clientX, e.clientY] });
  }
  closeContextMenu() {
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.setState({ showDropdown: false });
  }
  deleteFolder() {
    const { selectedDirectory } = this.props;
    const { deleteDirectory, removeActiveDirectory } = this.props.actions;
    this.closeContextMenu();
    if (Number(selectedDirectory) !== 1) {
      deleteDirectory(selectedDirectory);
      removeActiveDirectory();
      return;
    }
    alert('Impossible to delete root folder!');
  }
  editFolder() {
    const { directories, selectedDirectory } = this.props;
    const { setEditDirectory } = this.props.actions;
    this.closeContextMenu();
    const edit = directories.find(item => item.id === selectedDirectory);
    setEditDirectory(edit);
    this.setState({ value: edit.name });
  }
  newFolder() {
    const { selectedDirectory, directories } = this.props;
    const { postDirectory } = this.props.actions;
    const { opened } = this.state;
    this.closeContextMenu();
    if (opened.indexOf(selectedDirectory) === -1) {
      this.setState({ opened: [...opened, selectedDirectory] });
    }
    postDirectory({ id: selectedDirectory, name: this.checkUntitled(selectedDirectory)});
  }
  renderContextMenu(e, id) {
    const { showDropdown, dropdownCoordinates } = this.state;
    const { selectedDirectory } = this.props;
    return (
      <ul ref={ul => { this.ul = ul; }} style={{ display: showDropdown ? 'inline-block' : 'none', left: dropdownCoordinates[0], top: dropdownCoordinates[1] }} className='settings-dropdown'>
        <li className='settings-dropdown-item' onClick={() => this.editFolder()}>Edit Folder</li>
        <li className='settings-dropdown-item' onClick={() => this.deleteFolder()}>Delete Folder</li>
        <li className='settings-dropdown-item' onClick={() => this.newFolder()}>New Folder</li>
      </ul>
    );
  }
  saveChanges() {
    const { save, value } = this.state;
    const { updateDirectory, removeEditDirectory } = this.props.actions;
    const { editDirectory, directories } = this.props;
    if (!save) {
      updateDirectory(editDirectory.id, Object.assign(editDirectory, { name: value || this.checkUntitled(editDirectory.parentId) }));
      this.setState({ save: true });
    }
    removeEditDirectory();
  }
  checkUntitled(parentId) {
    const { directories } = this.props;
    const inner = directories.filter((item) => item.parentId === parentId);
    const lastIndex = inner.reduce((acc, item) => {
      if ('untitled folder' !== item.name && item.name.indexOf('untitled folder') !== -1) {
        const nameArr = item.name.split(' ');
        return nameArr[nameArr.length - 1];
      }
      return acc;
    }, 0);
    return lastIndex === '0' ? 'untitled folder' : `untitled folder ${Number(lastIndex) + 1}`;
  }
  renderDirectories() {
    const { directories, selectedDirectory, editDirectory } = this.props;
    const { opened, value } = this.state;
    const sortedDirectories = directories.reduce((acc, item) => {
      const { parentId } = item;
      if (!parentId) {
        acc[0] = [];
        acc[0].push(item);
        return acc;
      }
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(item);
      return acc;
    }, {});
    const renderTree = ({ obj, id, result, paddingLeft }) => {
      if (opened.indexOf(id) !== -1 && checkChildren(obj, id)) {
        obj[id].map((item) => {
          const temp =  editDirectory && editDirectory.id === item.id ?
            <li className='directory' key={item.id} style={{ paddingLeft: `${paddingLeft}px`, backgroundPosition: `${paddingLeft - 23}px 4px` }}>
              <input onChange={e => this.handleOnChange(e)} autoFocus defaultValue={item.name} name='value' onBlur={() => this.saveChanges()}/>
            </li> :
            <li
              onDoubleClick={() => this.toggleDirectory(item)}
              onClick={() => this.openDirectory(item)}
              onContextMenu={e => this.openContextMenu(e, item)}
              key={item.id}
              className={selectedDirectory === item.id ? 'selected-directory directory' : 'directory'}
              style={{ paddingLeft: `${paddingLeft}px`, backgroundPosition: `${paddingLeft - 23}px 4px` }}
            ><span>{item.name}</span></li>;
          result.push(temp);
          if (checkChildren(obj, item.id)) {
            result = renderTree({ obj, id: item.id, result, paddingLeft: paddingLeft + 13 });
          }
        });
      }
      return result;
    };
    const checkChildren = (arr, id) => arr[id];
    return renderTree({ obj: sortedDirectories, id: 0, result: [], paddingLeft: 40 });
  }
  render() {
    return (
      <aside className='sidebar'>
        { this.renderContextMenu() }
        <Scroll>
          <ul className='directories-list'>
            { this.renderDirectories() }
          </ul>
        </Scroll>
      </aside>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayDirectories);
