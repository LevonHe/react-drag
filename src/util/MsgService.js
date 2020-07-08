import { notification } from 'antd';
import intl from 'react-intl-universal';

const MsgService = {
  success: function successFunc(success) {
    notification.success({
      message: success,
      duration: 3,
    });
  },
  error: function errorFunc(error) {
    let message = '';
    if (error && error.errorCode) {
      message = intl.get('errorCode.' + error.errorCode) || intl.get('errorCode.000');
    }
    if (!message && error && error.errorMessage) {
      message = error.errorMessage;
    }
    if (!message && error && error.status) {
      message = intl.get('errorCode.' + error.status) || intl.get('errorCode.000');
    }
    if (!message && error && error.message) {
      message = error.message;
    }
    if (!message) {
      message = error;
    }
    if (message.indexOf('<html>') !== -1) {
      message = intl.get('errorCode.000');
    }
    notification.error({
      message,
      duration: 3,
    });
  },
};

export default MsgService;
