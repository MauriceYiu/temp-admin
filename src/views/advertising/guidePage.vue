<template>
  <div class="guidePage">

    <el-tabs v-model="activeNameGuidePage" @tab-click="handleClick">
      <el-tab-pane label="客户端" name="appGuide"  v-if="hasPerm('ad:guide:appGuide:list')">
        <appGuide ref="appGuide"></appGuide>
      </el-tab-pane>
      <el-tab-pane label="员工端" name="staffGuide"  v-if="hasPerm('ad:guide:staffGuide:list')">
        <staffGuide ref="staffGuide"></staffGuide>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="activeNameGuidePage === 'appGuide' && hasPerm('ad:guide:appGuide:add')">新增</div>
    <div class="newAdd" @click="addTag" v-if="activeNameGuidePage === 'staffGuide' && hasPerm('ad:guide:staffGuide:add')">新增</div>

  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import appGuide from "./components/appGuide";  //子组件
  import staffGuide from "./components/staffGuide";  //子组件
  // import questions from "./components/questions"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "guidePage",
    directives: {
      waves,
    },
    components: {
      appGuide,
      staffGuide,
    },

    data() {
      return {
        activeNameGuidePage: 'home',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameGuidePage);
        sessionStorage.setItem('activeNameGuidePage', this.activeNameGuidePage)
        this.getList();
      },
      addTag() {
        switch (this.activeNameGuidePage) {
          case "appGuide":
            this.$router.push({
              name: "appGuideDetail", params: {
                id: 0
              }
            })
            break;
          case "staffGuide":
            this.$router.push({
              name: "staffGuideDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeNameGuidePage) {
          case "appGuide":
            this.$refs.appGuide.getList();
            break;
          case "staffGuide":
            this.$refs.staffGuide.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameGuidePage')) {
        this.activeNameGuidePage = sessionStorage.getItem('activeNameGuidePage')
      }else {
        this.activeNameGuidePage = "appGuide"
      }
      console.log(this.activeNameGuidePage, "activeNameGuidePage");
      this.getList()
    }
  };
</script>
<style>
  .guidePage .el-tabs__nav {
    margin-left: 40px;
  }

  .guidePage .el-tabs__nav-wrap::after {
    background: none;
  }

  .guidePage .el-tabs__header {
    margin: 0;
  }

  .guidePage .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .guidePage {
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
