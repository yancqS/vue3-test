<template>
  <div @click="sayBye">byebye</div>
</template>

<script lang="ts">
interface Foo {
  label: String;
  name?: Number;
}
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  name: "byeComponent",
  setup() {
    onMounted((): void => {
      console.log("hello");
    });

    const handleFun = (str: string): Foo => {
      return {
        label: str,
      };
    };

    const sayBye = (): void => {
      console.log(handleFun("byebye ttq"));
    };

    return {
      sayBye,
    };
  },
});
</script>