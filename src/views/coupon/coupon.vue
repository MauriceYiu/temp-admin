<template>
  <div class="banner">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="优惠券" name="couponChild">
        <couponChild ref="couponChild"></couponChild>
      </el-tab-pane>
      <el-tab-pane label="发放优惠券" name="issueCoupon">
        <issueCoupon ref="issueCoupon"></issueCoupon>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="activeName==='couponChild'">添加优惠券</div>
    <div class="newAdd" @click="addTag" v-if="activeName==='issueCoupon'">发放优惠券</div>

  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import couponChild from "./components/couponChild";  //子组件
  import issueCoupon from "./components/issueCoupon";  //子组件
  // import questions from "./components/questions"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "banner",
    directives: {
      waves,
    },
    components: {
      couponChild,
      issueCoupon,
    },

    data() {
      return {
        activeName: 'home',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName);
        sessionStorage.setItem('activeBannerName', this.activeName)
        this.getList();
      },
      addTag() {
        switch (this.activeName) {
          case "couponChild":
            this.$router.push({
              name: "couponChildDetail", params: {
                id: 0
              }
            })
            break;
          case "issueCoupon":
            this.$router.push({
              name: "issueCouponDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeName) {
          case "couponChild":
            this.$refs.couponChild.getList();
            break;
          case "issueCoupon":
            this.$refs.issueCoupon.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeBannerName')) {
        this.activeName = sessionStorage.getItem('activeBannerName')
      }else {
        this.activeName = "couponChild"
      }
      console.log(this.activeName, "activeBannerName");
      this.getList()
    }
  };
</script>
<style>
  .banner .el-tabs__nav {
    margin-left: 22px;
  }

  .banner .el-tabs__nav-wrap::after {
    background: none;
  }

  .banner .el-tabs__header {
    margin: 0;
  }

  .banner .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
</style>
<style lang="scss" scoped>
  .banner {
    position: relative;
    .newAdd {
      position: absolute;
      right: 58px;
      top: 10px;
      color: #F65860;
      font-size: 14px;
      cursor: pointer;
    }
  }
</style>
