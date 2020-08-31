declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module '*.json' {
  const json: any;
  export default json;
}

declare module 'kaop';
