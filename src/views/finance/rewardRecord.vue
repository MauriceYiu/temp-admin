<template>
  <div class="push">
    <el-tabs v-model="activeNameReward" @tab-click="handleClick" v-if="hasPerm('financial:bestow:list')">
      <el-tab-pane label="当前打赏" name="rewardChild">
        <rewardChild ref="rewardChild"></rewardChild>
      </el-tab-pane>
      <el-tab-pane label="历史打赏" name="historyReward">
        <historyReward ref="historyReward"></historyReward>
      </el-tab-pane>
    </el-tabs>


    <div class="newAdd" @click="salaryExport" v-if="activeNameReward === 'rewardChild' && hasPerm('financial:bestow:export')">导出</div>


  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import rewardChild from "./components/rewardChild";  //子组件
  import historyReward from "./components/historyReward";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "push",
    directives: {
      waves,
    },
    components: {
      rewardChild,
      historyReward,
    },

    data() {
      return {
        activeNameReward: 'rewardChild',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameReward);
        sessionStorage.setItem('activeNameReward', this.activeNameReward)
        this.getList();
      },
      salaryExport() {
        let url ="http:"+ window.API_BASE_URI + "/api/v1" + '/salary/export?token='+ encodeURIComponent(getToken())+"&type=bestow";
        // console.log(url,"url");
        window.open(url, '_blank')
      },
      getList() {
        switch (this.activeNameReward) {
          case "rewardChild":
            this.$refs.rewardChild.getList();
            break;
          case "historyReward":
            this.$refs.historyReward.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameReward')) {
        this.activeNameReward = sessionStorage.getItem('activeNameReward')
      } else {
        this.activeNameReward = "rewardChild"
      }
      console.log(this.activeNameReward, "activeNameReward");
      this.getList()
    }
  };
</script>
<style>
  .push .el-tabs__nav {
    margin-left: 40px;
  }

  .push .el-tabs__nav-wrap::after {
    background: none;
  }

  .push .el-tabs__header {
    margin: 0;
  }

  .push .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .push {
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
