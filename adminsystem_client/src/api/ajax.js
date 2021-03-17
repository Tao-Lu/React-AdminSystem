/* eslint-disable no-else-return */
import axios from 'axios';
import { message } from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    let promise;
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data,
      });
    } else {
      promise = axios.post(url, data);
    }

    // handle error and directly return data rather response
    promise
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error(`request error: ${error.message}`);
      });
  });
}
