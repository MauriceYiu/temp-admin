<template>
  <div class="Live">
    <!--pub公开、secret密训、dating邀约-->
    <el-tabs v-model="activeLiveName" @tab-click="handleClick" v-if="hasPerm('content:live:list')">
      <el-tab-pane label="密训" name="secret">
        <secret ref="secret"></secret>
      </el-tab-pane>
      <el-tab-pane label="公开" name="pub">
        <pub ref="pub"></pub>
      </el-tab-pane>
      <el-tab-pane label="邀约" name="dating">
        <dating ref="dating"></dating>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="hasPerm('content:live:add')">发布直播</div>


  </div>
</template>

<script>
  import waves from "@/directive/waves"; // 水波纹指令
  import secret from "./components/secret";  //子组件
  import pub from "./components/pub";  //子组件
  import dating from "./components/dating"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "Live",
    directives: {
      waves,
    },
    components: {
      secret,
      pub,
      dating,
    },

    data() {
      return {
        activeLiveName: 'secret',
      };
    },
    methods: {
      handleClick(tab, event) {
        // console.log(this.activeLiveName);
        sessionStorage.setItem('activeLiveName', this.activeLiveName)
        this.getList();
      },
      upload() {
        this.$router.push({
          name: "secretDetail", params: {
            id: 0
          }
        })
      },
      addTag() {
        this.$router.push({
          name: "LiveDetail", params: {
            id: 0
          }
        })
      },
      getList() {
        // console.log(this.activeLiveName);
        switch (this.activeLiveName) {
          case "secret":
            this.$refs.secret.getList();
            break;
          case "pub":
            this.$refs.pub.getList();
            break;
          case "dating":
            this.$refs.dating.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeLiveName')) {
        this.activeLiveName = sessionStorage.getItem('activeLiveName')
      } else {
        this.activeLiveName = "secret"
      }
      console.log(this.activeLiveName, "activeLiveName");
      this.getList()
    }
  };
</script>
<style>
  .el-tabs__nav {
    margin-left: 40px;
  }

  .Live .el-tabs__nav-wrap::after {
    background: none;
  }

  .Live .el-tabs__header {
    margin: 0;
  }

  .Live .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .Live {
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
