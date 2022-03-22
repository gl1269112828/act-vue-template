<template>
  <div class="app-main-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-main-container {
  height: calc(100vh - 68px);
  margin: 4px;
  padding: 5px;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
