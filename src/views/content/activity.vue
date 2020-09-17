<template>
  <div class="activity">
    <el-tabs v-model="activeActivityName" @tab-click="handleClick">
      <el-tab-pane label="线下课程" name="offlineCourse" v-if="hasPerm('content:activity:list')">
        <offlineCourse ref="offlineCourse"></offlineCourse>
      </el-tab-pane>
      <!--<el-tab-pane label="预约名单" name="waitingList">-->
      <!--<waitingList ref="waitingList"></waitingList>-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="嘉宾列表" name="guestList" v-if="hasPerm('content:activity:teachers')">
        <guestList ref="guestList"></guestList>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag(1)"
         v-if="activeActivityName==='offlineCourse' && hasPerm('content:activity:list:add')">发布
    </div>
    <div class="newAdd" @click="addTag(3)" v-if="activeActivityName==='guestList' && hasPerm('content:activity:teachers:add')">
      添加
    </div>


  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import offlineCourse from "./components/offlineCourse"; //子组件
  import waitingList from "./components/waitingList"; //子组件
  import guestList from "./components/guestList"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "activity",
    directives: {
      waves,
    },
    components: {
      offlineCourse,
      waitingList,
      guestList,
    },

    data() {
      return {
        activeActivityName: 'offlineCourse',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeActivityName);
        sessionStorage.setItem('activeActivityName', this.activeActivityName)
        this.getList();
      },
      addTag(num) {
        switch (num) {
          case 1:
            this.$router.push({
              name: "activityDetail", params: {
                id: 0
              }
            })
            break;
          case 3:
            this.$router.push({
              name: "guestDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeActivityName) {
          case "offlineCourse":
            this.$refs.offlineCourse.getList();
            break;
          case "waitingList":
            this.$refs.waitingList.getList();
            break;
          case "guestList":
            this.$refs.guestList.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeActivityName')) {
        this.activeActivityName = sessionStorage.getItem('activeActivityName')
      } else {
        this.activeActivityName = "offlineCourse"
      }
      console.log(this.activeActivityName, "activeActivityName");
      this.getList()
    }
  };
</script>
<style>
  .el-tabs__nav {
    margin-left: 40px;
  }

  .activity .el-tabs__nav-wrap::after {
    background: none;
  }

  .activity .el-tabs__header {
    margin: 0;
  }

  .activity .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }

  .el-table::before {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .activity {
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
