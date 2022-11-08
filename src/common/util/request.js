import Request from 'luch-request';
const isProduction = process.env.NODE_ENV === 'production';

const http = new Request();

const TIMEOUT = 10000;

const origin = isProduction
  ? 'https://vd.gagaprince.top'
  : 'http://localhost:3000';

export const getSelf = async (path, data) => {
  const url = `${origin}${path}`;
  console.log(url);
  return get(url, data);
};

export const get = async (url, data, header = {}, timeout = TIMEOUT) => {
  return http
    .get(url, {
      params: data,
      header,
      timeout,
    })
    .then((ret) => {
      if (ret.statusCode === 200) {
        return ret.data;
      }
      return {};
    });
};

export const post = async (url, data, header, timeout = TIMEOUT) => {
  return http
    .post(url, data, {
      header,
      timeout,
    })
    .then((ret) => {
      if (ret.statusCode === 200) {
        return ret.data;
      }
      return {};
    });
};

export const request = ({ url, data, method = 'GET', timeout, header }) => {
  console.log({ url, data, method, timeout, header });
  if (method.toLocaleUpperCase() === 'GET') {
    return get(url, data, header, timeout);
  } else if (method.toLocaleUpperCase() === 'POST') {
    return post(url, data, header, timeout);
  }
};
