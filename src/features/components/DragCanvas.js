import React from 'react';
import Sortable from 'react-sortablejs';
import { connect } from 'dva';
import * as _ from 'lodash';
import { Button, Tag, NavBar, Icon, InputItem, SearchBar, Result } from 'antd-mobile';
import {
  UpdateItem,
  isPathOrCom,
  getDragItem,
  indexToArray,
  itemAdd,
  itemRemove,
  isTempOrCom,
  findTempCode,
  findItemObject,
} from '@/util/utils';
import componentList from '../drag/config';
import './DragCanvas.less';

const sortOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  group: {
    name: 'formItem',
    pull: true,
    put: true,
  },
};

const comData = [
  {
    type: 'div',
    nested: true,
    props: {
      style: {
        border: '1px solid red',
        width: '200px',
      },
    },
    children: [],
  },
];

const GlobalComponent = {
  Button,
  Tag,
  NavBar,
  Icon,
  InputItem,
  SearchBar,
  Result,
};

const renderReactDom = ({ antd, componentName, props }) => {
  if (antd) {
    const Comp = GlobalComponent[componentName];
    return React.createElement(Comp, props);
  }
};

const DragCanvas = (props) => {
  const {
    currentPageView,
    pageSelectIndex,
    currentComponentView,
    componentSelectIndex,
    templateList,
    isPage,
    dispatch,
  } = props;

  const currentView = isPage ? currentPageView : currentComponentView;
  const selectIndex = isPage ? pageSelectIndex : componentSelectIndex;

  const setCurrentView = (payload) => {
    dispatch({
      type: 'drag/setCurrentView',
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

  // 拖拽的排序方法，同级拖曳
  const onUpdate = (evt) => {
    // 交换数组
    const { newIndex, oldIndex } = evt;
    // 父节点路径
    const parentPath = evt.path[1].getAttribute('data-id');
    const oldData = _.cloneDeep(currentView);
    const newData = UpdateItem(newIndex, oldIndex, oldData, parentPath);

    setCurrentView(newData);
  };

  const onAddItem = (evt) => {
    const startIndex = evt.newIndex;
    // 得到拖拽元素或者路径
    const comNameOrPath = evt.clone.dataset.id;
    const parentPath = evt.path[1].getAttribute('data-id');
    const newIndex = parentPath ? `${parentPath}-${startIndex}` : startIndex;
    const oldData = _.cloneDeep(currentView);
    if (isPathOrCom(comNameOrPath)) {
      // 跨级拖拽，需要考虑先删除元素还是先添加元素
      const oldIndex = comNameOrPath;
      const dragItem = getDragItem(oldIndex, oldData);
      if (indexToArray(oldIndex) < indexToArray(newIndex)) {
        // 先加后删
        const newTreeData = itemAdd(newIndex, oldData, dragItem);
        const newTreeData2 = itemRemove(oldIndex, newTreeData);

        setCurrentView(newTreeData2);
        return;
      }
      // 先删后加
      let newData = itemRemove(oldIndex, oldData);
      newData = itemAdd(newIndex, newData, dragItem);

      setCurrentView(newData);
    }
    if (isTempOrCom(comNameOrPath)) {
      // 拿到com-后面的com，然后再查找对应的位置，然后插入代码
      const temName = comNameOrPath.split('com-')[1];
      // findTempCode
      const tempObj = findTempCode(templateList, temName);
      const newData = itemAdd(newIndex, oldData, tempObj);

      // 修改currentView
      setCurrentView(newData);
      return;
    }
    const componentFormList = findItemObject(componentList, comNameOrPath);
    const newData = itemAdd(newIndex, oldData, componentFormList);

    setCurrentView(newData);
  };

  // 点击时，把config，info等属性保存到state里
  const onChoose = (evt) => {
    let parent = evt.target;
    while (parent.getAttribute('data-id') === null) {
      parent = parent.parentNode;
    }
    const arrIndex = evt.target.getAttribute('data-id') || parent.getAttribute('data-id');
    const dragItem = getDragItem(arrIndex, _.clone(currentView));
    let info = {};
    let reactNodeInfo = {};
    info = dragItem.props;
    reactNodeInfo = dragItem.nodeProps;
    const componentFromList = findItemObject(componentList, dragItem.type);
    const config = componentFromList.config;
    const reactNodeConfig = componentFromList.reactNodeConfig;

    // 存drag相关的payload
    const payload = {
      dragItem,
      arrIndex,
      propsInfo: info,
      propsConfig: config,
      nodePropsInfo: reactNodeInfo,
      nodePropsConfig: reactNodeConfig,
    };

    setConfig(payload);
  };

  const renderView = (data, index) =>
    data.map((item, i) => {
      // index
      const indexs = index === '' ? String(i) : `${index}-${i}`;

      // 选中时的class
      const isSelectClass = {
        border: '1px dashed red',
      };
      const isSelect = indexs === selectIndex ? isSelectClass : {};
      const selectClass = indexs === selectIndex ? 'selectDrag' : 'unselectDrag';

      // 渲染，有子元素的嵌套的
      if (item.children) {
        const { props: style = {} } = item;
        const draggable = {
          // border: '1px dashed black'
        };
        const mergestyle = { ...style.style, ...draggable, ...isSelect };
        let divprops = {
          style: mergestyle,
          'data-id': indexs,
          key: _.uniqueId(),
        };
        if (selectClass) {
          divprops = {
            ...divprops,
            className: selectClass,
          };
        }
        return React.createElement(
          'div',
          divprops,
          <Sortable
            style={{ minHeight: 50 }}
            key={_.uniqueId()}
            options={{
              ...sortOptions,
              onAdd: (evt) => onAddItem(evt),
              onUpdate: (evt) => onUpdate(evt),
            }}
          >
            {item.children.length > 0 ? renderView(item.children, indexs) : null}
          </Sortable>
        );
      }
      const Comp = GlobalComponent[item.type];
      // 具有特殊属性(ReactNode)
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
      let props = {
        'data-id': indexs,
        key: _.uniqueId(),
        ...item.props,
        ...ReactNodeProps,
      };
      if (selectClass) {
        props = {
          ...props,
          className: selectClass,
        };
      }
      if (item.needDiv === true) {
        const draggable = {
          // border: '1px dashed blue'
        };
        const mergestyle = { ...draggable, ...isSelect };
        return (
          <div data-id={indexs} style={mergestyle} key={_.uniqueId()}>
            {React.createElement(Comp, props, item.props.content ? item.props.content : null)}
          </div>
        );
      }
      const borderStyle = isSelect.border || '';
      const cloneProps = _.cloneDeep(props);
      const MergeProps = _.merge(cloneProps, {
        style: {
          border: borderStyle,
        },
      });

      return React.createElement(Comp, MergeProps, item.props.content ? item.props.content : null);
    });

  return (
    <div
      style={{
        width: '375px',
        height: '667px',
        backgroundColor: 'white',
        margin: '20px',
      }}
      className="dragContainer"
    >
      {currentView && currentView.length && (
        <Sortable
          options={{
            ...sortOptions,
            onAdd: (evt) => onAddItem(evt),
            onUpdate: (evt) => onUpdate(evt),
          }}
          onClick={(evt) => onChoose(evt)}
          key={_.uniqueId()}
        >
          {renderView(currentView, '')}
        </Sortable>
      )}
    </div>
  );
};

export default connect(({ drag }) => ({
  currentPageView: drag.currentView,
  pageSelectIndex: drag.config.arrIndex,
  templateList: drag.templateList,
  currentComponentView: drag.componentView,
  componentSelectIndex: drag.componentConfig.arrIndex,
}))(DragCanvas);
