import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import NotePopup from './components/Popups/NotePopup/NotePopup';
import Settings from './components/Header/Settings/Settings';
import DisplayDirectories from './components/Main/Sidebar/DisplayDirectories/DisplayDirectories';
import DisplayNotices from './components/Main/Content/DisplayNotes/DisplayNotices';
import Search from './components/Header/Search/Search';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: null, updateValue: null };
  }
  showPopup(value, updateValue) {
    const val = 'notice';
    this.setState({ showPopup: val, updateValue });
  }
  closePopup() {
    this.setState({ showPopup: null, updateValue: null });
  }
  renderPopup() {
    const { showPopup, updateValue } = this.state;
    if (showPopup === 'notice') return <NotePopup note={updateValue} closePopup={this.closePopup.bind(this)} />;
  }
  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <header className="header">
            <Settings showPopup={this.showPopup.bind(this)} />
            <Search />
          </header>
          { this.renderPopup() }
          <main className="main">
            <DisplayDirectories />
            <DisplayNotices showPopup={this.showPopup.bind(this)} />
          </main>
        </div>
      </Provider>
    );
  }
}

export default App;
