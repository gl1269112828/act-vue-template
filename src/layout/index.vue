<template>
  <section class="flex layout-container">
    <sidebar></sidebar>
    <section class="layout-r">
      <navBar></navBar>
      <appMain></appMain>
    </section>
  </section>
</template>

<script>
import sidebar from './components/sidebar';
import appMain from './components/appMain';
import navBar from './components/navBar';
import siderbarStyObj from '@/styles/sidebarConfig.scss';
export default {
  name: 'layout',
  computed: {},
  components: {
    sidebar,
    navBar,
    appMain
  },
  data() {
    return {};
  },

  methods: {
    siderbarStyObj() {
      return siderbarStyObj;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/sidebarConfig.scss';
.layout-container {
  background-color: #f5f5f5;
  flex: auto;
  box-sizing: border-box;
  .layout-r {
    width: 100%;
    overflow: hidden;
  }
}
</style>
