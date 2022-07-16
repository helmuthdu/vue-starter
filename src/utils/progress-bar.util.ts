import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const delay = 500;
let timer: any;
let counter = 0;

export const startPageProgressBar = () => {
  if (counter === 0) {
    timer = setTimeout(() => {
      NProgress.start();
    }, delay);
  } else if (NProgress.isStarted()) {
    NProgress.inc();
  }
  counter++;
};

export const stopPageProgressBar = (force?: boolean) => {
  counter--;
  if (counter < 0 || force) {
    counter = 0;
  }
  if (counter === 0) {
    clearTimeout(timer);
    NProgress.done(force);
  }
};
