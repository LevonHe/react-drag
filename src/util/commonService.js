// 过滤请求参数
export const formatRequestParams = (params) => {
  if (!params) {
    return {};
  }
  Object.keys(params).forEach((k) => {
    if (params[k] === undefined || params[k] === null || params[k] === '') {
      delete params[k];
    }
  });
  return params;
};

// 解码JWTtoken
export const decodeToken = (token) => {
  if (!token) {
    return {};
  }
  if (token.indexOf('.') === -1) {
    return {};
  }
  const objStr = decodeURIComponent(escape(window.atob(token.split('.')[1])));
  const newStr = objStr.replace(/"subjectId":(\d+)/, '"subjectId":"$1"');
  return JSON.parse(newStr);
};

// 过滤数组的重复数据
export const filterRepeatArrayElement = (array, property) => {
  const propertyArr = [];
  const indexArr = [];
  const newArray = [];
  array.forEach((e) => {
    propertyArr.push(e[property]);
  });
  propertyArr.forEach((item, index, self) => {
    if (self.lastIndexOf(item) === index) {
      indexArr.push(index);
    }
  });
  indexArr.forEach((i) => {
    newArray.push(array[i]);
  });
  return newArray;
};

// getBrowserType
function getVersion(versionStr) {
  const versionArr = versionStr.split('.');
  let version;
  if (versionArr.length === 1) {
    version = versionArr[0];
  } else if (versionArr.length > 1) {
    version = versionArr[0] + '.' + versionArr[1];
  }
  return parseFloat(version);
}
export const getBrowserType = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Firefox') > -1) {
    const versionStr = userAgent.split('Firefox/')[1].split(' ')[0];
    const version = getVersion(versionStr);
    return { type: 'Firefox', version };
  }
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Edge') > -1) {
    const versionStr = userAgent.split('Edge/')[1].split(' ')[0];
    const version = getVersion(versionStr);
    return { type: 'Edge', version };
  }
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
    const versionStr = userAgent.split('Chrome/')[1].split(' ')[0];
    const version = getVersion(versionStr);
    return { type: 'Chrome', version };
  }
  if (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('compatible') > -1) {
    if (userAgent.indexOf('MSIE 10.0')) {
      return { type: 'IE', version: 10.0 };
    }
    if (userAgent.indexOf('MSIE 9.0')) {
      return { type: 'IE', version: 9.0 };
    }
  }
  if (userAgent.indexOf('Trident') > -1) {
    return { type: 'IE', version: 11.0 };
  }

  return { type: 'none', version: 0 };
};

export const getUUID = () => {
  const s = [];
  const hexDigits = '01234567890abcdef';
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] && 0x3) || 0x8, 1);
  s[8] = '-';
  s[13] = '-';
  s[18] = '-';
  s[23] = '-';

  const uuid = s.join('');
  return uuid;
};

// 校验json
export const isJSON = (str) => {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};

// 处理bigint类型字符串数组
export const processStrArrayBigInt = (strArray) => strArray.replace(/\[(\d+)/g, '["$1"').replace(/,\s+(\d+)/g, ',"$1"');

// 判断数值是否存在
export const isValueExist = (value) => {
  if (value || (value !== undefined && value !== null)) {
    return true;
  }
  return false;
};

// 文件大小单位换算
export const unitConversion = (value) => {
  if (value === 0) return '0 B';
  const k = 1024; // or 1000
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(value) / Math.log(k));
  return (value / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

// 判断表单数值是否为整型
export const isInteger = (val) => {
  if (val.includes('.') || val.trim().includes(' ')) {
    return false;
  }
  const numVal = parseFloat(val, 10);
  return numVal % 1 === 0;
};
