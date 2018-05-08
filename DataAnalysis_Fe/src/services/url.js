import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/url/query?${stringify(params)}`);
}

export async function queryTree(params) {
  return request(`/api/url/queryTree?${stringify(params)}`);
}

export async function remove(params) {
  return request(`/api/url/remove`, {
    method: 'DELETE',
    body: {
      ...params,
      // method: 'delete',
    },
  });
}

export async function add(params) {
  return request(`/api/url/add`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}

export async function patch(params) {
  return request(`/api/url/patch`, {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}

export async function patchTree(params) {
  return request(`/api/url/patchTree`, {
    method: 'PATCH',
    body: {
      ...params,
    },
  });
}
