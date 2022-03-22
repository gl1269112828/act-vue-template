<template>
  <div class="login-container">
    <el-form class="login-form" ref="form" :model="form" :rules="rules" label-width="0">
      <div class="login-title">
        ACT
        <!-- <span>v1.0</span> -->
      </div>
      <el-form-item prop="userName">
        <el-input v-model="form.userName" prefix-icon="el-icon-user" placeholder="请输入账号" @keyup.enter.native.prevent="submitForm()"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password @keyup.enter.native.prevent="submitForm()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%" type="primary" @click="submitForm()" v-loading="loading">登录</el-button>
      </el-form-item>
      <div class="login-explain">© 2021-2030 ACT v1.0</div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      form: {
        userName: '', //账号
        password: '' //密码
      },
      rules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('login/login', this.form)
            .then(() => {
              this.$notify.success({ title: '登录成功' });
              this.$router.push({ path: '/home' }).catch(() => {});
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  .login-title {
    padding: 30px 0;
    font-size: 26px;
    color: #666;
    font-weight: bold;
    text-align: center;
    span {
      font-size: 24px;
    }
  }
  .login-form {
    margin: 12% auto 0 auto;
    width: 24%;
    min-width: 250px;
    height: 250px;
  }
  .login-explain {
    padding-top: 20px;
    color: #666;
    font-size: 14px;
    text-align: center;
  }
}
</style>
