import * as _ from 'lodash';

/**
 * @description 路径转化成数组
 * @param {*} pathStr
 */
export const indexToArray = (pathStr) => `${pathStr}`.split('-').map((n) => +n);

/**
 * @description 是路径还是组件
 */
export const isPathOrCom = (pathIndex) => {
  let result = true;
  indexToArray(pathIndex).forEach((item) => {
    if (isNaN(item)) {
      result = false;
      return false;
    }
  });
  return result;
};

/**
 * @description 交换元素
 * @param {*} newIndex 新Index
 * @param {*} oldIndex 旧Index
 * @param {*} data 原data
 */
export const swap = (newIndex, oldIndex, data) => {
  const temp = data[newIndex];
  data[newIndex] = data[oldIndex];
  data[oldIndex] = temp;
};

/**
 * @description 添加元素
 * @param {*} newIndex 新的Index路径
 * @param {*} data 原始data
 * @param {*} dragItem 需要添加的元素
 */
export const itemAdd = (newIndex, data, dragItem) => {
  const newindexarr = indexToArray(newIndex);
  const first = newindexarr.shift();
  let parent = data;
  if (newindexarr.length > 0) {
    parent = parent[first];
    newindexarr.forEach((item, index) => {
      if (index === newindexarr.length - 1) {
        parent.children.splice(item, 0, dragItem);
      } else {
        parent = parent.children[item];
      }
    });
  } else {
    parent.splice(first, 0, dragItem);
  }
  return data;
};

/**
 * @description 删除元素
 * @param {*} oldIndex 原始Index路径
 * @param {*} data 原始data
 */
export const itemRemove = (oldIndex, data) => {
  const oldIndexArr = indexToArray(oldIndex);
  const first = oldIndexArr.shift();
  let parent = data;
  if (oldIndexArr.length > 0) {
    parent = parent[first];
    oldIndexArr.forEach((item, index) => {
      if (index === oldIndexArr.length - 1) {
        parent.children.splice(item, 1);
      } else {
        parent = parent.children[item];
      }
    });
  } else {
    parent.splice(first, 1);
  }
  return data;
};

/**
 * 获得拖拽元素
 * @param {*} oldIndex 原始index
 * @param {*} data 原始data
 */
export const getDragItem = (oldIndex, data) => {
  const oldIndexArr = indexToArray(oldIndex);
  let result = {};
  oldIndexArr.forEach((item) => {
    result = data[item];
    data = result.children;
  });
  return _.cloneDeep(result);
};

/**
 * @description 更新数组，用于同级拖拽排序
 * @param {*} newIndex 新index
 * @param {*} oldIndex 旧index
 * @param {*} data 原data
 * @param {*} parentPath 父组件路径
 */
export const UpdateItem = (newIndex, oldIndex, data, parentPath) => {
  const parentArr = indexToArray(parentPath);
  const first = parentArr.shift();
  let parent = data;
  if (parentArr.length > 0) {
    parent = data[first];
    parentArr.forEach((item, index) => {
      parent = parent.children[item];
    });
    swap(newIndex, oldIndex, parent.children);
    return data;
  }
  // 第一层
  if (!isNaN(first)) {
    // 有一层父级元素，first不为NaN
    parent = data[first];
    swap(newIndex, oldIndex, parent.children);
  } else {
    // 最外层 parentArr为null，first为NaN
    parent = data;
    swap(newIndex, oldIndex, parent);
  }
  return data;
};

/**
 * 通过从列表中拿的元素
 * @param {*} name 元素id名
 */
export const findItemObject = (componetList, name) => {
  const componentItem = componetList.filter((item) => {
    if (item.type === name) {
      return true;
    }
    return false;
  });
  return componentItem[0];
};

/**
 * @description 更新item信息
 * @param {*} newIndex 原index
 * @param {*} data data
 * @param {*} dragItem 点击的item
 */
export const itemUpdateInfo = (newIndex, data, dragItem) => {
  const newindexarr = indexToArray(newIndex);
  const first = newindexarr.shift();
  let parent = data;
  if (newindexarr.length > 0) {
    parent = parent[first];
    newindexarr.forEach((item, index) => {
      if (index === newindexarr.length - 1) {
        parent.children.splice(item, 1, dragItem);
      } else {
        parent = parent.children[item];
      }
    });
  } else {
    parent.splice(first, 1, dragItem);
  }
  return data;
};

/**
 * @description 复制元素
 * @param {*} oldIndex 原来的的Index路径
 * @param {*} data 原始data
 * @param {*} dragItem 需要添加的元素
 */
export const itemCopy = (oldIndex, data, dragItem) => {
  const oldIndexArr = indexToArray(oldIndex);
  const len = oldIndexArr.length;
  const newIndexArr = oldIndexArr;
  // 得到新的Index
  newIndexArr[len - 1] = newIndexArr[len - 1] + 1;
  const newIndex = newIndexArr.join('-');
  const newdata = itemAdd(newIndex, data, dragItem);
  return newdata;
};

/**
 * @description 是组件模版还是组件
 * @param {*} name
 */
export const isTempOrCom = (name) => name.indexOf('com-') > -1;

/**
 * @description 找到组件模版的code
 * @param {*} list
 * @param {*} name
 */
export const findTempCode = (list, name) => {
  const currentArr = _.find(list, { com_name: name });
  return JSON.parse(currentArr.com_code);
};

/**
 * @description 生成reactDom类型的代码
 * @param {*} template
 * @param {*} params
 */
export const renderPropsToString = (template, params) => {
  let res = template.replace(/`/g, '"');
  Object.keys(params).forEach((key) => {
    res = res.replace(`%${key}%`, params[key]);
  });
  return res;
};
