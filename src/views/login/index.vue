<template>
  <div class="login-container">
    <div class="left">
      <img src="../../assets/loginImg.jpg" alt="">
      <div class="centerR">R</div>
    </div>
    <div class="right">

      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
               label-position="left">

        <div class="title-container">
          <h3 class="title">融WORK</h3>
          <h5 class="subTitle">welcome!</h5>
        </div>

        <el-form-item prop="username" class="username">
          <span class="svg-container">
          <svg-icon icon-class="user"/>
          </span>
          <el-input
            class="inputK"
            ref="username"
            v-model="loginForm.username"
            placeholder="输入工号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />

        </el-form-item>

        <el-form-item prop="password" class="username password">
          <span class="svg-container">
          <svg-icon icon-class="password"/>
          </span>
          <el-input
            class="inputK"
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
        </el-form-item>

        <el-button class="loginBtn" :loading="loading" type="primary" style="margin-bottom:30px;"
                   @click.native.prevent="handleLogin">登录
        </el-button>
      </el-form>

    </div>
  </div>
</template>

<script>
  import {validUsername} from '@/utils/validate'

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('请输入用户账户'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入登录密码'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          app: 'staff',
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, message: '请输入用户账户', trigger: 'blur'}],
          password: [{required: true, message: '请输入登录密码', trigger: 'blur'},
            {min: 6, max: 20, message: '请输入6到20位的登录密码 ', trigger: 'blur'}]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // console.log(this.loginForm);
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              console.log("login");
              this.$store.dispatch('user/getInfo').then(() => {
                console.log("getInfo");
                window.location.reload();
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  body, html {
    margin: 0;
    height: 100%;
  }

  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  /* reset element-ui css */
  .login-container {

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px white inset;
    }
    input {
      border: none;
      background: white;
      text-align: center;
    }
    .el-input__inner, .el-checkbox__inner, .el-textarea__inner, .el-button {
      border-radius: 0;
      background: white;
    }
    .el-input__inner {
      background-color: white;
    }
    .el-button--primary {
      border-color: #666666;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
    overflow: hidden;
    display: flex;
    .left {
      width: 60%;
      height: 100%;
      /*border: 1px solid red;*/
      display: flex;
      align-items: center;
      justify-content: center;
      /*background: url(../../assets/loginImg.jpg) no-repeat center;*/
      img {
        width: 96%;
        height: 96%;

      }
      .centerR {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100px;
        height: 100px;
        background: #5bc0df;
        border-radius: 50%;

        font-size: 65px;
        color: white;

      }
    }
    .right {
      /*border: 1px solid yellow;*/
      width: 40%;
      display: flex;
      flex-grow: 1;
      align-items: center;
    }

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 0 35px 100px;
      margin: 0 auto;
      overflow: hidden;
      /*border: 1px solid red;*/
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .el-form-item__content {
      display: flex;
      position: relative;
    }
    .svg-container {
      position: absolute;
      left:0;
      top:0;
      /*border: 1px solid red;*/
      padding: 6px 5px 6px 20px;
      color: $dark_gray;
      vertical-align: middle;
      width: 50px;
      display: inline-block;
      z-index: 999;
    }

    .title-container {
      position: relative;
      margin-bottom: 140px;

      .title {
        font-size: 40px;
        color: #333333;
        margin: 0 auto 10px;
        text-align: center;
        font-weight: bold;
      }
      .subTitle {
        font-size: 16px;
        color: #5bc0df;
        margin: 0 auto 50px;
        text-align: center;
        font-weight: bold;
        /*border: 1px solid red;*/
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .inputK {
      background: #ffffff;
      border-bottom: 1px solid #5bc0df;
    }
    .loginBtn {
      background: #5bc0df;
      border-radius: 20px;
      width: 100%;
      margin: 80px auto;
      border: none;
    }
  }
</style>
