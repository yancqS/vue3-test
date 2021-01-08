# Vue3 one piece

## 前言

Vue3发布有一段时间啦，也一直在关注Vue3带来的新特性，也在看不少业界大佬分享的一些文章。时逢元旦，正所谓“新年新气象”，新的一年，我也决定系统的学习一下新版本的Vue——Vue3。本文打算主要学习一下Vue3的主要的新特性—— **Composition API**。

>讲真的，我超喜欢one piece这个版本名字。

## 初始化项目

1. 安装vue-cli

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

2. 创建项目

```
vue create vue3-test
```

3. 配置如下

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210102141931.png)

## setup

setup函数是一个**新的组件选项**，作为在组件内使用 Composition API 的入口点。

>所谓组件选项即 诸如：data, methods, directives, watch, computed, mounted, props, name,  filters(3.0已删除)等等~~

- 调用时机

    创建组件实例，然后初始化`props`，紧接着就调用`setup`函数。从生命周期钩子的视角来看，它会在`beforeCreate`钩子之前被调用。
    
- 模板中使用

    如果`setup`返回一个对象，则对象的属性将会被**合并到组件模板的渲染上下文**：
    
```html {7,21-31}
/* Home.vue */
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <p>
      {{count}}-{{foo.bar}}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'; //tree shaking
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const count = ref(0);
    const foo = reactive({
      bar: 'zero'
    })
    //暴露给模板
    return {
      count,
      foo
    }
  }
});
</script>
```

>注意`setup`返回的ref在模板中会自动解开，**不**需要写`.value`。

- 在渲染函数/JSX中使用

`setup`也可以返回一个函数，函数中也能使用当前作用域中的响应式数据：

新建了一个`render.vue`

>里面用到的渲染函数的部分写法与vue2.x有些不同，后续会总结

```html
/* render.vue */
<script lang="ts">
import { h, reactive, ref } from "vue";
interface Object {
  foo: string | number;
}
export default {
  setup() {
    const count = ref(0);
    const object: Object = reactive({
      foo: "bar",
    });

    const plusOne = (): void => {
        count.value++;
    }

    return () => h('div', {
        style: {
            color: 'red',
            fontSize: '20px',
        },
        onClick: plusOne,
        id: 'renderCom'
    }, [count.value, object.foo])
  },
};
</script>
```

在`Home.vue`中引入

```diff
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <p>
      {{count}}-{{foo.bar}}
    </p>
+   <render />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
+ import render from '@/components/render.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
+   render
  },
  setup() {
    const count = ref(0);
    const foo = reactive({
      bar: 'zero'
    })
    return {
      count,
      foo
    }
  }
});
</script>
```

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20210104190617.gif)

- 参数

该函数接受`props`作为其第一个参数:

```html {8,11}
/* HelloWorld.vue */
...
<script lang="ts">
import { defineComponent, onMounted, watchEffect } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props) {
    onMounted(() => {
      console.log('mounted hook trriger');
      console.log(props.msg);
    })
  }
});
</script>
...
```

注意：`props`对象是响应式的，`watchEffect`或`watch`会观察和响应`props`的更新。

```diff
/* HelloWorld.vue */
...
<script lang="ts">
import { defineComponent, onMounted, watchEffect } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props) {
    onMounted(() => {
      console.log('mounted hook trriger');
      console.log(props.msg);
    })

+   watchEffect(() => {
+     console.log(`msg is ${props.msg}`)
+   })
  }
});
</script>
...
```

同时在`Home.vue`中改变传入`HelloWorld.vue`的msg值：

```html {4,28-31,35}
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld @click="reverse" :msg="msg"/>
    <p>
      {{count}}-{{foo.bar}}
    </p>
    <render />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import render from '@/components/render.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    render
  },
  setup() {
    const count = ref(0);
    const foo = reactive({
      bar: 'zero'
    });
    const msg = ref('Welcome to Your Vue.js + TypeScript App');
    const reverse = (): void => {
      msg.value = msg.value.split('').reverse().join('');
    }
    return {
      count,
      foo,
      reverse
    }
  }
});
</script>
```

然而**不要**解构`props`对象，那样会使其失去响应性：

```html
/* HelloWorld.vue */
...
<script lang="ts">
import { defineComponent, onMounted, watchEffect } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup({ msg }) {
    onMounted(() => {
      console.log('mounted hook trriger');
      console.log(msg);
    })

    watchEffect(() => {
      console.log(`msg is ${msg}`) // Will not be reactive
    })
  }
});
</script>
...
```

在开发过程中，props 对象对用户空间代码是**不可变**的（用户代码尝试修改 props 时会触发警告）。

第二个参数提供了一个上下文对象，从原来2.x中`this`选择性地暴露了一些property。

```html {15}
/* HelloWorld.vue */
...
<script lang="ts">
import { defineComponent, onMounted, watchEffect } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props, ctx) {
    onMounted(() => {
      console.log('mounted hook trriger');
      console.log(props.msg);
      console.log(ctx); //打印结果如下图
    })

    watchEffect(() => {
      console.log(`msg is ${props.msg}`)
    })
  }
});
</script>
...
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210104225632.png)

`attrs`和`slots`都是都是内部组件实例上对应项的代理(Proxy)，可以确保在更新后仍然是最新值。所以可以解构，无需担心后面访问到过期的值：

```js {7,11-12}
/* HelloWorld.vue */
...
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props, { attrs, slots }) {
    onMounted(() => {
      console.log('mounted hook trriger');
      console.log(props.msg);
      console.log(attrs);
      console.log(slots);
    })
  }
});
...
```

## 响应式系统API

### reactive

接受一个**普通对象**然后返回该普通对象的响应式**代理(Proxy)**。等同于2.x的`Vue.observable()`

```js
/* Home.vue */
...
const foo = reactive({ bar: 'zero' });
...
```

响应式转换是“深层的”：会影响对象内部所有嵌套的属性。基于 ES2015 的 Proxy 实现，返回的代理对象不等于原始对象。建议仅使用代理对象而避免依赖原始对象。

### ref

接受一个参数值并**返回**一个响应式且可改变的**ref对象**。ref对象拥有一个指向内部值的单一属性`.value`。

```js
const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

如果传入 ref 的是一个对象，将调用 `reactive` 方法进行深层响应转换。

- 模板中访问

当 ref 作为渲染上下文的属性返回（即在setup() 返回的对象中）并在模板中使用时，它会自动解套，无需在模板内额外书写 `.value`：

```html
<template>
    <div>{{count}}</div>
</template>
<script>
    export default {
        setup() {
            return {
                count: ref(0)
            }
        }
    }
</script>
```

- 作为响应式对象的属性访问

当ref作为reactive对象的property被**访问**或**修改**时,也会自动解套value值，其行为类似普通属性。

```diff
/* Home.vue */
...
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import render from "@/components/render.vue";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
    render,
  },
  setup() {
    const count = ref(0);
+   const age = ref(18);
    const msg = ref("Welcome to Your Vue.js + TypeScript App");
    const foo = reactive({
      bar: "zero",
    });

    //如果传入 ref 的是一个对象，将调用 reactive 方法进行深层响应转换。
    const obj = ref({
      a: 3,
    });

    const person = reactive({
      name: "yan",
+     age,
    });
    const handlerClick = (): void => {
      obj.value.a++;
      count.value += 3;
+     person.age++;
    };
    const reverse = () => {
      msg.value = msg.value.split("").reverse().join("");
    };
    return {
      count,
      foo,
      msg,
      handlerClick,
      reverse,
      obj,
      person
    };
  },
});
</script>
...
```

注意当嵌套在 reactive `Object` 中时，ref 才会解套。从 `Array` 或者 `Map` 等原生集合类中访问 ref 时，不会自动解套：

```js
const arr = reactive([ref(0)]);
//这里需要 .value
console.log(arr[0].value);

const map = reactive(new Map([['foo', ref(0)]]))
//这里与需要 .value
console.log(map.get('foo').value);
```

有时我们可能需要为 ref 做一个较为复杂的类型标注。我们可以通过在调用 `ref` 时传递泛型参数来覆盖默认推导：

```ts
const foo = ref<string | number>('123');

foo.value = 123; // 能够通过
```

### computed

传入一个getter函数，返回一个默认**不可手动修改的ref对象**。

```diff
/* HelloWorld.vue */
<template>
    <div class="hello">
        <h1>{{ msg }} && {{plusCount}}</h1>
    </div>
    ...
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watchEffect } from "vue";

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props, ctx) {
+   const count = ref(0);
+   const plusCount = computed(() => count.value+1)
    onMounted(() => {
      console.log('mounted hook trriger');
      console.log(props.msg);
      console.log(ctx);
+     setInterval(() => {
+       count.value++;
+     }, 1000)
    })

    watchEffect(() => {
      console.log(`msg is ${props.msg}`)
    })
    
+   return {
+     plusCount
+   }
  }
});
</script>
```

或者传入一个拥有`get`和`set`函数的对象，创建一个**可手动修改的计算状态**。

```js
const count = ref(0);
const plusCount = computed({
    get: () => count.value + 1,
    set: (val) => {
        count.value = val - 1;
    }
})
```

### readonly

传入一个对象（响应式或普通）或 ref，返回一个原始对象的只读代理。一个只读的代理是“深层的”，对象内部任何嵌套的属性也都是只读的。

```diff
/* HelloWorld.vue */
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, readonly, ref, watchEffect } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup(props, ctx) {
    const count = ref(0);
    const plusCount = computed(() => count.value+1)
+   const origin = reactive({
+     countStart: 0
+   })
    const copy = readonly(origin);
    onMounted(() => {
      console.log("mounted hook trriger");
      console.log(props.msg);
      console.log(ctx);
      setInterval(() => {
-       count.value++;
+       origin.countStart++
      }, 1000)
    });

    watchEffect(() => {
      console.log(`msg is ${props.msg}`);
    });
+   watchEffect(() => {
+     console.log(`copy.countStart: ${copy.countStart}`);
+   })
    return {
      plusCount
    }
  },
});
</script>
```

>如果尝试修改只读属性：copy.value++, 此行为会被阻止并且抛出警告。

### watchEffect

立即执行一个传入函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。

>参考上面代码:point_up_2:

#### 停止侦听

当 `watchEffect` 在组件的 `setup()` 函数或生命周期钩子被调用时， 侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下，也可以显式调用返回值以停止侦听：

```diff
/* HelloWorld.vue */
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, readonly, ref, watchEffect } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup(props, ctx) {
    const count = ref(0);
    const plusCount = computed(() => count.value+1)
    const origin = reactive({
      countStart: 0
    })
    const copy = readonly(origin);
    onMounted(() => {
      console.log("mounted hook trriger");
      console.log(props.msg);
      console.log(ctx);
      setInterval(() => {
        origin.countStart++;
+       if(origin.countStart > 5) stop();
      }, 1000)
    });

    watchEffect(() => {
      console.log(`msg is ${props.msg}`);
    });
+   const stop = watchEffect(() => {
      console.log(`copy.countStart: ${copy.countStart}`);
    })
    return {
      plusCount
    }
  },
});
</script>
```

#### 清除副作用

有时副作用函数会执行一些异步的副作用, 这些响应需要在其失效时清除（**即完成之前状态已改变了**）。

所以侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作入参, 用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发:

- 副作用即将重新执行时
- 侦听器被停止 (如果在 `setup()` 或 生命周期钩子函数中使用了 `watchEffect`, 则在卸载组件时)

```js {3-5}
const stop = watchEffect((onInvalidate) => {
    console.log(`copy.countStart: ${copy.countStart}`);
    onInvalidate(() => {
        console.log('onInvalidate');
    })
})
```

官方示例：

```js
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id 改变时 或 停止侦听时
    // 取消之前的异步操作
    token.cancel()
  })
})
```

#### 副作用刷新时机

Vue 的响应式系统会缓存副作用函数，并异步地刷新它们，这样可以避免同一个 tick 中多个状态改变导致的不必要的重复调用。在核心的具体实现中, 组件的更新函数也是一个被侦听的副作用。当一个用户定义的副作用函数进入队列时, 会在所有的**组件更新后**执行：

```html
<template>
  <div>{{ count }}</div>
</template>

<script>
  export default {
    setup() {
      const count = ref(0)

      watchEffect(() => {
        console.log(count.value)
      })

      return {
        count,
      }
    },
  }
</script>
```

在这个例子中：

- `count`会在初始化时同步打印出来
- 更改`count`时，将在组件**更新后**执行副作用

请注意，初始化运行是在组件 `mounted` 之前执行的。因此，如果你希望在编写副作用函数时访问 DOM（或模板 ref），请在 `onMounted` 钩子中进行：

```js
onMounted(() => {
  watchEffect(() => {
    // 在这里可以访问到 DOM 或者 template refs
  })
})
```

如果副作用需要同步或在组件更新之前重新运行，我们可以传递一个拥有 `flush` 属性的对象作为选项（默认为 `'post'`）：

```js {7,17}
// 同步运行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'sync',
  }
)

// 组件更新前执行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'pre',
  }
)
```

#### 侦听器调试

`onTrack`和`onTrigger`选项可用于调试一个侦听器的行为。

- 当一个reactive对象或者一个ref作为依赖被追踪时，将调用`onTrack`
- 依赖项变更导致副作用被触发时，将调用`onTrigger`

```js
watchEffect(
  () => {
    /* 副作用的内容 */
  },
  {
    flush: 'post',
    onTrack(e) {
      /* code */  
    },
    onTrigger(e) {
      debugger
    },
  }
)
```

>`onTrack`和`onTrigger`仅在开发模式下生效。

### watch

`watch`API完全等效于2.x `this.$watch` (以及`watch`中相应的选项)。`watch`需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说尽在侦听的源变更时才执行回调。

- 对比`watchEffect`，`watch`允许我们：
    - 懒执行副作用；
    - 更明确哪些状态的改变会触发侦听器重新运行副作用；
    - 访问侦听状态变化前后的值

- 侦听单个数据源

侦听器的数据源可以是一个拥有返回值的getter函数，也可以是ref：

```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听一个 ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

- 侦听多个数据源

`watcher`也可以使用**数组**来同时侦听多个源：

```js {15,17-19,26-37}
/* Home.vue */
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import render from "@/components/render.vue";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
    render,
  },
  setup() {
    const count = ref(0);
    const age = ref(18);
    const msg = ref("Welcome to Your Vue.js + TypeScript App");
    const foo = reactive({
      bar: "zero",
    });

    //如果传入 ref 的是一个对象，将调用 reactive 方法进行深层响应转换。
    const obj = ref({
      a: 3,
    });

    // watch(age, (age, olgAge) => {
    //   console.log(age, olgAge);
    // })

    // watch(() => foo.bar, (val, oldVal) => {
    //   console.log(val, oldVal);
    // })

    watch([age, () => foo.bar], ([age, val], [oldAge, oldVal]) => {
      console.log(age, oldAge);
      console.log(val, oldVal);
    })

    const person = reactive({
      name: "yan",
      age,
    });
    const handlerClick = (): void => {
      obj.value.a++;
      count.value += 3;
      person.age++;
      foo.bar += 'o';
    };
    const reverse = () => {
      msg.value = msg.value.split("").reverse().join("");
    };
    return {
      count,
      foo,
      msg,
      handlerClick,
      reverse,
      obj,
      person
    };
  },
});
</script>
```

- 与watchEffect共享的行为

watch 和 watchEffect 在`停止侦听`, `清除副作用` (相应地 onInvalidate 会作为回调的第三个参数传入)，`副作用刷新时机` 和 `侦听器调试` 等方面行为一致.

## 声明周期钩子函数

在`runtime-core.d.ts`声明文件中可以找到如下声明：

```ts
export declare function onActivated(hook: Function, target?: ComponentInternalInstance | null): void;

export declare const onBeforeMount: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare const onBeforeUnmount: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare const onBeforeUpdate: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare function onDeactivated(hook: Function, target?: ComponentInternalInstance | null): void;

export declare const onErrorCaptured: (hook: ErrorCapturedHook, target?: ComponentInternalInstance | null) => void;

export declare const onMounted: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare const onRenderTracked: (hook: DebuggerHook, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare const onRenderTriggered: (hook: DebuggerHook, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare const onUnmounted: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function | undefined;

export declare const onUpdated: (hook: () => any, target?: ComponentInternalInstance | null) => false | Function | undefined;
```

可以直接导入`onXXX`一族的函数来注册生命周期钩子。这些声明周期钩子注册函数只能在`setup()`期间同步使用。

- 与2.x版本声明周期相对应的组合式API
    - ~~`beforeCreate`~~ -> 使用`setup()`
    - ~~`created`~~ -> 使用`setup()`
    - `beforeMount` -> `onBeforeMount`
    - `mounted` -> `onMounted`
    - `beforeUpdate` -> `onBeforeUpdate`
    - `updated` -> `onUpdated`
    - `beforeDestroy` -> `onBeforeUnmount`
    - `destroyed` -> `onUnmounted`
    - `errorCaptured` -> `onErrorCaptured`
    - `activated` -> `onActivated` (keep-alive)
    - `deactivated` -> `onDeactivated` (keep-alive)

- 新增的钩子函数

    除了和 2.x 生命周期等效项之外，组合式 API 还提供了以下调试钩子函数：

    - onRenderTracked
    - onRenderTriggered
    
    两个钩子函数都接收一个 `DebuggerEvent`，与 `watchEffect` 参数选项中的 `onTrack` 和 `onTrigger` 类似：
    
    ```js
    export default {
        setup() {
            onRenderTriggered(e) {
                debugger
                // 检查哪个依赖性导致组件重新渲染
            }
        }
    }
    ```
## 依赖注入

`provide` 和 `inject` 提供依赖注入，功能类似2.x的`provide/inject`。两者都只能在当前活动组件示例的 `setup()` 中调用。

```js
/* Home.vue */
import { provide } from 'vue';
setup() {
    const theme = Symbol.for('theme');
    provide(theme, 'dark');
}

/* HelloWorld.vue */
import { inject } from 'vue';
setup() {
    const theme = Symbol.for('theme');
    const themeinfo = inject(theme, 'light');
    
    return {
        themeinfo
    }
}
```

`inject` 接受一个可选的的默认值作为第二个参数。如果未提供默认值，并且在 `provide` 上下文中未找到该属性，则 `inject` 返回 `undefined`。

## 模板Refs

当使用组合式 API 时，reactive refs 和 template refs 的概念已经是统一的。为了获得对模板内元素或组件实例的引用，我们可以像往常一样在 `setup()` 中声明一个 ref 并返回它：

```diff
/* Home.vue */
<template>
  <div class="home">
+   <img ref="img" alt="Vue logo" src="../assets/logo.png" />
    ...
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
    render,
  },
  setup() {
    ...
+   const img = ref(null);
    ...
    const handlerClick = (): void => {
+     console.log(img.value); // <img />
    };
    return {
      img,
      ...
    };
  },
});
</script>
```

这里我们将 `img` 暴露在渲染上下文中，并通过 `ref="img"` 绑定到 `img` 作为其 ref。 在 Virtual DOM patch 算法中，如果一个 VNode 的 `ref` 对应一个渲染上下文中的 ref，则该 VNode 对应的元素或组件实例将被分配给该 ref。

- 配合 render 函数 / JSX 的用法

```diff
/* render.vue */
<script lang="ts">
+ import { h, reactive, ref } from "vue";
interface Object {
  foo: string | number;
}
export default {
  setup() {
    const count = ref(0);
    const root = ref(null);
    const object: Object = reactive({
      foo: "bar",
    });

    const plusOne = (): void => {
      count.value++;
+     console.log(root.value);
    };

    return () =>
      h(
        "div",
        {
          style: {
            color: "red",
            fontSize: "20px",
          },
          onClick: plusOne,
+         ref: root,
          id: "renderCom",
        },
        [count.value, object.foo]
      );
  },
};
</script>
```

- 在v-for中使用

模板 ref 在 v-for 中使用 vue 没有做特殊处理，需要使用**函数型**的 ref（3.0 提供的新功能）来自定义处理方式：

```html {2}
<template>
  <div v-for="(item, i) in list" :ref="el => { divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // 确保在每次变更之前重置引用
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs,
      }
    },
  }
</script>
```

## 响应式工具集

### unref

如果参数是一个 ref 则返回它的 value，否则返回参数本身。它是 val = isRef(val) ? val.value : val 的语法糖。

```js
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped 一定是 number 类型
}
```

### toRef

`toRef` 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

```js
const state = reactive({
  foo: 1,
  bar: 2,
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

当您要将一个prop中的属性作为ref传给组合逻辑函数时, `toRef`就派上了用场：

>注意：在开发过程中，props 对象对用户空间代码是不可变的。

```js
/* HelloWorld.vue */
import { Ref, ref, toRef } from "vue";

setup(props, ctx) {
    const toRef_test = ref<null | string>(null);
    const changePropMsg = (propValue: Ref) => {
      toRef_test.value = propValue.value + 'dddd';
    }
    
    changePropMsg(toRef(props, 'msg'));
    
    return {
        toRef_test
    }
}
```

`toRef`源码实现如下：

>注释是我加的

```js
class ObjectRefImpl {
    constructor(_object, _key) {
        this._object = _object; //浅拷贝
        this._key = _key;
        this.__v_isRef = true;
    }
    get value() {
        return this._object[this._key];
    }
    set value(newVal) {
        this._object[this._key] = newVal;
    }
}
function toRef(object, key) {
    return isRef(object[key])
        ? object[key]
        : new ObjectRefImpl(object, key);
}
```

### toRefs

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。

```js
const state = reactive({
  foo: 1,
  bar: 2,
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型如下:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 对象 与 原属性的引用是 "链接" 上的
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当想要从一个组合逻辑函数中返回响应式对象时，用 `toRefs` 是很有效的，该 API 让消费组件可以 解构 / 扩展（使用 `...` 操作符）返回的对象，并不会丢失响应性：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  })

  // 对 state 的逻辑操作

  // 返回时将属性都转为 ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以解构，不会丢失响应性
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar,
    }
  },
}
```

`toRefs`源码实现如下：

```js
function toRefs(object) {
    if ( !isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = shared.isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
```

### isRef

检查一个值是否为一个 ref 对象。

### isProxy

检查一个对象是否是由 `reactive` 或者 `readonly`方法创建的代理。

### isReactive

检查一个对象是否是由 `reactive` 创建的响应式代理。

如果这个代理是由 `readonly` 创建的，但是又被 `reactive` 创建的另一个代理包裹了一层，那么同样也会返回 true。

### isReadonly

检查一个对象是否是由 `readonly` 创建的只读代理。

## 高级响应式系统API

### customRef

`customRef`用于自定义一个 `ref`，**可以显式地控制依赖追踪和触发响应**，接受一个工厂函数，两个参数分别是用于追踪的 `track` 与用于触发响应的 `trigger`，并返回一个带有 `get` 和 `set` 属性的对象。

- 使用自定义的ref实现带防抖功能的`v-model`:

```html
<input v-model="text" />
```

```js
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}

export default {
  setup() {
    return {
      text: useDebouncedRef('hello'),
    }
  },
}
```

源码实现如下：

```js
class CustomRefImpl {
    constructor(factory) {
        this.__v_isRef = true;
        //track和trigger是内部实现的方法
        const { get, set } = factory(() => track(this, "get" /* GET */, 'value'), () => trigger(this, "set" /* SET */, 'value'));
        this._get = get;
        this._set = set;
    }
    get value() {
        return this._get();
    }
    set value(newVal) {
        this._set(newVal);
    }
}
function customRef(factory) {
    return new CustomRefImpl(factory);
}
```

以上面例子为例，调用`useDebouncedRef()`函数，其实最终返回的是`CustomRefImpl`的一个实例对象；当获取text的值时，会触发get value()方法，进而执行this._get()方法，这个this._get()方法就是工厂函数返回的get()。在get()方法中调用了track()，也就是`() => track(this, "get" /* GET */, 'value')`。

>set同理

### markRaw

显式标记一个对象为“永远不会转为响应式代理”，函数返回这个对象本身。

### toRaw

返回由 `reactive` 或 `readonly` 方法转换成响应式代理的普通对象。这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发更改。不建议一直持有原始对象的引用。请谨慎使用。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## 最后

参照Vue组合式API的官网，里面的大多数api都测试了一下。我感觉里面出现次数最多的两个字就是`代理`，也就是`Proxy`, 可以看出 Vue3 利用 ES6 中的 Proxy 解决了Vue2的一些问题，比如对象新增属性的追踪。(Vue2中利用this.$set()来解决的)

>Vue2通过Object.defineProperty来将对象的key转换成getter/setter的形式来追踪变化，但是getter/setter只能追踪一个数据是否被修改，无法追踪新增属性和删除属性。

>Object.defineProperty是一个相对比较昂贵的操作，因为它直接操作对象的属性，颗粒度比较小。将它替换为es6的Proxy，在目标对象之上架了一层拦截，代理的是对象而不是对象的属性。这样可以将原本对对象属性的操作变为对整个对象的操作，颗粒度变大。

其次，组合式api非常的灵活，可以单独写在一个函数里面，提高复用性。

还有Vue3对TS的支持真的超级好，类型推导也很棒

还有Tree shaking的支持，用什么引什么，打包体积更小

## 参考文章/资源

- [Vue组合式API](https://composition-api.vuejs.org/zh/api.html)
- [Vue3中文官网](https://v3.cn.vuejs.org/api/application-api.html)