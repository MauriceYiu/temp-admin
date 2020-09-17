<template>
  <div class="work">

    <el-tabs v-model="activeNameWork" @tab-click="handleClick">
      <el-tab-pane label="工作圈" name="workChild">
        <workChild ref="workChild"></workChild>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import workChild from "./components/workChild";  //动态子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "work",
    directives: {
      waves,
    },
    components: {
      workChild,
    },

    data() {
      return {
        activeNameWork: 'workChild',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameWork);
        sessionStorage.setItem('activeNameWork', this.activeNameWork)
        this.getList();
      },
      getList() {
        switch (this.activeNameWork) {
          case "workChild":
            this.$refs.workChild.getList();
            // this.$refs.workChild.getMyList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameWork')) {
        this.activeNameWork = sessionStorage.getItem('activeNameWork')
      }else this.activeNameWork = "workChild"
      this.getList()
    }
  };
</script>
<style>
  .el-tabs__nav-scroll .el-tabs__nav {
    margin-left: 40px;
  }

  .work .el-tabs__nav-wrap::after {
    background: none;
  }

  .work .el-tabs__header {
    margin: 0;
  }
</style>
<style lang="scss" scoped>
  .work {

  }
</style>
