import {api} from '../../api/axiosClient';

// Get token from server
const token2legged = '/forge/oauth/token-2-legged';
const token3legged = '/forge/oauth/token-3-legged';

const getToken = async (url) => {
  const {data} = await api.get(url);
  return data?.access_token;
};

/**
 * Add script and css library of autodesk forge version 7.X.X
 * at the end of html file.
 * @param {*} version of autodesk forge library
 * @returns
 */
export const loadScripts = (version = '7.*') =>
  new Promise((resolve, reject) => {
    let ready = false;
    const script = document.createElement('script');
    script.src = `https://developer.api.autodesk.com/modelderivative/v2/viewers/${version}/viewer3D.min.js`;
    script.async = true;
    document.body.appendChild(script);
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = `https://developer.api.autodesk.com/modelderivative/v2/viewers/${version}/style.min.css`;
    document.body.appendChild(style);

    script.onload = () => {
      if (!ready) {
        ready = true;
        resolve(script);
      }
    };
    script.onerror = (msg) => {
      console.error(msg);
      reject(new Error('Error loading Forge script.'));
    };
    script.onabort = (msg) => {
      console.error(msg);
      reject(new Error('Forge script loading aborted.'));
    };
  });

