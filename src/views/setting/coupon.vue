<template>
  <div class="coupon">

    <el-tabs v-model="activeNameCoupon" @tab-click="handleClick">
      <el-tab-pane label="优惠券" name="couponChild" v-if="hasPerm('settings:coupons:list')">
        <couponChild ref="couponChild"></couponChild>
      </el-tab-pane>
      <el-tab-pane label="发优惠券" name="issueCoupon" v-if="hasPerm('settings:coupons:sends')">
        <issueCoupon ref="issueCoupon"></issueCoupon>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="activeNameCoupon==='couponChild' && hasPerm('settings:coupons:list:add')">添加优惠券</div>
    <div class="newAdd" @click="addTag" v-if="activeNameCoupon==='issueCoupon'  && hasPerm('settings:coupons:sends:add')">发放优惠券</div>

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
    name: "coupon",
    directives: {
      waves,
    },
    components: {
      couponChild,
      issueCoupon,
    },

    data() {
      return {
        activeNameCoupon: 'home',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameCoupon);
        sessionStorage.setItem('activeNameCoupon', this.activeNameCoupon)
        this.getList();
      },
      addTag() {
        switch (this.activeNameCoupon) {
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
        switch (this.activeNameCoupon) {
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
      if (sessionStorage.getItem('activeNameCoupon')) {
        this.activeNameCoupon = sessionStorage.getItem('activeNameCoupon')
      }else {
        this.activeNameCoupon = "couponChild"
      }
      console.log(this.activeNameCoupon, "activeNameCoupon");
      this.getList()
    }
  };
</script>
<style>
  .coupon .el-tabs__nav {
    margin-left: 40px;
  }

  .coupon .el-tabs__nav-wrap::after {
    background: none;
  }

  .coupon .el-tabs__header {
    margin: 0;
  }

  .coupon .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .coupon {
    position: relative;
    min-height: calc(100vh - 60px);

    .newAdd {
      position: absolute;
      right: 27px;
      top: 10px;
      color: #F65860;
      font-size: 14px;
      cursor: pointer;
    }
  }
</style>
