<script lang="ts">
import { h, reactive, ref } from "vue";
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
      console.log(root.value);
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
          ref: root,
          id: "renderCom",
        },
        [count.value, object.foo]
      );
  },
};
</script>