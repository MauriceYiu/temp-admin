<template>
  <div class="PKlist">

    <el-tabs v-model="activeNamePKlist" @tab-click="handleClick" v-if="hasPerm('business:pk:list')">
      <el-tab-pane label="个人协议" name="PKlistPersonal">
        <PKlistPersonal ref="PKlistPersonal"></PKlistPersonal>
      </el-tab-pane>
      <el-tab-pane label="团队协议" name="PKlistTeam">
        <PKlistTeam ref="PKlistTeam"></PKlistTeam>
      </el-tab-pane>
    </el-tabs>
    <div class="newAdd" @click="addTag" v-if="hasPerm('business:pk:add')">新增</div>
  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import PKlistPersonal from "./components/PKlistPersonal";  //子组件
  import PKlistTeam from "./components/PKlistTeam";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "PKlist",
    directives: {
      waves,
    },
    components: {
      PKlistPersonal,
      PKlistTeam,
    },

    data() {
      return {
        activeNamePKlist: 'PKlistPersonal',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNamePKlist);
        sessionStorage.setItem('activeNamePKlist', this.activeNamePKlist)
        this.getList();
      },
      addTag() {
        switch (this.activeNamePKlist) {
          case "PKlistPersonal":
            this.$router.push({
              name: "pkDetail", params: {
                id: 0,
                type:'single',
              }
            })
            break;
          case "PKlistTeam":
            this.$router.push({
              name: "pkDetail", params: {
                id: 0,
                type:'team',
              }
            })
            break;
        }
      },

      getList() {
        switch (this.activeNamePKlist) {
          case "PKlistPersonal":
            this.$refs.PKlistPersonal.getList();
            break;
          case "PKlistTeam":
            this.$refs.PKlistTeam.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNamePKlist')) {
        this.activeNamePKlist = sessionStorage.getItem('activeNamePKlist')
      } else {
        this.activeNamePKlist = "PKlistPersonal"
      }
      console.log(this.activeNamePKlist, "activeNamePKlist");
      this.getList()
    }
  };
</script>
<style>
  .PKlist .el-tabs__nav {
    margin-left: 40px;
  }

  .PKlist .el-tabs__nav-wrap::after {
    background: none;
  }

  .PKlist .el-tabs__header {
    margin: 0;
  }

  .PKlist .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .PKlist {
    position: relative;
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
