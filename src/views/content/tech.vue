<template>
  <div class="tech">

    <el-tabs v-model="activeTechName" @tab-click="handleClick" v-if="hasPerm('content:tech:list')">
      <el-tab-pane label="技术" name="techChild">
        <techChild ref="techChild"></techChild>
      </el-tab-pane>
      <!--<el-tab-pane label="优惠" name="discountsTech">-->
      <!--<discountsTech ref="discountsTech"></discountsTech>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="免费" name="freeTech">-->
      <!--<freeTech ref="freeTech"></freeTech>-->
      <!--</el-tab-pane>-->

    </el-tabs>

    <div class="right">
      <div class="newAdd" @click="addTag" v-if="hasPerm('content:tech:types')">添加分类</div>
      <div class="upload" @click="upload" v-if="hasPerm('content:tech:add')">上传</div>

    </div>


  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import techChild from "./components/techChild"; //子组件
  import discountsTech from "./components/discountsTech"; //子组件
  import freeTech from "./components/freeTech"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "tech",
    directives: {
      waves,
    },
    components: {
      techChild,
      discountsTech,
      freeTech,
    },

    data() {
      return {
        activeTechName: 'techChild',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeTechName);
        sessionStorage.setItem('activeTechName', this.activeTechName)
        this.getList();
      },
      upload() {
        this.$router.push({
          name: "techDetail", params: {
            id: 0
          }
        })
      },
      addTag() {
        this.$router.push({
          name: "classification", query: {
            type: "courseTech"
          }
        })
      },
      getList() {
        switch (this.activeTechName) {
          case "techChild":
            this.$refs.techChild.getList();
            break;
          case "discountsTech":
            this.$refs.discountsTech.getList();
            break;
          case "freeTech":
            this.$refs.freeTech.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeTechName')) {
        this.activeTechName = sessionStorage.getItem('activeTechName')
      } else {
        this.activeTechName = "techChild"
      }
      console.log(this.activeTechName, "activeTechName");
      this.getList()
    }
  };
</script>
<style>
  .tech .el-tabs__nav {
    margin-left: 40px;
  }

  .tech .el-tabs__nav-wrap::after {
    background: none;
  }

  .tech .el-tabs__header {
    margin: 0;
  }

  .tech .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }

  .el-table::before {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .tech {
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
