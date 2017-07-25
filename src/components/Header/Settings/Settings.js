import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as noteViewActions from '../../../actions/noteView';
import * as directoriesActions from '../../../actions/directories';
import noteView from '../../../reducers/noteView';
import selectedDirectory from '../../../reducers/selectedDirectory';
import './Settings.scss';

const mapStateToProps = ({ noteView, selectedDirectory }) => ({ noteView, selectedDirectory });

const actions = Object.assign({}, noteViewActions, directoriesActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = ({ showDropdown: false });
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  handleOutsideClick() {
    this.toggleDropdown();
  }
  toggleDropdown() {
    const { showDropdown } = this.state;
    if (!showDropdown) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({ showDropdown: !this.state.showDropdown });
  }
  openPopup(value) {
    this.toggleDropdown();
    const { showPopup } = this.props;
    showPopup(value);
  }
  renderSettingsDropdown() {
    const { showDropdown } = this.state;
    return (
      <ul style={{ display: showDropdown ? 'inline-block' : 'none' }} className='settings-dropdown'>
        <li className='settings-dropdown-item' onClick={e => this.openPopup(e.target.value)} value='0'>New Note</li>
      </ul>
    );
  }
  changeView(e) {
    const { setIconView, setLineView } = this.props.actions;
    const value = e.target.parentNode.value ? e.target.parentNode.value : e.target.value;
    if (value === 'line' && this.props.noteView !== 'line') {
      setLineView();
    } else {
      setIconView();
    }
  }
  render() {
    const { showDropdown } = this.state;
    const { noteView } = this.props;
    const className = `settings-menu-button ${showDropdown ? 'active-settings-menu-button' : ''}`;
    return (
      <div className='settings'>
        <div className='view-settings'>
          <button
            className={ noteView === 'icon' ? 'settings-menu-button view-button-left view-button-selected' : 'settings-menu-button view-button-left'}
            value='icon'
            onClick={e => this.changeView(e)}>
            <img
              className='icons-view-image'
              src={ noteView === 'icon' ? '/images/icons-selected.png' : '/images/icons-not-selected.png' } />
          </button>
          <button
            className={ noteView === 'line' ? 'settings-menu-button view-button-right view-button-selected' : 'settings-menu-button view-button-right'}
            value='line'
            onClick={e => this.changeView(e)}>
            <img
              className='list-view-image'
              src={ noteView === 'line' ? '/images/lines-selected.png' : '/images/lines-not-selected.png' } />
          </button>
        </div>
        <div className='settings-menu'>
          <button onClick={() => this.toggleDropdown()} className={className}>
            <img className='settings-image-gear' src='/images/settings.png' />
            <img className='settings-image-dropdown' src='/images/dropdown.png' />
          </button>
          { this.renderSettingsDropdown() }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
