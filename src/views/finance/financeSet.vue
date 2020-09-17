<template>
  <div class="financeSet">
    <el-tabs v-model="activeNamefinanceSet" @tab-click="handleClick">
      <!--<el-tab-pane label="财务审核" name="financeCheck">
        <financeCheck ref="rewardChild"></financeCheck>
      </el-tab-pane>-->
      <el-tab-pane label="提成设置" name="awardSet">
        <awardSet ref="awardSet"></awardSet>
      </el-tab-pane>
      <!--<el-tab-pane label="其他设置" name="historyReward">-->
        <!--<historyReward ref="historyReward"></historyReward>-->
      <!--</el-tab-pane>-->
    </el-tabs>



  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import financeCheck from "./components/financeCheck";  //子组件
  import awardSet from "./components/awardSet";  //子组件
  // import historyReward from "./components/historyReward";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "financeSet",
    directives: {
      waves,
    },
    components: {
      financeCheck,
      awardSet,
    },

    data() {
      return {
        activeNamefinanceSet: 'awardSet',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNamefinanceSet);
        sessionStorage.setItem('activeNamefinanceSet', this.activeNamefinanceSet)
        this.getList();
      },
      addTag() {
        this.$router.push({
          name: "pushDetail", params: {
            id: 0
          }
        })
      },
      getList() {
        switch (this.activeNamefinanceSet) {
          case "financeCheck":
            this.$refs.rewardChild.getList();
            break;
          case "awardSet":
            this.$refs.awardSet.initData();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNamefinanceSet')) {
        this.activeNamefinanceSet = sessionStorage.getItem('activeNamefinanceSet')
      } else {
        this.activeNamefinanceSet = "financeCheck"
      }
      console.log(this.activeNamefinanceSet, "activeNamefinanceSet");
      this.getList()
    }
  };
</script>
<style>
  .financeSet .el-tabs__nav {
    margin-left: 40px;
  }

  .financeSet .el-tabs__nav-wrap::after {
    background: none;
  }

  .financeSet .el-tabs__header {
    margin: 0;
  }

  .financeSet .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .financeSet {
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
