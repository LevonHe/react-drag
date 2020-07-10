import React from 'react';
import { Layout, Icon, Dropdown, Menu } from 'antd';
import intl from 'react-intl-universal';
import * as _ from 'lodash';
import CookieService from '@/util/CookieService';
import { getBrowserType } from '@/util/commonService';

const { Header, Content, Footer } = Layout;

export class JarvisLayout extends React.Component {
  componentDidMount() {
    const { pathname } = this.props.history.location;
    if (pathname === '' || pathname === '/') {
      this.props.history.push('/dragView');
    }
  }

  changeLocale = (e) => {
    const lang = CookieService.getCookie('lang');
    if (lang && lang === e.key) {
      return;
    }
    CookieService.setCookie('lang', e.key, 1);
    window.location.reload(true);
  };

  render() {
    const languageMenu = (
      <Menu onClick={this.changeLocale}>
        <Menu.Item key="zh-CN">{intl.get('common.zh_CN')}</Menu.Item>
        <Menu.Item key="en-US">{intl.get('common.en_US')}</Menu.Item>
      </Menu>
    );

    const browserType = getBrowserType().type;
    const browserVersion = getBrowserType().version;
    // Edge兼容
    const edge_layoutStyle = { backgroundColor: '#192129' };
    // ie9, ie10兼容
    const ie_rightSectionStyle = {
      minWidth: 'calc(100% - 200px)',
      maxWidth: 'calc(100% - 80px)',
      width: 'calc(100% - 80px)',
      height: '100%',
      overflowY: 'hidden',
    };
    const ie_rightContentStyle = { height: 'calc(100% - 106px)' };

    return (
      <Layout className="iot-layout" style={browserType.includes('Edge') ? edge_layoutStyle : null}>
        <Layout style={browserType === 'IE' && browserVersion < 11 ? ie_rightSectionStyle : null}>
          <Header className="jarvis-header">
            <Dropdown className="jarvis-dropdown" overlay={languageMenu} trigger={['click']}>
              <a className="jarvis-dropdown-link">
                <Icon className="jarvis-icon vertical-middle" type="global"></Icon>
                {intl.options.currentLocale === 'zh-CN' ? (
                  <span className="vertical-middle">{intl.get('common.zh_CN')}</span>
                ) : (
                  <span className="vertical-middle">{intl.get('common.en_US')}</span>
                )}
              </a>
            </Dropdown>
          </Header>
          <Content
            className="jarvis-content"
            style={browserType === 'IE' && browserVersion < 11 ? ie_rightContentStyle : null}
          >
            <div className="jarvis-container">{this.props.children}</div>
          </Content>
          <Footer className="jarvis-footer">
            <span>{intl.get('common.copyright1') + new Date().getFullYear() + intl.get('common.copyright2')}</span>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default JarvisLayout;
