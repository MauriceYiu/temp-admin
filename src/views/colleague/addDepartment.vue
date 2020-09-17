<template>
  <div class="addDepartment">

    <el-tabs v-model="activeNameAddDeparment" @tab-click="handleClick">
      <el-tab-pane label="创建部门" name="addDepartmentChild" v-if="hasPerm('department:departmentCreate')">
        <addDepartmentChild ref="addDepartmentChild"></addDepartmentChild>
      </el-tab-pane>
      <el-tab-pane label="创建职位" name="addPosition">
        <addPosition ref="addPosition"></addPosition>
      </el-tab-pane>
    </el-tabs>
    <!--<div class="newAdd" @departmentUpdate="departmentUpdate" v-if="activeNameAddDeparment === 'addDepartmentChild'">部门更新</div>-->
    <!--<div class="newAdd" @departmentUpdate="departmentUpdate" v-if="activeNameAddDeparment === 'addPosition'">职位更新</div>-->
  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import addDepartmentChild from "./components/addDepartmentChild";  //子组件
  import addPosition from "./components/addPosition";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "addDepartment",
    directives: {
      waves,
    },
    components: {
      addDepartmentChild,
      addPosition,
    },

    data() {
      return {
        activeNameAddDeparment: 'addDepartmentChild',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameAddDeparment);
        sessionStorage.setItem('activeNameAddDeparment', this.activeNameAddDeparment)
        this.getList();
      },
      departmentUpdate(){

      },
      addTag() {
        switch (this.activeNameAddDeparment) {
          case "addDepartmentChild":
            this.$router.push({
              name: "pkDetail", params: {
                id: 0,
                type:'single',
              }
            })
            break;
          case "addPosition":
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
        switch (this.activeNameAddDeparment) {
          case "addDepartmentChild":
            this.$refs.addDepartmentChild.getList();
            break;
          case "addPosition":
            this.$refs.addPosition.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameAddDeparment')) {
        this.activeNameAddDeparment = sessionStorage.getItem('activeNameAddDeparment')
      } else {
        this.activeNameAddDeparment = "addDepartmentChild"
      }
      console.log(this.activeNameAddDeparment, "activeNameAddDeparment");
      this.getList()
    }
  };
</script>
<style>
  .addDepartment .el-tabs__nav {
    margin-left: 40px;
  }

  .addDepartment .el-tabs__nav-wrap::after {
    background: none;
  }

  .addDepartment .el-tabs__header {
    margin: 0;
  }

  .addDepartment .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .addDepartment {
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
