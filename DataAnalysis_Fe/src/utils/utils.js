import moment from 'moment';
import React,{ Fragment } from 'react';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function getDateString(format,dateTime){
  const date = new Date(dateTime);
  const Y = date.getFullYear();
  const M = (date.getMonth()+1 < 10 ? `0${(date.getMonth()+1).toString()}` : date.getMonth()+1);
  const D = date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate();
  let result = "";
  switch(format.toLowerCase()){
    case "yyyymmdd" : result = Y+M+D;break;
    case "yyyy-mm-dd" : result = `${Y}-${M}-${D}`;break;
    case "yyyy/mm/dd" : result = `${Y}/${M}/${D}`;break;
    default : result = Y+M+D;break;
  }
  return result;
}
/**
 * react html转义
 * @param {*} text
 */
export function showhtml(text){
  const html = {__html:text};
return (
  <Fragment>
    <span dangerouslySetInnerHTML={html} />
  </Fragment>
  ) ;
}

/**
 * 取两个数组的并集
 * @export
 * @param {any} arr1
 * @param {any} arr2
 */
export function unionSet(arr1,arr2){
  const arr1Set = new Set(arr1);
  const arr2Set = new Set(arr2);
  // Array.from将Set转为数组
  return Array.from(new Set([...arr1Set,...arr2Set]));
}

/**
 * 取两个数组的交集
 *
 * @export
 * @param {any} arr1
 * @param {any} arr2
 */
export function intersectionSet(arr1,arr2){
  const arr1Set = new Set(arr1);
  const arr2Set = new Set(arr2);
  return Array.from(new Set([...arr1Set].filter(x => arr2Set.has(x))));
}

/**
 * 取两个数组的补集
 * @export
 * @param {any} arr1
 * @param {any} arr2
 */
export function differenceSet(arr1,arr2){
  const union = unionSet(arr1,arr2);
  const intersection = intersectionSet(arr1,arr2);
  return Array.from(new Set([...union].filter(x => !intersection.has(x))));
}

export function arrayTranspose(arr1){
  if(arr1.length === 0)
    return;
  let arr2 = [];
  //确定新数组有多少行
  for(var i=0;i<arr1[0].length;i++){
    arr2[i] = [];
  }
  //动态添加数据
  //遍历原数组
  for(var i=0;i<arr1.length;i++){
    for(var j=0;j<arr1[i].length;j++){
    arr2[j][i] = arr1[i][j];
    }
  }
  return arr2;
}
