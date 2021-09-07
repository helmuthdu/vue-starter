export const waitForElementToBeAdded = (selector: string, wait = 250, attempts = 10): Promise<Element | null> => {
  let count = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element || count >= attempts) {
        clearInterval(interval);
        resolve(element);
      }
      count++;
    }, wait);
  });
};
