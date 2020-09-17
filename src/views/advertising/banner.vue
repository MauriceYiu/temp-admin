<template>
  <div class="banner">

    <el-tabs v-model="activeBannerName" @tab-click="handleClick">
      <el-tab-pane label="首页" name="home" v-if="hasPerm('ad:banner:index:list')">
        <homePageAd ref="homePageAd"></homePageAd>
      </el-tab-pane>
      <el-tab-pane label="学院" name="college" v-if="hasPerm('ad:banner:college:list')">
        <collegeAd ref="collegeAd"></collegeAd>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag" v-if="activeBannerName === 'home' && hasPerm('ad:banner:index:add')">新增</div>
    <div class="newAdd" @click="addTag" v-if="activeBannerName === 'college' && hasPerm('ad:banner:college:add')">新增</div>

  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import homePageAd from "./components/homePageAd";  //子组件
  import collegeAd from "./components/collegeAd";  //子组件
  // import questions from "./components/questions"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "banner",
    directives: {
      waves,
    },
    components: {
      homePageAd,
      collegeAd,
    },

    data() {
      return {
        activeBannerName: 'home',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeBannerName);
        sessionStorage.setItem('activeBannerName', this.activeBannerName)
        this.getList();
      },
      addTag() {
        switch (this.activeBannerName) {
          case "home":
            this.$router.push({
              name: "homepageAdDetail", params: {
                id: 0
              }
            })
            break;
          case "college":
            this.$router.push({
              name: "collegeAdDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeBannerName) {
          case "home":
            this.$refs.homePageAd.getList();
            break;
          case "college":
            this.$refs.collegeAd.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeBannerName')) {
        this.activeBannerName = sessionStorage.getItem('activeBannerName')
      }else {
        this.activeBannerName = "home"
      }
      console.log(this.activeBannerName, "activeBannerName");
      this.getList()
    }
  };
</script>
<style>
  .banner .el-tabs__nav {
    margin-left: 40px;
  }

  .banner .el-tabs__nav-wrap::after {
    background: none;
  }

  .banner .el-tabs__header {
    margin: 0;
  }

  .banner .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .banner {
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
