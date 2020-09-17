<template>
  <div class="ranking">

    <el-tabs v-model="activeNameRanking" @tab-click="handleClick" v-if="hasPerm('business:businessRanking')">
      <el-tab-pane label="个人业绩" name="personalCj">
        <personalCj ref="personalCj"></personalCj>
      </el-tab-pane>
      <el-tab-pane label="团队业绩" name="teamCj">
        <teamCj ref="teamCj"></teamCj>
      </el-tab-pane>

    </el-tabs>

    <div class="right">
      <!--<div class="newAdd" @click="addTag">添加分类</div>-->
      <!--<div class="upload" @click="upload">上传</div>-->

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
  import personalCj from "./components/personalCj";  //子组件
  import teamCj from "./components/teamCj";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "ranking",
    directives: {
      waves,
    },
    components: {
      personalCj,
      teamCj,
    },

    data() {
      return {
        activeNameRanking: 'personalCj',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameRanking);
        sessionStorage.setItem('activeNameRanking', this.activeNameRanking)
        this.getList();
      },
      upload() {
        this.$router.push({
          name: "bookDetail", params: {
            id: 0
          }
        })
      },
      addTag() {
        this.$router.push({name: "classification"})

      },
      getList() {
        switch (this.activeNameRanking) {
          case "personalCj":
            this.$refs.personalCj.getList();
            break;
          case "teamCj":
            this.$refs.teamCj.handleClick();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameRanking')) {
        this.activeNameRanking = sessionStorage.getItem('activeNameRanking')
      } else {
        this.activeNameRanking = "personalCj"
      }
      console.log(this.activeNameRanking, "activeNameRanking");
      this.getList()
    }
  };
</script>
<style>
  .ranking .el-tabs__nav {
    margin-left: 40px;
  }

  .ranking .el-tabs__nav-wrap::after {
    background: none;
  }

  .ranking .el-tabs__header {
    margin: 0;
  }

  .ranking .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .ranking {
    position: relative;
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
