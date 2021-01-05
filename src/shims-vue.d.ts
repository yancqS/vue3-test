declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare interface nameObj {
  name: string;
  age?: number;
}

/* id 是用户的id，可以是字符串也可以是数字*/
declare function getName(id: string | number): nameObj