import React, { Component } from 'react';
import './DirectorySelector.scss';

class DirectorySelector extends Component {
  constructor(props) {
    super(props);
    this.state = { showDropdown: false, currentValue: null };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentWillMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
    const { selectedId = 1 } = this.props;
    this.setState({ currentValue: selectedId });
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }
  handleOutsideClick(e) {
    if (this.div.contains(e.target)) {
      return;
    }
    this.setState({ showDropdown: false });
  }
  trackClick(e) {
    this.setState({ currentValue: e.target.value, showDropdown: false });
    this.props.changeDirectory(e);
  }
  toggleDropdown() {
    this.setState({ showDropdown: !this.state.showDropdown });
  }
  findValue(val) {
    const { directories } = this.props;
    return directories.filter(item => item.id === Number(val))[0].name;
  }
  render() {
    const { directories } = this.props;
    const { showDropdown, currentValue } = this.state;
    return (
      <div ref={(div) => { this.div = div; }} className='directory-selector'>
        <input
          type='button'
          value={this.findValue(currentValue)}
          onClick={() => this.toggleDropdown()} />
        <ul className={ showDropdown ? 'show-directory-selector' : ''}>
          { directories.sort((item1, item2) => item1.id - item2.id).map(item =>
            <li key={item.id}
              className={ item.id === currentValue ? 'folder-option selected-option' : 'folder-option'}
              onClick={e => this.trackClick(e)}
              value={item.id}>
              <img src='/images/blue-folder.png'/>
              { item.name }
            </li>)}
        </ul>
      </div>
    );
  }
}

export default DirectorySelector;
