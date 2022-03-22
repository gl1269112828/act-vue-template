<template>
  <div class="navbar-container">
    <div class="flex navbar-header ">
      <div class="navbar-fold">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="handleCollapse"></i>
      </div>
      <l-tagViews class="navbar-tagviews" />
      <div class="navbar-info">
        <el-dropdown :show-timeout="0">
          <span class="el-dropdown-link">
            欢迎您，{{ userInfo.userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <i class="el-icon-setting"></i>
              密码修改
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleLoginOut">
              <i class="el-icon-switch-button"></i>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import LTagViews from '@/components/LTagViews';
import { mapGetters } from 'vuex';
export default {
  components: {
    LTagViews
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
    };
  },
  methods: {
    handleCollapse() {
      this.$store.commit('setting/SET_COLLAPSE', !this.$store.getters.isCollapse);
    },
    handleLoginOut() {
      this.$store.dispatch('login/logout').then(() => {
        this.$router.push({ name: 'login' });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar-container {
  background-color: #fff;
  .navbar-header {
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    height: 60px;
    box-sizing: border-box;
    .navbar-fold {
      line-height: 60px;
      font-size: 24px;
      i {
        cursor: pointer;
      }
    }
    .navbar-tagviews {
      width: 85%;
    }
    .navbar-info {
      line-height: 60px;
    }
  }
}
</style>
