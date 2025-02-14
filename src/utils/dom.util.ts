const observers = new WeakMap<Element, IntersectionObserver>();

const intersectionCallback =
  (element: Element, callback: () => void) =>
  (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element);
      }
    }
  };

/**
 * Waits until an element intersects with the viewport.
 * Uses a single IntersectionObserver per element to avoid duplicates.
 */
export function waitUntilElementIntersects(
  element: Element,
  callback: () => void,
  options: IntersectionObserverInit = { root: null, threshold: 0 },
): IntersectionObserver {
  if (observers.has(element)) return observers.get(element)!;

  const observer = new IntersectionObserver(intersectionCallback(element, callback), options);
  observer.observe(element);
  observers.set(element, observer);

  return observer;
}

type WaitUntilElementAppearsConfig = {
  wait?: number;
  attempts?: number;
  root?: HTMLElement | Document;
};

/**
 * Waits for an element to appear in the DOM, polling at intervals.
 */
export function waitUntilElementAppears(
  selectors: string | string[],
  { wait = 250, attempts = 10, root = document }: WaitUntilElementAppearsConfig = {},
): Promise<Element | undefined> {
  let count = 0;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = Array.isArray(selectors)
        ? selectors.map((s) => root.querySelector(s)).find(Boolean)
        : root.querySelector(selectors);

      if (element || count >= attempts) {
        clearInterval(interval);
        resolve(element || undefined);
      }
      count++;
    }, wait);
  });
}

/**
 * Gets the root host element for a given target inside a shadow DOM, if applicable.
 */
export function getHostElement(target: HTMLElement): HTMLElement | null {
  let node: Node | null = target;

  while (node) {
    if (node instanceof ShadowRoot) return node.host as HTMLElement;
    node = node.parentNode;
  }

  return null;
}

/**
 * Dynamically imports a JavaScript file, ensuring it is loaded only once.
 */
export function importJS(url: string, attributes: Record<string, string> = {}): Promise<boolean> {
  if (!url) return Promise.reject(new Error('importJS() -> Missing URL Parameter'));

  if (document.querySelector(`script[src="${url}"]`)) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    Object.assign(script, {
      async: true,
      src: url,
      onload: () => resolve(true),
      onerror: () => reject(new Error(`Failed to load script: ${url}`)),
    });

    Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, value));
    document.head.append(script);
  });
}

/**
 * Dynamically imports a CSS file, ensuring it is loaded only once.
 */
export function importCSS(url: string, attributes: Record<string, string> = {}): Promise<boolean> {
  if (!url) return Promise.reject(new Error('importCSS() -> Missing URL Parameter'));

  if (document.querySelector(`link[href="${url}"]`)) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    Object.assign(link, {
      rel: 'stylesheet',
      href: url,
      onload: () => resolve(true),
      onerror: () => reject(new Error(`Failed to load CSS: ${url}`)),
    });

    Object.entries(attributes).forEach(([key, value]) => link.setAttribute(key, value));
    document.head.prepend(link);
  });
}
