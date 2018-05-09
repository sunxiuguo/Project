import { query, add, remove, patch, queryTree, patchTree } from '../services/url';

export default {
  namespace: 'url',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    colsInfo:[],
    checkedKeys:[],
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
      // 会莫名其妙调用两次
      // 于是添加判断,是否有type字段,作为权宜之计
      if(payload.type){
        const {type,...params} = payload;
        const response = yield call(patchTree, params);
        yield put({
          type: 'patchTree',
          payload: response.cols,
        });
      }

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
        data: action.payload.data,
        colsInfo:action.payload.cols,
      };
    },
    patchTree(state, action) {
      return {
        ...state,
        colsInfo: action.payload,
      }
    },

  },
};
