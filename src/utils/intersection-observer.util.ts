let observer: IntersectionObserver;
export const createInterceptorObserver = (
  el: Element,
  cb: () => void,
  opt: IntersectionObserverInit = {
    root: null,
    threshold: 0
  }
): IntersectionObserver => {
  const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cb();
        observer.unobserve(el);
      }
    });
  };
  if (!observer) {
    observer = new IntersectionObserver(handleIntersect, opt);
  }
  observer.observe(el);
  return observer;
};
