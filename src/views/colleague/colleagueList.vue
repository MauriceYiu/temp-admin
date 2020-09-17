<template>
  <div class="colleagueList">

    <el-tabs v-model="activeNameColleagueList" @tab-click="handleClick" v-if="hasPerm('department:staffs:list')">
      <el-tab-pane label="员工列表" name="worker">
        <worker ref="worker"></worker>
      </el-tab-pane>
      <!--<el-tab-pane label="离职" name="dimission">
        <dimission ref="dimission"></dimission>
      </el-tab-pane>-->

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="hasPerm('department:staffs:add')">添加同事</div>

  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import worker from "./components/worker";  //子组件
  import dimission from "./components/dimission";  //子组件
  // import questions from "./components/questions"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "colleagueList",
    directives: {
      waves,
    },
    components: {
      worker,
      dimission,
    },

    data() {
      return {
        activeNameColleagueList: 'worker',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameColleagueList);
        sessionStorage.setItem('activeNameColleagueList', this.activeNameColleagueList)
        this.getList();
      },
      addTag() {
        this.$router.push({
          name: "colleagueDetail", params: {
            id: 0
          }
        })
      },
      getList() {
        switch (this.activeNameColleagueList) {
          case "worker":
            this.$refs.worker.getList();
            this.$refs.worker.types();
            break;
          case "dimission":
            this.$refs.dimission.getList();
            this.$refs.dimission.types();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameColleagueList')) {
        this.activeNameColleagueList = sessionStorage.getItem('activeNameColleagueList')
      }else {
        this.activeNameColleagueList = "worker"
      }
      console.log(this.activeNameColleagueList, "activeNameColleagueList");
      this.getList()
    }
  };
</script>
<style>
  .colleagueList .el-tabs__nav {
    margin-left: 22px;
  }

  .colleagueList .el-tabs__nav-wrap::after {
    background: none;
  }

  .colleagueList .el-tabs__header {
    margin: 0;
  }

  .colleagueList .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
  /*.colleagueList .el-input__inner{*/
    /*border-radius: 20px;*/
  /*}*/

</style>
<style lang="scss" scoped>
  .colleagueList {
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
