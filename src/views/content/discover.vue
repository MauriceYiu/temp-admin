<template>
  <div class="discover">

    <el-tabs v-model="activeDiscoverName" @tab-click="handleClick">
      <el-tab-pane label="动态" name="dynamic" v-if="hasPerm('content:found:dynamic')">
        <dynamic ref="dynamic"></dynamic>
      </el-tab-pane>
      <el-tab-pane label="提问" name="questions" v-if="hasPerm('content:found:question')">
        <questions ref="questions"></questions>
      </el-tab-pane>
      <el-tab-pane label="工作圈" name="workCircle" v-if="hasPerm('content:found:workCircle')">
        <workCircle ref="workCircle"></workCircle>
      </el-tab-pane>
      <el-tab-pane label="时讯小报" name="news">
        <news ref="news"></news>
      </el-tab-pane>
    </el-tabs>
    <div class="right">
      <div class="newAdd" @click="addTag('questions')" v-if="activeDiscoverName ==='questions'">分类管理</div>
      <div class="newAdd" @click="addTag('workCircle')" v-if="activeDiscoverName ==='workCircle'">分类管理</div>
      <div class="upload" @click="upload('dynamic')" v-if="activeDiscoverName ==='dynamic' && hasPerm('content:found:dynamic:add')">发布</div>
      <div class="upload" @click="upload('news')" v-if="activeDiscoverName ==='news'">发布</div>
    </div>
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
  import workCircle from "./components/workCircle"; //问题子组件
  import news from "./components/news"; //问题子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "discover",
    directives: {
      waves,
    },
    components: {
      dynamic,
      questions,
      workCircle,
      news
    },

    data() {
      return {
        activeDiscoverName: 'dynamic',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeDiscoverName);
        sessionStorage.setItem('activeDiscoverName', this.activeDiscoverName)
        this.getList();
      },
      addTag(x) {
        let type = "";
        if (x == "questions") {
          type = "question";
        } else if (x == "workCircle") {
          type = "workingCircle";
        }
        this.$router.push({name: "workCircleClassification",query:{
          type: type
          }})
      },
      upload(x){
        let name = "";
        if (x == "dynamic") {
          name = "dynamicDetail";
        } else if (x == "news") {
          name = "newsEdit";
        }
        this.$router.push({
          name: name, params: {
            id: 0
          }
        })
      },
      getList() {
        switch (this.activeDiscoverName) {
          case "dynamic":
            this.$refs.dynamic.getList();
            // this.$refs.dynamic.getMyList();
            break;
          case "questions":
            this.$refs.questions.getList();
            break;
          case "workCircle":
            this.$refs.workCircle.getList();
            break;
          case "news":
            this.$refs.news.getList();
            break;
        }
      },
    },
    mounted() {
      // console.log(sessionStorage.getItem('activeDiscoverName'));
      if (sessionStorage.getItem('activeDiscoverName')) {
        this.activeDiscoverName = sessionStorage.getItem('activeDiscoverName')
      }else {
        this.activeDiscoverName = "dynamic"
      }
      this.getList()
    }
  };
</script>
<style>
  .el-tabs__nav {
    margin-left: 40px;
  }

  .discover .el-tabs__nav-wrap::after {
    background: none;
  }

  .discover .el-tabs__header {
    margin: 0;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .discover {
    position: relative;
    min-height: calc(100vh - 60px);
    .right {
      position: absolute;
      right: 27px;
      top: 10px;
      display: flex;
      align-items: center;
      .newAdd {
        color: #666666;
        font-size: 14px;
        cursor: pointer;
      }
      .upload {
        color: #F65860;
        font-size: 14px;
        cursor: pointer;
        margin-left: 40px;
      }
    }
  }
</style>
