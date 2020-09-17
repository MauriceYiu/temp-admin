<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="head">
          <div class="leftimg">
            <img v-if="logo" :src="logo" class="sidebar-logo">
          </div>
          <div class="right">
            <span class="zh">易答在线</span>
            <span class="en">YIRONGCAISHANG</span>
          </div>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Admin Template',
      logo: require('../../../assets/yiLogo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  /*background: #304156;*/
  background: #181A28;
  text-align: center;
  overflow: hidden;


  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    display:inline-flex;
    align-items: center;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 60px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
      border-radius:   50%;
    }
  }
  .head {
    /*border: 1px solid red;*/
    margin-top: 7px;
    font-size: 12px;
    color: white;
    display: flex;
    line-height: 14px;
    padding: 5px 20px ;
    .leftimg {
      width: 34px;
      height:  34px;
      border-radius:   50%;
      margin-right: 10px;
      img{
        width: 100%;
        height: 100%;
        border-radius:   50%;
      }

    }
    .right {
      /*flex-grow: 1;*/
      display: flex;
      flex-direction: column;
      white-space:nowrap;
      .zh{
        font-size: 14px;
      }
      .en{
        font-size: 10px;
        margin-top: 4px;
      }
    }
  }
}
</style>
