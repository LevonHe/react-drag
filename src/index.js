import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale/en_US';
import zh_CN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import routeConfig from './routeConfig';
import CookieService from './util/CookieService';
import Root from './Root';
import app from './store/dva';
import './assets/styles/index.less';
import 'moment/locale/zh-cn';

// 设置antd组件的全局国际化
let lang = CookieService.getCookie('lang');
if (!lang || !['zh-CN', 'en-US'].includes(lang)) {
  lang = 'zh-CN';
  CookieService.setCookie('lang', 'zh-CN', 1);
}

let lan;
if (lang === 'zh-CN') {
  moment.locale('zh-cn');
  lan = zh_CN;
} else if (lang === 'en-US') {
  moment.locale('en');
  lan = en_US;
}

class App extends React.Component {
  state = {
    locale: lan,
  };

  render() {
    return (
      <ConfigProvider locale={this.state.locale}>
        <Root routeConfig={routeConfig}></Root>
      </ConfigProvider>
    );
  }
}

app.router(() => <App></App>);
app.start('#root');
