<template>
  <div class="home">
    <img ref="img" alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld @click="reverse" :msg="msg" />
    <p @click="handlerClick">{{ count }}-{{ foo.bar }}-{{ obj.a }}</p>
    <p @click="addData_info">age: {{ person.age }} {{ data_info }}</p>
    <byeWorld />
    <render />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import byeWorld from "@/components/byeWorld.vue";
import render from "@/components/render.vue";

import commonSetup from "@/common/commom"


export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
    byeWorld,
    render,
  },
  data() {
    return {
      data_info: 10,
    };
  },
  methods: {
    addData_info() {
      this.data_info++;
    },
  },
  watch: {},
  computed: {},
  setup() {
    return commonSetup()
  },
});
</script>
