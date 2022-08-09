const observers = new WeakMap();
const intersectionCallback =
  (element: Element, callback: () => void) =>
  (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element);
      }
    });
  };

export const waitUtilElementIntersects = (
  element: Element,
  callback: () => void,
  options: IntersectionObserverInit = {
    root: null,
    threshold: 0
  }
): IntersectionObserver => {
  let observer: IntersectionObserver;
  if (observers.has(element)) {
    observer = observers.get(element);
  } else {
    observer = new IntersectionObserver(intersectionCallback(element, callback), options);
    observer.observe(element);
    observers.set(element, observer);
  }
  return observer;
};

export const waitUtilElementExists = (
  selector: string,
  { wait = 250, attempts = 10, root }: { wait: number; attempts: number; root?: HTMLElement }
): Promise<Element | null> => {
  let count = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const element = (root ?? document).querySelector(selector);
      if (element || count >= attempts) {
        clearInterval(interval);
        resolve(element);
      }
      count++;
    }, wait);
  });
};

export const importJS = (url: string, attributes?: Record<string, any>): Promise<boolean> => {
  if (!url) return Promise.reject(new Error('importJS() -> Missing URL Parameter'));
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

export const importCSS = (url: string, attributes?: Record<string, any>): Promise<boolean> => {
  if (!url) return Promise.reject(new Error('importCSS() -> Missing URL Parameter'));
  const styleElement = document.querySelector(`link[href="${url}"]`);
  if (styleElement !== null) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const element = document.createElement('link');
    element.setAttribute('rel', 'stylesheet');
    element.setAttribute('href', url);
    for (const attr in attributes) element.setAttribute(attr, attributes[attr]);
    element.onload = () => resolve(true);
    element.onerror = () => reject(new Error('Failed to load injected style element'));
    document.head.insertBefore(element, document.head.firstChild);
  });
};
