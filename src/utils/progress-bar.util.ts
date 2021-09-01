import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const delay = 500; // in milliseconds
let timer: any;
let counter = 0;

const start = () => {
  timer = setTimeout(() => {
    NProgress.start();
  }, delay);
};

const done = () => {
  clearTimeout(timer);
  NProgress.done();
};

export const showProgressBar = () => {
  if (counter === 0) {
    start();
  } else if (NProgress.isStarted()) {
    NProgress.inc();
  }
  counter++;
};

export const hideProgressBar = (force?: boolean) => {
  counter--;
  if (counter < 0 || force) {
    counter = 0;
  }
  if (counter === 0 || force) {
    done();
  }
};
