import React, { Component } from 'react';

class Scroll extends Component {
  constructor(props) {
    super(props);
    this.state = { scrollingTop: false, positionTop: 0, scrollingLeft: false, positionLeft: 0, };
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }
  componentDidMount() {
    if (this.div) {
      this.div.addEventListener('scroll', this.handleOnScroll, false);
    }
  }
  handleOnScroll(e) {
    const { positionTop, positionLeft, scrollingTop, scrollingLeft } = this.state;
    const { scrollTop, scrollLeft } = this.div;
    if (!scrollingTop && positionTop - scrollTop !== 0) {
      this.setState({ scrollingTop: true });
    }
    if (!scrollingLeft && positionLeft - scrollLeft !== 0) {
      this.setState({ scrollingLeft: true });
    }
    if (typeof this.timeout === 'number') {
      window.clearTimeout(this.timeout);
    }
    this.setState({ positionTop: scrollTop });
    this.setState({ positionLeft: scrollLeft });
    this.timeout = window.setTimeout(this.hideScrollbar.bind(this), 500);
  }
  getScrollbarHeight() {
    const { scrollHeight, clientHeight } = this.div;
    return clientHeight / scrollHeight * clientHeight;
  }
  getScrollBarWidth() {
    const { scrollWidth, clientWidth } = this.div;
    return clientWidth / scrollWidth * clientWidth;
  }
  hideScrollbar() {
    this.setState({ scrollingTop: false });
    this.setState({ scrollingLeft: false });
  }
  calculateTopOffset() {
    const { scrollTop, scrollHeight, clientHeight } = this.div;
    return ((scrollTop + clientHeight / 2) / (scrollHeight / 2) * clientHeight / 2
      - (clientHeight / scrollHeight * clientHeight) / 2) + scrollTop;
  }
  calculateLeftOffset() {
    const { scrollLeft, scrollWidth, clientWidth } = this.div;
    return ((scrollLeft + clientWidth / 2) / (scrollWidth / 2) * clientWidth / 2
      - (clientWidth / scrollWidth * clientWidth) / 2) + scrollLeft;
  }
  renderVerticalScroll() {
    const height = this.getScrollbarHeight();
    const top = this.calculateTopOffset();
    const { positionLeft } = this.state;
    return (
      <div style={{ height, top, right: -positionLeft + 27 }} className='custom-vertical-scroll'>
      </div>
    );
  }
  renderHorizontalScroll() {
    const width = this.getScrollBarWidth();
    const left = this.calculateLeftOffset();
    const { positionTop } = this.state;
    return (
      <div style={{ width, left, bottom: -positionTop + 27 }} className='custom-horizontal-scroll'>
      </div>
    );
  }
  render() {
    return (
      <div ref={(div) => { this.div = div; }} className='scroll-wrapper'>
        { this.state.scrollingTop ? this.renderVerticalScroll() : ''}
        { this.state.scrollingLeft ? this.renderHorizontalScroll() : ''}
        { this.props.children }
      </div>
    );
  }
}

export default Scroll;
