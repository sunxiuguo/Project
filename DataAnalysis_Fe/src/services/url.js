import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/url/query?${stringify(params)}`);
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
