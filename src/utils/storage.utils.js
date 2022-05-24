export const storageItem = {
  auth: 'app/auth',
  accessToken: 'app/accessToken',
  refreshToken: 'app/refreshToken',
};

// ===========================================================================
// ALL LOCAL STORAGE METHODS
// ===========================================================================

export const getItemFromLS = (itemName) => {
  const item = localStorage.getItem(itemName);
  return item ? JSON.parse(item) : null;
};

export const setItemToLS = (itemName, value) => {
  localStorage.setItem(itemName, JSON.stringify(value));
};

export const removeItemFromLS = (itemName) => {
  localStorage.removeItem(itemName);
};

// ===========================================================================
// ALL SESSION STORAGE METHODS
// Note:
// - Short duration JWT (5-10 min)
// - Long duration refresh token (30-60 min)
// ===========================================================================

export const getItemFromSS = (itemName) => {
  const item = sessionStorage.getItem(itemName);
  return item ? JSON.parse(item) : null;
};

export const setItemToSS = (itemName, value) => {
  sessionStorage.setItem(itemName, JSON.stringify(value));
};

export const removeItemFromSS = (itemName) => {
  sessionStorage.removeItem(itemName);
};

/**
 * This Function use Local Storage as an event-emitter
 * again and sync Session Storage between tabs of the same
 * base URL on load.
 *
 * //TODO: logout error when open two tabs of browser
 * one tab still login another tab logout
 * => should implement logout via server
 */
export function shareSessionStorageBetweenTabs() {
  if (!sessionStorage.length) {
    // Ask other tabs for session storage
    setItemToLS('getSessionStorage', String(Date.now()));
  }
  window.addEventListener('storage', (event) => {
    if (event.key === 'getSessionStorage') {
      // Some tab asked for the sessionStorage -> send it
      setItemToLS('sessionStorage', JSON.stringify(sessionStorage));
      removeItemFromLS('sessionStorage');
    } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
      // sessionStorage is empty -> fill it
      const data = JSON.parse(JSON.parse(event.newValue));
      for (const [key, value] of Object.entries(data)) {
        setItemToSS(key, JSON.parse(value));
      }
    }
  });
}

/*
eslint no-restricted-syntax: 0
*/
