import React, { useState } from 'react';
import { connect } from 'dva';
import { Input, Select, Button, Modal, Form, Collapse, Spin, Switch } from 'antd';
import * as _ from 'lodash';
import { itemUpdateInfo, itemRemove, itemCopy } from '@/util/utils';
import defaultPng from '@/assets/components/button.png';
import html2Canvas from 'html2canvas';
import ColorPicker from './ColorPicker';

const { Option } = Select;
const { Panel } = Collapse;

const Config = (props) => {
  const [visible, setVisible] = useState(false);
  const [showOrganization, setShowOrganization] = useState(false);

  const [imgBlob, setImgBlob] = useState(null);
  const [imgSrc, setImgSrc] = useState(defaultPng);
  const [imgLoading, setImgLoading] = useState(true);

  const { pageConfig, currentPageView, currentComponentView, componentConfig, orgArr, form, isPage, dispatch } = props;
  const { getFieldDecorator } = form;

  const config = isPage ? pageConfig : componentConfig;
  const currentView = isPage ? currentPageView : currentComponentView;

  // 具有副作用的dispatch
  const setCurrentView = (payload) => {
    dispatch({
      type: 'drag/setCurrentView',
      payload,
      isPage,
    });
  };

  const removeCurrentView = (payload) => {
    dispatch({
      type: 'drag/removeCurrentView',
      payload,
      isPage,
    });
  };

  const setConfig = (payload) => {
    dispatch({
      type: 'drag/setConfig',
      payload,
      isPage,
    });
  };

  // 配置项的渲染组件
  const renderConfig = (data, type) => {
    if (!data) {
      return;
    }
    if (JSON.stringify(data) !== '[]' && data) {
      return data.map((item, index) => (
        <Panel header={item.text} key={item.text}>
          <div key={index}>
            <div>
              {item.children.map((item, idx) => (
                <div key={idx}>{renderValue(item, type)}</div>
              ))}
            </div>
          </div>
        </Panel>
      ));
    }
  };

  // 渲染配置项
  const renderValue = ({ text: title, field: value, type, data }, propsType) => {
    let valueInfo = propsType === 'props' ? config.propsInfo : config.nodePropsInfo;
    if (propsType === 'props') {
      if (value.indexOf('.') !== -1) {
        const valuearr = value.split('.');
        valuearr.map((item, index) => {
          if (index === valuearr.length - 1) {
            valueInfo = valueInfo[item];
          } else {
            valueInfo = valueInfo[item];
          }
        });
      } else {
        valueInfo = valueInfo[value];
      }
    } else {
      // reactNodeInfo
      const valuearr = value.split('.');
      const key = valuearr[0];
      const params = valuearr[1];
      valueInfo = valueInfo[key].params[params];
    }
    if (type === 'string') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{title}</span>
          <Input
            value={valueInfo}
            style={{ width: '50%' }}
            onChange={(e) => changeValueParent(propsType, e.target.value, value)}
          ></Input>
        </div>
      );
    }
    if (type === 'array') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{title}</span>
          <Select
            defaultValue={valueInfo}
            style={{ width: '50%' }}
            onChange={(v) => changeValueParent(propsType, v, value)}
          >
            {data.map((item, index) => (
              <Option value={item.value} key={index}>
                {item.text}
              </Option>
            ))}
          </Select>
        </div>
      );
    }
    if (type === 'color') {
      return (
        <div style={{ display: 'flex' }}>
          <span>{title}</span>
          <ColorPicker
            color={valueInfo}
            style={{ width: '50%' }}
            onChange={(color) => changeValueParent(propsType, color, value)}
          ></ColorPicker>
        </div>
      );
    }
    if (type === 'boolean') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{title}</span>
          <Switch
            defaultChecked={valueInfo}
            style={{ width: '50%' }}
            onChange={(v) => changeValueParent(propsType, v, value)}
          ></Switch>
        </div>
      );
    }
    return <div>other</div>;
  };

  /**
   * @description change事件
   * @param {string} type 对应类型['props', 'reactNodeProps']
   * @param {string} key 所对应的属性名称 e.g: props.content -> content
   */
  const changeValueParent = (type, targetValue, key) => {
    if (type === 'props') {
      return changeValue(targetValue, key);
    }
    if (type === 'reactNodeProps') {
      return changeReactNodeValue(targetValue, key);
    }
  };

  /**
   * @description 改变 input 配置项触发的函数
   * @param {e} e event 触发得到的 e
   * @param {string} key 所对应的属性名称 e.g: props.content -> content
   */
  const changeValue = (targetValue, key) => {
    const { dragItem, arrIndex, propsInfo } = config;
    const data = _.cloneDeep(propsInfo);
    let configInfo = data;
    if (key.indexOf('.') !== -1) {
      const keyArr = key.split('.');
      keyArr.map((item, index) => {
        if (index === keyArr.length - 1) {
          configInfo[item] = targetValue;
        } else {
          configInfo = configInfo[item];
        }
      });
    } else {
      configInfo[key] = targetValue;
    }

    // setConfig
    setConfig({ propsInfo: data });

    dragItem.props = data;
    const oldData = _.cloneDeep(currentView);
    const newData = itemUpdateInfo(arrIndex, oldData, dragItem);

    // setCurrentView
    setCurrentView(newData);
  };

  /**
   * @description 改变 input 配置项触发的函数
   * @param {e} e event 触发得到的 e
   * @param {string} key 所对应的属性名称 e.g: props.content -> content
   */
  const changeReactNodeValue = (targetValue, key) => {
    // set reactinfo的key，修改reactnode的key
    const { nodePropsInfo, dragItem, arrIndex } = config;

    const data = _.cloneDeep(nodePropsInfo);
    const configInfo = data;

    const valueArr = key.split('.');
    const objkey = valueArr[0];
    const params = valueArr[1];
    // 赋值给config里对应的key
    configInfo[objkey].params[params] = targetValue;

    // setConfig
    setConfig({ nodePropsInfo: data });

    // 对应渲染到页面上
    dragItem.nodeProps = data;
    const newData = itemUpdateInfo(arrIndex, _.cloneDeep(currentView), dragItem);

    // setCurrentView
    setCurrentView(newData);
  };

  /**
   * @description 删除组件
   */
  const removeComponent = () => {
    const newData = itemRemove(config.arrIndex, _.cloneDeep(currentView));
    // 发送请求
    removeCurrentView(newData);
  };

  /**
   * @description 复制组件
   */
  const copyComponent = () => {
    const newData = itemCopy(config.arrIndex, _.cloneDeep(currentView), config.dragItem);
    // 发送请求
    setCurrentView(newData);
  };

  const renderFunction = (src, width, height, cb) => {
    const img = new Image();
    img.src = src;
    img.width = width;
    img.height = height;
    img.crossOrigin = '';
    // 保证图片加载完毕后再返回
    img.onload = () => {
      cb && cb();
    };
  };

  const download = (url, name) => {
    const target = document.createElement('a');
    target.href = url;
    target.download = name;
    const event = document.createElement('MouseEvents');
    event.initEvent('click', true, true);
    target.dispatchEvent(event);
  };

  const convertBase64UrlToBlob = (urlData) => {
    const arr = urlData.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bytes = window.atob(urlData.split(',')[1]); // 取消url的头，并转换为byte

    // 处理异常，将ASCII码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i += 1) {
      ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], { type: mime });
  };

  /**
   * @description 生成模板
   */
  const generateTemplate = () => {
    setImgSrc(defaultPng);
    const dragContainer = document.getElementsByClassName('selectDrag')[0];
    const opts = {
      logging: false,
      scale: 2,
      useCORS: true,
    };
    html2Canvas(dragContainer, opts).then((res) => {
      const { height, width } = res;
      const base64 = res.toDataURL('image/png', 1);
      renderFunction(base64, width, height, (img) => {
        const blob = convertBase64UrlToBlob(base64);
        setImgBlob(blob);
        console.log('img', img);
        if (img) {
          setImgSrc(img.src);
          setImgLoading(false);
        }
      });
    });
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  /**
   * @description 提交表单
   * @param {*} e
   */
  const submitForm = () => {
    const { form } = props;
    form.validateFields(async (err, value) => {
      if (err) {
        return;
      }
      const resfilePath = await uploadFile();
      const payload = {
        ...value,
        comCode: config.dragItem,
        filePath: resfilePath,
      };
      // dispatch setTemplateList getOwnTemplate
      await dispatch({
        type: 'drag/setTemplateList',
        payload,
      });

      await dispatch({
        type: 'drag/getOwnTemplate',
      });

      hideModal();
    });
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('image', imgBlob, 'image.png');
    // dispatch uploadFile
    return dispatch({
      type: 'components/uploadFile',
      payload: formData,
    });
  };

  const handleChange = (value) => {
    setShowOrganization(value === 'ORGANIZATION');
  };

  return (
    <div>
      <Button onClick={copyComponent} icon="copy" size="small">
        复制组件
      </Button>
      <Button onClick={removeComponent} icon="delete" size="small">
        删除组件
      </Button>
      {isPage ? (
        <Button onClick={generateTemplate} icon="edit" size="small">
          生成模板
        </Button>
      ) : null}
      <Collapse defaultActiveKey={['样式', '主题', '文字内容']}>
        {config && renderConfig(config.propsConfig, 'props')}
        {config && renderConfig(config.nodePropsConfig, 'reactNodeProps')}
      </Collapse>
      {isPage ? (
        <Modal
          width="50%"
          title="生成模板"
          visible={visible}
          onOk={submitForm}
          onCancel={hideModal}
          okText="确认"
          cancelText="取消"
        >
          <div>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
              <Form.Item label="组件名称">
                {getFieldDecorator('comName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入组件名称',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="组件状态">
                {getFieldDecorator('comStatus', {
                  rules: [{ required: true, message: '请输入组件状态' }],
                })(
                  <Select style={{ width: 120 }} onChange={handleChange}>
                    <Option value="PUBLIC">公开</Option>
                    <Option value="PERSONAL">个人</Option>
                    <Option value="ORGANIZATION">组织</Option>
                  </Select>
                )}
              </Form.Item>
              {showOrganization ? (
                <Form.Item label="所属组织">
                  {getFieldDecorator('comOrgArr', {
                    rules: [{ required: true, message: '请选择所属组织' }],
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择组件所公开属于的组织">
                      {orgArr.length && orgArr.map((item) => <Option key={item}>{item}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              ) : null}
              <Form.Item label="组件描述">
                {getFieldDecorator('comDescription', {
                  rules: [
                    {
                      required: true,
                      message: '请输入组件描述',
                    },
                  ],
                })(<Input></Input>)}
              </Form.Item>
              <Form.Item label="图片">
                <div style={{ width: '300px' }}>
                  <Spin spinning={imgLoading}>
                    <img id="myid" src={imgSrc} width="300px" alt="图片模板预览"></img>
                  </Spin>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

const createFormConfig = Form.create()(Config);

export default connect(({ drag, organization }) => ({
  pageConfig: drag.config,
  currentPageView: drag.currentView,
  orgArr: organization.orgArr,
  currentComponentView: drag.componentView,
  componentConfig: drag.componentConfig,
}))(createFormConfig);
