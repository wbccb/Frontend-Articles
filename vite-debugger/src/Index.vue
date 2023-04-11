<template>
  <div class="index-wrapper">这是Index.vue{{test2}}</div>
</template>
<script>
import {test2Fn} from "./test1.js";
import {onMounted, ref} from "vue";
export default {
  name: "Index",
  setup() {
    const indexData = "index Data";
    const test2 = ref("");
    console.info("我是Index.vue", test2Fn());
    onMounted(()=> {
      test2.value = test2Fn();
    })
    return {
      test2
    }
  }
}
</script>
<style scoped>
.index-wrapper {
  background-color: rebeccapurple;
}
</style>