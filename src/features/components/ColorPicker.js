import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

export default class SketchColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
  }

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleClose = () => {
    this.setState({
      displayColorPicker: false,
    });
  };

  render() {
    const styles = reactCSS({
      default: {
        swatch: {
          padding: '5px',
          backgroundColor: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={{ backgroundColor: this.props.color, width: '20px', height: '20px' }}></div>
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose}></div>
            <SketchPicker color={this.props.color} onChange={(color) => this.props.onChange(color.hex)}></SketchPicker>
          </div>
        ) : null}
      </div>
    );
  }
}
