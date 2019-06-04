import axios from 'axios';

import apiBase from '../config';

const instance = axios.create({
  baseURL: apiBase,
  timeout: 10000,
});

const request = (method, url, data) => {
  const requestConfig = {
    method,
    url,
  };
  if (method === 'get') {
    return instance.request({ ...requestConfig, params: data });
  }
  return instance.request({ ...requestConfig, data });
};

const requestApi = method => (endpoint, data) =>
  request(method, endpoint, data);

const get = requestApi('get');
const post = requestApi('post');
const put = requestApi('put');
const del = requestApi('delete');

export { get, post, put, del };
