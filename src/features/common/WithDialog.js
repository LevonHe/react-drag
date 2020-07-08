import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import intl from 'react-intl-universal';
import { ConfigProvider, Modal } from 'antd';
import en_US from 'antd/es/locale/en_US';
import zh_CN from 'antd/es/locale/zh_CN';
import CookieService from '@/util/CookieService';

const withDialog = (WrappedComponent) => {
  function EnhancedComponent(props) {
    // eslint-disable-next-line prefer-const
    let { title, width, onClose, ...others } = props;
    if (!width) {
      width = '500px';
    }
    if (!title) {
      title = intl.get('common.modalTitle');
    }
    if (!onClose) {
      onClose = () => {};
    }

    // 弹窗组件国际化
    let lang = CookieService.getCookie('_lang');
    if (!lang || !['zh-CN', 'en-US'].includes(lang)) {
      lang = 'zh-CN';
    }
    let lan;
    if (lang === 'zh-CN') {
      moment.locale('zh-cn');
      lan = zh_CN;
    } else if (lang === 'en-US') {
      moment.locale('en');
      lan = en_US;
    }

    return (
      <ConfigProvider locale={lan}>
        <Modal
          visible={true}
          width={width || WrappedComponent.width}
          title={title || WrappedComponent.title}
          onCancel={onClose}
          footer={null}
          destroyOnClose={true}
        >
          <WrappedComponent {...others} onClose={onClose}></WrappedComponent>
        </Modal>
      </ConfigProvider>
    );
  }

  let container = document.createElement('div');

  /**
   * @title 弹窗名称，国际化之后的字符串，可选，不传时，显示默认弹窗名称
   * @width 弹窗宽度，如'600px'，可选，不传时，弹窗宽度为500px
   * @winData 传递给弹窗的参数，统一赋值给该对象的属性，可选
   * @onOk 弹窗确认时的回调，可选
   * @onCancel 弹窗取消时的回调，可选
   */
  EnhancedComponent.show = (title, width, winData, onOk, onCancel) => {
    if (!container) {
      container = document.createElement('div');
    }
    document.body.appendChild(container);

    const params = { title, width, winData, onOk, onCancel };
    function closeHandle() {
      if (onCancel) {
        onCancel();
      }
      if (container && container.tagName.toUpperCase() === 'DIV') {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
      }
      container = null;
    }

    ReactDOM.render(<EnhancedComponent {...params} onClose={closeHandle} />, container);
  };

  EnhancedComponent.hide = () => {
    if (container && container.tagName.toUpperCase() === 'DIV') {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }
    container = null;
  };

  return EnhancedComponent;
};

export default withDialog;
