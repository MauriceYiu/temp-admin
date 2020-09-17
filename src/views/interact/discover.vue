<template>
  <div class="interactDiscover">

    <el-tabs v-model="activeNameInteractDiscover" @tab-click="handleClick">
      <el-tab-pane label="动态" name="first" v-if="hasPerm('discovery:circle:dynamic')">
        <dynamic ref="dynamic"></dynamic>
      </el-tab-pane>
      <el-tab-pane label="提问" name="second" v-if="hasPerm('discovery:circle:question')">
        <questions ref="questions"></questions>
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
  import dynamic from "./components/dynamic";  //动态子组件
  import questions from "./components/questions"; //问题子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "interactDiscover",
    directives: {
      waves,
    },
    components: {
      dynamic,
      questions,
    },

    data() {
      return {
        activeNameInteractDiscover: 'first',
        // listQuery: {
        //   keyword: "",
        //   limit: 10,
        //   orderBy: null,
        //   page: 0,
        //   token: getToken(),
        // },
        // checkParams: {
        //   changeTo: "",
        //   reason: "",
        //   targetId: 0,
        //   token: getToken(),
        // },
        // total: 0,
        // page: 1,
        // list: [],
        // listLoading: false,
        // loading: false,
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameInteractDiscover);
        sessionStorage.setItem('activeNameInteractDiscover', this.activeNameInteractDiscover)
        this.getList();
      },
      getList() {
        switch (this.activeNameInteractDiscover) {
          case "first":
            this.$refs.dynamic.getList();
            this.$refs.dynamic.getMyList();
            break;
          case "second":
            this.$refs.questions.getList();
            this.$refs.questions.getMyList();
            break;
        }
      },

    },
    mounted() {
      // console.log(sessionStorage.getItem('activeNameInteractDiscover'));
      if (sessionStorage.getItem('activeNameInteractDiscover')) {
        this.activeNameInteractDiscover = sessionStorage.getItem('activeNameInteractDiscover')
      }
      // console.log(this.activeNameInteractDiscover,"getListgetListgetList");
      this.getList()
    }
  };
</script>
<style>
  .el-tabs__nav-scroll .el-tabs__nav {
    margin-left: 40px;
  }

  .interactDiscover .el-tabs__nav-wrap::after {
    background: none;
  }

  .interactDiscover .el-tabs__header {
    margin: 0;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .interactDiscover {

  }
</style>
