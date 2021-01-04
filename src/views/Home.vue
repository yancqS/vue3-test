<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld @click="reverse" :msg="msg"/>
    <p @click="handlerClick">
      {{count}}-{{foo.bar}}
    </p>
    <byeWorld />
    <render />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import byeWorld from '@/components/byeWorld.vue';
import render from '@/components/render.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    byeWorld,
    render
  },
  setup() {
    const count = ref(0);
    const msg = ref('Welcome to Your Vue.js + TypeScript App');
    const foo = reactive({
      bar: 'zero'
    })
    const handlerClick = (): void => {
      console.log(count)
      count.value += 3;
    }
    const reverse = () => {
      msg.value = msg.value.split('').reverse().join('');
    }
    return {
      count,
      foo,
      msg,
      handlerClick,
      reverse
    }
  }
});
</script>
