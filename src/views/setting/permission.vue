<template>
  <div class="permission">
    <el-tabs v-model="activeNamePermission" @tab-click="handleClick">
      <el-tab-pane label="权限组设置" name="permissionChild"  v-if="hasPerm('settings:roles:groups')">
        <permissionChild ref="permissionChild"></permissionChild>
      </el-tab-pane>
      <el-tab-pane label="角色设置" name="second"  v-if="hasPerm('settings:roles:roles')">
        <roleSet ref="roleSet"></roleSet>
      </el-tab-pane>
      <!--<el-tab-pane label="评价设置" name="second">-->
      <!--<giftEvaluation ref="giftEvaluation"></giftEvaluation>-->
      <!--</el-tab-pane>-->
    </el-tabs>

    <div class="newAdd" @click="addTag()" v-if="activeNamePermission === 'permissionChild' && hasPerm('settings:roles:groups:add')">添加</div>

  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import permissionChild from "./components/permissionChild"; // base on element-ui
  import roleSet from "./components/roleSet"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "permission",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      permissionChild,
      roleSet,
    },
    data() {
      return {
        activeNamePermission: 'permissionChild',
      };
    },
    methods: {
      addTag() {
        switch (this.activeNamePermission) {
          case "permissionChild":
            this.$router.push({
              name: "addPermissonl", params: {
                id: 0
              }
            })
            break;
          case "second":
            // this.$router.push({
            //   name: "roleSetDetail", params: {
            //     id: 0
            //   }
            // })

            break;
        }

      },
      handleClick(tab, event) {
        console.log(this.activeNamePermission);
        sessionStorage.setItem('activeNamePermission', this.activeNamePermission)
        this.getList();
      },
      getList() {
        switch (this.activeNamePermission) {
          case "permissionChild":
            this.$refs.permissionChild.getList();
            break;
          case "second":
            this.$refs.roleSet.getList();
            break;
        }
      },
    },
    mounted() {
      console.log(sessionStorage.getItem('activeNamePermission'));
      if (sessionStorage.getItem('activeNamePermission')) {
        this.activeNamePermission = sessionStorage.getItem('activeNamePermission')
      }
      this.getList()
    }
  };
</script>

<style>
  .permission .el-tabs__nav {
    margin-left: 40px;
  }

  .permission .el-tabs__nav-wrap::after {
    background: none;
  }

  .permission .el-tabs__header {
    margin: 0;
  }

  .permission .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .permission {
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
