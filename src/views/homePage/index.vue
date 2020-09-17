<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎登录易答在线管理系统</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'homePage',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
      margin-top: 20%;
      text-align: center;
    }
  }
</style>
