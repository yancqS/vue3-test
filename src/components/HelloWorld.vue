<template>
  <div class="hello">
    <h1>{{ msg }} && {{plusCount}} && {{themeinfo}}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
    <div v-for="(item, index) in list" :key="item"
      :ref="el => { divs[index] = el }"
    >
      {{item+ '-' + index}}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onBeforeUpdate, onMounted, reactive, readonly, ref, watchEffect } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup(props, ctx) {
    const count = ref(0);
    const plusCount = computed(() => count.value+1)
    const origin = reactive({
      countStart: 0,
      time: 20
    })
    const copy = readonly(origin);
    const list = reactive([1,2,3]);
    const divs = ref([]);
    onBeforeUpdate(() => {
      divs.value = [];
    })
    onMounted(() => {
      console.log("mounted hook trriger");
      console.log(props.msg);
      console.log(ctx);
      console.log(divs.value[0]);
      setInterval(() => {
        // count.value++;
        origin.countStart++;
        if(origin.countStart > 3) stop();
      }, 1000)
    });

    const theme = Symbol.for('theme');

    const themeinfo = inject(theme, 'light');

    watchEffect(() => {
      console.log(`msg is ${props.msg}`);
    });
    const stop = watchEffect((onInvalidate) => {
      console.log(`copy.countStart: ${copy.countStart}`);
      onInvalidate(() => {
        console.log('onInvalidate');
      })
    }, {
      flush: 'post',
      onTrack(e) {
        console.log(e, 'track')
      },
      onTrigger(e) {
        console.log(e, 'trigger')
        console.log('==============')
      }
    })
    return {
      plusCount,
      themeinfo,
      list,
      divs
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
