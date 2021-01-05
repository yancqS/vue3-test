<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld @click="reverse" :msg="msg" />
    <p @click="handlerClick">{{ count }}-{{ foo.bar }}-{{ obj.a }}</p>
    <p>age: {{person.age}}</p>
    <byeWorld />
    <render />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import byeWorld from "@/components/byeWorld.vue";
import render from "@/components/render.vue";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
    byeWorld,
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

    const person = reactive({
      name: "yan",
      age,
    });
    const handlerClick = (): void => {
      obj.value.a++;
      count.value += 3;
      person.age++;
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
