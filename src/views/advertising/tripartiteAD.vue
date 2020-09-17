<template>
  <div class="tripartiteAD">

    <el-tabs v-model="tripartiteADName" @tab-click="handleClick">
      <el-tab-pane label="服务市场" name="serviceMarket">
        <serviceMarket ref="serviceMarket"></serviceMarket>
      </el-tab-pane>
      <el-tab-pane label="辅助工具" name="auxiliaryTool">
        <auxiliaryTool ref="auxiliaryTool"></auxiliaryTool>
      </el-tab-pane>
      <el-tab-pane label="智能攻略" name="intelligent">
        <intelligent ref="intelligent"></intelligent>
      </el-tab-pane>
      <el-tab-pane label="公告背景" name="background" v-if="hasPerm('ad:third:background:list')">
        <background ref="background"></background>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="tripartiteADName==='background' && hasPerm('ad:third:background:add')">新增</div>

  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import serviceMarket from "./components/serviceMarket";  //子组件
  import auxiliaryTool from "./components/auxiliaryTool";  //子组件
  import intelligent from "./components/intelligent";  //子组件
  import background from "./components/background";  //子组件
  // import questions from "./components/questions"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "tripartiteAD",
    directives: {
      waves,
    },
    components: {
      serviceMarket,
      auxiliaryTool,
      intelligent,
      background,
    },

    data() {
      return {
        tripartiteADName: 'serviceMarket',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.tripartiteADName);
        sessionStorage.setItem('tripartiteADName', this.tripartiteADName)
        this.getList();
      },
      addTag() {
        switch (this.tripartiteADName) {
          case "background":
            this.$router.push({
              name: "backgroundDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.tripartiteADName) {
          case "serviceMarket":
            this.$refs.serviceMarket.getList();
            break;
          case "auxiliaryTool":
            this.$refs.auxiliaryTool.getList();
            break;
          case "intelligent":
            this.$refs.intelligent.getList();
            break;
          case "background":
            this.$refs.background.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('tripartiteADName')) {
        this.tripartiteADName = sessionStorage.getItem('tripartiteADName')
      }
      console.log(this.tripartiteADName, "tripartiteADName");
      this.getList()
    }
  };
</script>
<style>
  .tripartiteAD .el-tabs__nav {
    margin-left: 40px;
  }

  .tripartiteAD .el-tabs__nav-wrap::after {
    background: none;
  }

  .tripartiteAD .el-tabs__header {
    margin: 0;
  }

  .tripartiteAD .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
</style>
<style lang="scss" scoped>
  .tripartiteAD {
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
