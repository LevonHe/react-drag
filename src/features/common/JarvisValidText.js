import React from 'react';

export default class JarvisValidText extends React.PureComponent {
  render() {
    const { isRequired, text } = this.props;
    return (
      <span className="jarvis-valid-text">
        {isRequired ? (
          <span className="valid-text-item-required">*</span>
        ) : (
          <span className="valid-text-item-not-required">*</span>
        )}
        <span className="jarvis-valid-text-item">{text}</span>
      </span>
    );
  }
}
