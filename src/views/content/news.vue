<template>
  <div class="news">

    <el-tabs v-model="activeNewsName" @tab-click="handleClick" v-if="hasPerm('content:news:list')">
      <el-tab-pane label="资讯" name="newsChild">
        <newsChild ref="newsChild"></newsChild>
      </el-tab-pane>

    </el-tabs>

    <div class="right">
      <div class="newAdd" @click="addTag" v-if="hasPerm('content:news:types')">添加分类</div>
      <div class="upload" @click="upload" v-if="hasPerm('content:news:add')">上传</div>

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
  import newsChild from "./components/newsChild"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "news",
    directives: {
      waves,
    },
    components: {
      newsChild,
    },

    data() {
      return {
        activeNewsName: 'newsChild',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNewsName);
        sessionStorage.setItem('activeNewsName', this.activeNewsName)
        this.getList();
      },
      upload() {
        this.$router.push({
          name: "newsDetail", params: {
            id: 0
          }
        })
      },
      addTag() {
        this.$router.push({name: "classification",query:{
            type:"courseNews"
          }})
      },
      getList() {
        switch (this.activeNewsName) {
          case "newsChild":
            this.$refs.newsChild.getList();
            break;
        }
      },
    },
    mounted() {
      if (sessionStorage.getItem('activeNewsName')) {
        this.activeNewsName = sessionStorage.getItem('activeNewsName')
      } else {
        this.activeNewsName = "newsChild"
      }
      console.log(this.activeNewsName, "activeNewsName");
      this.getList();
    }
  };
</script>
<style>
  .news .el-tabs__nav {
    margin-left: 40px;
  }

  .news .el-tabs__nav-wrap::after {
    background: none;
  }

  .news .el-tabs__header {
    margin: 0;
  }

  .news .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .news {
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
