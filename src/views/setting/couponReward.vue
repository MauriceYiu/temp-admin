<template>
  <div id="couponReward">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="签到奖励" name="first">
        <sign ref="sign"></sign>
      </el-tab-pane>
      <el-tab-pane label="注册奖励" name="second">
        <register ref="register"></register>
      </el-tab-pane>
      <el-tab-pane label="业务员发放" name="third">
        <salesmanIssue ref="salesmanIssue"></salesmanIssue>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import sign from "./components/sign"; // base on element-ui
  import register from "./components/register"; // base on element-ui
  import salesmanIssue from "./components/salesmanIssue"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "couponReward",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      sign,
      register,
      salesmanIssue,
    },
    data() {
      return {
        activeName: 'first',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName);
        sessionStorage.setItem('activeNameCoupon', this.activeName)
        this.getList();
      },
      getList() {
        switch (this.activeName) {
          case "first":
            this.$refs.sign.getList();
            break;
          case "second":
            this.$refs.register.getList();
            break;
          case "third":
            this.$refs.salesmanIssue.getList();
            break;
        }
      },
    },
    mounted() {
      console.log(sessionStorage.getItem('activeNameCoupon'));
      if (sessionStorage.getItem('activeNameCoupon')) {
        this.activeName = sessionStorage.getItem('activeNameCoupon')
      }
      this.getList()
    }
  };
</script>

<style>
</style>
<style lang="scss" scoped>
  #couponReward {
    padding: 15px 30px;



  }
</style>
