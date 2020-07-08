import React from 'react';
import intl from 'react-intl-universal';
import Schema from 'async-validator';
import { Select, Tooltip } from 'antd';

const { Option } = Select;

export default class JarvisValidSelect extends React.Component {
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
      this.props.onSelectItemAdd(this);
    }
  }

  componentWillUnmount() {
    this.props.onSelectItemRemove(this);
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

  selectChange = (value) => {
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

  selectBlur = (e) => {
    this.props.onBlur && this.props.onBlur(e);
    const _this = this;
    setTimeout(() => {
      _this.validate('blur');
    }, 20);
  };

  selectFocus = (e) => {
    this.props.onFocus && this.props.onFocus(e);
  };

  onPopupScroll = (e) => {
    this.props.onPopupScroll && this.props.onPopupScroll(e);
  };

  render() {
    const { placeholder, disabled, options, style } = this.props;
    const { isRequired, validateState, validateMessage, currentValue } = this.state;
    return (
      <span className="valid-select-area">
        {isRequired ? (
          <span className="valid-select-item-required">*</span>
        ) : (
          <span className="valid-select-item-not-required">*</span>
        )}
        <Tooltip title={placeholder} placement="topLeft" mouseEnterDelay={0.5}>
          <Select
            style={style}
            placeholder={placeholder}
            disabled={disabled}
            value={currentValue}
            onChange={this.selectChange}
            onBlur={this.selectBlur}
            onFocus={this.selectFocus}
            onPopupScroll={this.onPopupScroll}
          >
            {options &&
              options.length &&
              options.map((r) => (
                <Option key={r.identifier || r.id || r.key} value={r.identifier || r.id || r.key}>
                  {r.name || intl.get(r.value)}
                </Option>
              ))}
          </Select>
        </Tooltip>
        {validateState === 'error' && <span className="valid-select-item-message">{validateMessage}</span>}
      </span>
    );
  }
}
