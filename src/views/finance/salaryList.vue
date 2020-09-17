<template>
  <div class="salaryList">
    <el-tabs v-model="activesalaryListName" @tab-click="handleClick">
      <el-tab-pane label="当前薪资" name="salaryChild">
        <salaryChild ref="salaryChild"></salaryChild>
      </el-tab-pane>
      <el-tab-pane label="历史薪资" name="historySalary">
        <historySalary ref="historySalary"></historySalary>
      </el-tab-pane>
    </el-tabs>


    <div class="newAdd" @click="salaryExport" v-if="activesalaryListName ==='salaryChild'">导出</div>


  </div>
</template>

<script>
  import {
    salaryExport,
  } from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import salaryChild from "./components/salaryChild";  //子组件
  import historySalary from "./components/historySalary";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  // import request from '@/utils/request'


  export default {
    name: "salaryList",
    directives: {
      waves,
    },
    components: {
      salaryChild,
      historySalary,
    },

    data() {
      return {
        activesalaryListName: 'salaryChild',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activesalaryListName);
        sessionStorage.setItem('activesalaryListName', this.activesalaryListName)
        this.getList();
      },
      salaryExport() {
        let url ="http:"+ window.API_BASE_URI + "/api/v1" + '/salary/export?token='+ encodeURIComponent(getToken());
        // console.log(url,"url");
        window.open(url, '_blank')
      },
      getList() {
        switch (this.activesalaryListName) {
          case "salaryChild":
            this.$refs.salaryChild.getMondayStartTime();
            break;
          case "historySalary":
            this.$refs.historySalary.getList();
            break;
        }
      },
    },
    mounted() {
      if (sessionStorage.getItem('activesalaryListName')) {
        this.activesalaryListName = sessionStorage.getItem('activesalaryListName')
      } else {
        this.activesalaryListName = "salaryChild"
      }

      this.getList()
    }
  };
</script>
<style>
  .salaryList .el-tabs__nav {
    margin-left: 40px;
  }

  .salaryList .el-tabs__nav-wrap::after {
    background: none;
  }

  .salaryList .el-tabs__header {
    margin: 0;
  }

  .salaryList .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }

</style>
<style lang="scss" scoped>
  .salaryList {
    position: relative;
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
