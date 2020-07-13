import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'dva';
import * as _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Tag, NavBar, Icon, InputItem, SearchBar, Result } from 'antd-mobile';
import { renderPropsToString } from '@/util/utils';
import MsgService from '@/util/MsgService';
import './CodeView.less';

const GlobalComponent = {
  Button,
  Tag,
  NavBar,
  Icon,
  InputItem,
  SearchBar,
  Result,
};

const codeView = (props) => {
  const { dispatch, currentView } = props;

  const [code, setCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const renderReactDom = ({ antd, componentName, props }) => {
    if (antd) {
      const Comp = GlobalComponent[componentName];
      return React.createElement(Comp, props);
    }
  };

  // 获取依赖组件
  const dependComponents = () => {
    // 对象数组
    const stringCurrentView = JSON.stringify(currentView);
    const regex = /"type":"\w+"/g;
    // 匹配所有相关字符串数组
    const stringArr = stringCurrentView.match(regex);
    const newarr = stringArr.map((item) => item.replace(/"type":"(.*?)"/g, '$1'));
    // 数组去重
    const components = [...new Set(newarr)];
    // 当前的以来list
    const componentsList = ['Tag', 'Button', 'Div', 'InputItem', 'NavBar', 'Result'];
    // 过滤
    const dependComponents = components.filter((item) => componentsList.includes(item));
    return dependComponents;
  };

  // 渲染成jsx
  const renderJSONToJSX = () => {
    const arr = dependComponents();
    const dependCom = arr.length > 0 ? `import { Icon, ${arr.join(', ')}} from 'antd-mobile';` : '';
    return `
    import React, { Component } from 'react';
    ${dependCom}

    class Index extends Component {
      constructor() {
        super();
      }
      render() {
        return (
          <>
           ${renderDom(currentView, 0)}
          </>
        )
      }
    }

    export default Index;
    `;
  };

  // 渲染jsx dom
  const renderDom = (data, flag) => {
    let result = '';
    data.map((item) => {
      if (item.children) {
        result += `<${item.type} ${renderStyle(item.props.style)}>
        ${renderDom(item.children, 1)}</${item.type}>`;
      } else {
        const { props, nodeProps } = item;
        if (flag) {
          result += `    <${item.type}${renderProps(props)} ${renderNodeProps(nodeProps)} ${renderStyle(props.style)}>
          ${props.content ? props.content : ''}</${item.type}>`;
        } else {
          result += `<${item.type}${renderProps(props)} ${renderNodeProps(nodeProps)} ${renderStyle(props.style)}>
          ${props.content ? props.content : ''}</${item.type}>`;
        }
      }
    });
    return result;
  };

  // 渲染props
  const renderProps = (props) => {
    let propsResult = '';
    Object.keys(props).forEach((key) => {
      if (key !== 'style' && key !== 'content') {
        const value = props[key];
        propsResult += ` ${key}="${value}"`;
      }
    });
    return propsResult;
  };

  // 渲染谈nodeProps
  const renderNodeProps = (props) => {
    let nodePropsResult = '';
    Object.keys(props).forEach((key) => {
      const value = props[key];
      const template = value.renderString;
      const params = value.params;
      nodePropsResult += `${key}={${renderPropsToString(template, params)}}`;
    });
    return nodePropsResult;
  };

  // 渲染style
  const renderStyle = (style) => {
    let styleResult = '';
    Object.keys(style).forEach((key) => {
      if (key !== 'border' && style[key]) {
        const value = style[key];
        styleResult += `${key}: '${value}', `;
      }
    });
    return styleResult ? `style={{ ${styleResult} }}` : '';
  };

  useEffect(() => {
    if (currentView.length > 0) {
      const code = renderJSONToJSX();
      setCode(code);
    } else {
      // 没有currentView
      MsgService.error('视图为空，无法生成代码，请返回页面');
    }
  }, [currentView]);

  const renderView = (data, index) =>
    data.map((item, i) => {
      const indexs = index === '' ? String(i) : `${index}-${i}`;
      // 有子元素嵌套
      if (item.children) {
        const { props: style = {} } = item;
        return (
          <div style={style.style} data-id={indexs} key={_.uniqueId()}>
            {item.children.length > 0 ? renderView(item.children, indexs) : null}
          </div>
        );
      }
      const Comp = GlobalComponent[item.type];
      // 有特殊属性，表示时ReactNode
      const ReactNodeProps = {};
      if (item.nodeProps) {
        const nodeProps = item.nodeProps;
        Object.keys(nodeProps).forEach((key) => {
          const func = JSON.parse(nodeProps[key].renderFunc);
          const params = nodeProps[key].params;
          const reactDomParams = func(params);
          const domContent = renderReactDom(reactDomParams);
          ReactNodeProps[key] = domContent;
        });
      }
      const props = {
        'data-id': indexs,
        key: _.uniqueId(),
        ...item.props,
        ...ReactNodeProps,
      };
      if (item.needDiv === true) {
        return (
          <div data-id={indexs} key={_.uniqueId()}>
            {React.createElement(Comp, props, item.props.content ? item.props.content : null)}
          </div>
        );
      }
      return React.createElement(Comp, props, item.props.content ? item.props.content : null);
    });

  //
  const getZip = () => {
    setModalVisible(true);
    const payload = {
      code: code,
    };
    const apiUrl = '/api/page/zip';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.blob())
      .then((blob) => {
        setModalVisible(false);
        const filename = 'code.zip';
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  const options = {
    selectOnLineNumbers: true,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', margin: '20px 40px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span onClick={() => getZip()}>生成代码压缩包</span>
          <CopyToClipboard
            text={code}
            onCopy={() => {
              MsgService.success('复制成功');
            }}
            style={{ margin: '0 20px', textAlign: 'right' }}
          >
            <span>复制代码</span>
          </CopyToClipboard>
        </div>
        <MonacoEditor
          width="600"
          height="667"
          language="javascript"
          theme="vs-light"
          value={code}
          options={options}
        ></MonacoEditor>
      </div>
      <div className="phone">
        <div className="container">{renderView(currentView, 0)}</div>
      </div>

      <Modal visible={modalVisible} footer={null} closable={false}>
        <div>
          正在生成代码压缩包...
          <div className="progress"></div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ drag }) => ({
  currentView: drag.currentView,
}))(codeView);
