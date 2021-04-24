const appendScript = (url: string): Promise<boolean> => {
  const scriptElement = document.querySelector(`script[src="${url}"]`);
  if (scriptElement !== null) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.setAttribute('async', '');
    element.setAttribute('src', url);
    element.onload = () => resolve(true);
    element.onerror = () => reject(new Error('Failed to load injected script element'));
    document.head.append(element);
  });
};

const appendStyle = (url: string): Promise<boolean> => {
  const scriptElement = document.querySelector(`link[href="${url}"]`);
  if (scriptElement !== null) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const element = document.createElement('link');
    element.setAttribute('rel', 'stylesheet');
    element.onload = () => resolve(true);
    element.onerror = () => reject(new Error('Failed to load injected style element'));
    document.head.insertBefore(element, document.head.firstChild);
    // IE quirk: dynamically injected link element does not trigger
    // href if already set in injected element.
    // Setting the href attribute after append, triggers properly.
    // -> https://stackoverflow.com/questions/1184950/dynamically-loading-css-stylesheet-doesnt-work-on-ie#answer-5541628
    element.setAttribute('href', url);
  });
};

export const loadScriptAsync = (url: string): Promise<boolean> => {
  if (!url) return Promise.reject(new Error('loadScriptAsync() -> Missing URL Parameter'));
  return appendScript(url);
};

export const loadStyleAsync = (url: string): Promise<boolean> => {
  if (!url) return Promise.reject(new Error('loadStyleAsync() -> Missing URL Parameter'));
  return appendStyle(url);
};
