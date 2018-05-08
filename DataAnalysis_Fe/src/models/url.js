import { query, add, remove, patch, queryTree, patchTree } from '../services/url';

export default {
  namespace: 'url',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    colsInfo:[],
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
        type: 'saveCols',
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
    *patchTree({ payload, callback }, { call, put }) {
      const response = yield call(patchTree, payload);
      yield put({
        type: 'saveTree',
        payload: response.data,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCols(state, action) {
      return {
        ...state,
        data: action.payload.data,
        colsInfo:action.payload.cols,
      };
    },
    patchCols(state, action) {
      return {
        ...state,
        colsInfo: action.payload,
      }
    },


  },
};
