import { customRef, provide, reactive, ref, watch } from "vue";
function useDebounceRef(value: string | number, delay: number = 200) {
  let timeout: number | undefined;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue: string | number) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay)
      }
    }
  })
}
export default function setup_common() {
    const count = ref(0);
    const age = ref(18);
    const img = ref(null);
    const msg = ref("Welcome to Your Vue.js + TypeScript App");
    const foo = reactive({
      bar: "zero",
    });
    const text = useDebounceRef('hello yyy', 2000);

    const theme = Symbol.for("theme");
    provide(theme, "dark");

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
    });

    watch(text, (val) => {
      console.log(val);
    })

    const person = reactive({
      name: "yan",
      age,
    });
    const handlerClick = (): void => {
      obj.value.a++;
      count.value += 3;
      person.age++;
      foo.bar += "o";
      console.log(img.value);
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
      person,
      img,
      text
    };
}