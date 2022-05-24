import { DEFAULT_VERSION } from './default';

/**
 * Add script and css library of autodesk forge version 7.X.X
 * at the end of html file.
 * @param {*} version of autodesk forge library
 * @returns
 */
export const loadScripts = (version = DEFAULT_VERSION) =>
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
