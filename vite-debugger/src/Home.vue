<template>
  <div class="index-wrapper">我是Home.vue</div>
  <index></index>
</template>
<script>
import Index from "./Index.vue";
export default {
  name: "Home",
  components:{Index},
  setup() {
    const indexData = "index Data";
    return {}
  }
}
</script>
<style scoped>
.index-wrapper {
  background-color: rebeccapurple;
}
</style>