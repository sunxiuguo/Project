import { query, add, remove, patch, queryTree, patchTree,patchOrder } from '../services/url';

export default {
  namespace: 'url',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeInfo:{
      list: [],
    },
    colsInfo:[],
    colsOrder:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(queryTree, payload);
      yield put({
        type: 'saveTree',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *patch({ payload, callback }, { call, put }) {
      const response = yield call(patch, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *patchTree({ payload }, { call, put }) {
      // 如果effects和reducers的方法名相同,会优先调用reducers的方法
      const response = yield call(patchTree, payload);
      yield put({
        type: 'saveCols',
        payload: response.cols,
      });
    },
    *getCheckedColsOrder({ payload }, { call, put }) {
      const response = yield call(patchOrder, payload);
      yield put({
        type: 'saveOrder',
        payload: response.colsOrder,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTree(state, action) {
      return {
        ...state,
        treeInfo: action.payload.treeInfo,
        colsInfo:action.payload.cols,
        colsOrder:action.payload.colsOrder,
        data:action.payload.data,
      };
    },
    saveCols(state, action) {
      return {
        ...state,
        colsInfo: action.payload,
      }
    },
    saveOrder(state, action) {
      return {
        ...state,
        colsOrder: action.payload,
      }
    },

  },
};
