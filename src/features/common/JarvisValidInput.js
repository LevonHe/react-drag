import React from 'react';
import Schema from 'async-validator';
import { Tooltip } from 'antd';

export default class JarvisValidInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: this.props.defaultValue,
      isRequired: false,
      validateState: '',
      validateMessage: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultValue !== state.currentValue) {
      return {
        currentValue: props.defaultValue,
      };
    }
    return null;
  }

  componentDidMount() {
    if (this.props.prop) {
      this.setRules();
      this.props.onInputItemAdd(this);
    }
  }

  componentWillUnmount() {
    this.props.onInputItemRemove(this);
  }

  setRules = () => {
    const rules = this.getRules();
    if (rules.length) {
      this.setState({
        isRequired: rules.some((i) => i.required),
      });
    }
  };

  getRules = () => this.props.validation || [];

  getFilteredRules = (trigger) => {
    const rules = this.getRules();
    return rules.filter((r) => !r.trigger || r.trigger.indexOf(trigger) !== -1);
  };

  validate = (trigger, callback = function callback() {}) => {
    const rules = this.getFilteredRules(trigger);
    if (!rules || rules.length === 0) {
      return true;
    }
    this.setState({
      validateState: 'validating',
    });
    const descriptor = {
      [this.props.prop]: rules,
    };
    const schema = new Schema(descriptor);
    const model = {
      [this.props.prop]: this.state.currentValue,
    };
    schema.validate(model, { firstFields: true }, (errors) => {
      this.setState(
        {
          validateState: !errors ? 'success' : 'error',
          validateMessage: errors ? errors[0].message : '',
        },
        () => {
          callback(this.state.validateMessage);
        }
      );
    });
  };

  inputChange = (e) => {
    const { value } = e.target;
    this.setState({
      currentValue: value,
    });
    this.props.onChange && this.props.onChange(value);
    if (!value) {
      this.props.onClear && this.props.onClear();
    }
    const _this = this;
    setTimeout(() => {
      _this.validate('change');
    }, 20);
  };

  inputBlur = (e) => {
    this.props.onBlur && this.props.onBlur(e);
    const _this = this;
    setTimeout(() => {
      _this.validate('blur');
    }, 20);
  };

  inputFocus = (e) => {
    this.props.onFocus && this.props.onFocus(e);
  };

  render() {
    const { placeholder, disabled, style } = this.props;
    const { isRequired, validateState, validateMessage, currentValue } = this.state;
    return (
      <span className="valid-input-area">
        {isRequired ? (
          <span className="valid-input-item-required">*</span>
        ) : (
          <span className="valid-input-item-not-required">*</span>
        )}
        <Tooltip title={placeholder} placement="topLeft" mouseEnterDelay={0.5}>
          <input
            type="text"
            style={style}
            className={
              validateState === 'error'
                ? disabled
                  ? 'valid-input-item input-invalid input-disabled'
                  : 'valid-input-item input-invalid'
                : disabled
                ? 'valid-input-item input-disabled'
                : 'valid-input-item'
            }
            value={currentValue || ''}
            placeholder={placeholder}
            disabled={disabled}
            onChange={this.inputChange}
            onBlur={this.inputBlur}
            onFocus={this.inputFocus}
          ></input>
        </Tooltip>
        {validateState === 'error' && <span className="valid-input-item-message">{validateMessage}</span>}
      </span>
    );
  }
}
