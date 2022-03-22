<template>
  <div class="sidebar-container">
    <div class="sidebar-logo-container"  :style="{ width: isCollapse ? '64px' : siderbarStyObj.menuWidth }">
      <img :src="require('@/assets/logo1.png')" />
    </div>
    <el-menu class="sidebar" mode="vertical" :collapse="isCollapse" :collapse-transition="false" :default-active="defaultActive" @select="handleSelect">
      <template v-for="(item, i) in menus">
        <el-submenu :index="menuIndex(item.path, item.id, item.key)" :key="i" v-if="item.children.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item :index="menuIndex(itemJ.path, itemJ.id, itemJ.key)" v-for="(itemJ, j) in item.children" :key="j">
              <i :class="itemJ.icon"></i>
              {{ itemJ.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="menuIndex(item.path, item.id, item.key)" :key="i" v-else>
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import siderbarStyObj from '@/styles/sidebarConfig.scss';
import { mapGetters } from 'vuex';
export default {
  name: 'sidebar',
  computed: {
    ...mapGetters(['isCollapse', 'menus']),
    menuIndex() {
      return (path, id, key) => {
        let menuPath;
        !!key ? (menuPath = `${path}?id=${id}&key=${key}`) : (menuPath = `${path}?id=${id}`);
        return menuPath;
      };
    }
  },
  data() {
    return {
      defaultActive: ''
    };
  },
  created() {
    this.getRouter();
  },
  watch: {
    $route() {
      this.getRouter();
    }
  },
  methods: {
    getRouter() {
      const route = this.$route;
      if (route.meta.title === '首页') {
        this.defaultActive = route.fullPath.substring(0, route.fullPath.length - 1);
      } else {
        this.defaultActive = route.fullPath;
      }
    },
    siderbarStyObj() {
      return siderbarStyObj;
    },
    handleSelect(index, indexPath) {
      const route = this.$route;
      if (index !== route.fullPath) {
        this.$router.push({ path: index });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/sidebarConfig.scss';
.sidebar-container {
  min-height: 100vh;
  .sidebar-logo-container {
    width: $menuWidth;
    line-height: 0px;
    background-color: #409eff;
    text-align: center;
    font-weight: bold;
    color: #ffffff;
  }
  .sidebar {
    height: calc(100vh - 60px);
    box-sizing: border-box;
  }
}
</style>
