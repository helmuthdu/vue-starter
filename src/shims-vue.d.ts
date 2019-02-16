declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.json' {
  const json: any;
  export default json;
}

declare module 'kaop';
