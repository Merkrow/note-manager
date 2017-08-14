import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as filterNotesActions from '../../../actions/filterNotes';
import './Search.scss';

const mapStateToProps = () => ({});

const actions = Object.assign({}, filterNotesActions);
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
  }
  handleInputChange(e) {
    this.props.actions.setFilter(e.target.value);
  }
  toggleAnimation() {
    this.setState({ focused: !this.state.focused });
  }
  render() {
    const { focused } = this.state;
    return (
      <div className='search'>
        <input
          onFocus={() => this.toggleAnimation()}
          onBlur={() => this.toggleAnimation()}
          onChange={e => this.handleInputChange(e)}
          className={focused ? 'search-input-focused' : 'search-input-blured'}
          type='text' placeholder='Search' />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
