<template>
  <div class="userList">
    <div class="head">
      <div class="back" @click="back">
        客户列表
        <div class="line"></div>
      </div>
    </div>
    <div class="bill" v-if="hasPerm('customers:customer:list')">
      <userListChild @getRightList="getList"></userListChild>
      <userDetail ref="userDetail"></userDetail>
    </div>

  </div>
</template>

<script>
  import waves from "@/directive/waves"; // 水波纹指令
  import client from "./components/client";  //子组件
  import userListChild from "./components/userListChild";  //子组件
  import userDetail from "./components/userDetail";  //子组件
  // import service from "./components/service";  //子组件
  // import evaluateRreward from "./components/evaluateRreward"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "userList",
    directives: {
      waves,
    },
    components: {
      userListChild,
      userDetail,
    },

    data() {
      return {
      };
    },
    methods: {
      back() {
        this.$router.go(-1);//返回上一层
      },
      getList(data) {
        // console.log(data, "emit");
        if(data.token) {
          this.$refs.userDetail.refresh(data.checkId, data.token);
        }
      },

    },
    mounted() {
    }
  };
</script>
<style>
  .userList .el-tabs__nav {
    margin-left: 22px;
  }

  .userList .el-tabs__nav-wrap::after {
    background: none;
  }

  .userList .el-tabs__header {
    margin: 0;
  }

  .userList .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
</style>
<style lang="scss" scoped>
  .userList {
    position: relative;
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 27px 0 40px;
      .back {
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
        line-height: 40px;
        position: relative;
        /*border-bottom: 2px solid #5BC0DF;*/
      }
      .line {
        width: 32px;
        height: 2px;
        background: #409EFF;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .bill {
      display: flex;
      background: #f4f5f7;
      padding: 20px;
      /*border: 1px solid red;*/
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>
