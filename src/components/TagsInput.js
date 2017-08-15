import React, { Component } from 'react';
import './TagsInput.scss';

class TagsInput extends Component {
  constructor(props) {
    super(props);
    this.state = { tag: '', };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }
  handleFocus() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }
  handleBlur() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }
  handleKeyDown(e) {
    const { addTag, deleteTag, tags } = this.props;
    const { tag } = this.state;
    if (e.key === 'Enter' && tag !== '') {
      addTag(tag);
      this.setState({ tag: '' });
    }
    if (e.key === 'Backspace' && this.state.tag === '' && tags.length) {
      deleteTag(tags[tags.length - 1]);
    }
  }
  focusInput() {
    this.tagInput.focus();
  }
  renderTags() {
    const { tags } = this.props;
    const { tag } = this.state;
    return (
      <span className='tags-wrap'>
        { tags && tags.map((tag, index) => <span key={`tag-${index}`} className='tag'>{ tag }</span>) }
        <input
          type='text'
          className='tag-input'
          name='tag'
          ref={ (tagInput) => { this.tagInput = tagInput; }}
          value={tag}
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
          onChange={e => this.handleInputChange(e)} />
      </span>
    );
  }
  render() {
    return (
      <div onClick={() => this.focusInput()} className='tags-input-container'>
        <div className='tags-container'>
          { this.renderTags() }
        </div>
      </div>
    );
  }
}

export default TagsInput;
