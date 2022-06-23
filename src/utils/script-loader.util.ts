const appendScript = (url: string, attributes?: Record<string, any>): Promise<boolean> => {
  const scriptElement = document.querySelector(`script[src="${url}"]`);
  if (scriptElement !== null) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.setAttribute('async', '');
    element.setAttribute('src', url);
    for (const attr in attributes) element.setAttribute(attr, attributes[attr]);
    element.onload = () => resolve(true);
    element.onerror = () => reject(new Error('Failed to load injected script element'));
    document.head.append(element);
  });
};

const appendStyle = (url: string, attributes?: Record<string, any>): Promise<boolean> => {
  const scriptElement = document.querySelector(`link[href="${url}"]`);
  if (scriptElement !== null) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const element = document.createElement('link');
    element.setAttribute('rel', 'stylesheet');
    for (const attr in attributes) element.setAttribute(attr, attributes[attr]);
    element.onload = () => resolve(true);
    element.onerror = () => reject(new Error('Failed to load injected style element'));
    document.head.insertBefore(element, document.head.firstChild);
    element.setAttribute('href', url);
  });
};

export const loadScriptAsync = (url: string, attributes?: Record<string, any>): Promise<boolean> => {
  if (!url) return Promise.reject(new Error('loadScriptAsync() -> Missing URL Parameter'));
  return appendScript(url, attributes);
};

export const loadStyleAsync = (url: string, attributes?: Record<string, any>): Promise<boolean> => {
  if (!url) return Promise.reject(new Error('loadStyleAsync() -> Missing URL Parameter'));
  return appendStyle(url, attributes);
};
