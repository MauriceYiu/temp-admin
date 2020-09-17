<template>
  <div class="course">

    <el-tabs v-model="activeCourseName" @tab-click="handleClick" v-if="hasPerm('content:course:list')">
      <el-tab-pane label="课程" name="book">
        <book ref="book"></book>
      </el-tab-pane>
      <!--<el-tab-pane label="优惠" name="discounts">-->
        <!--<discounts ref="discounts"></discounts>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="免费" name="free">-->
        <!--<free ref="free"></free>-->
      <!--</el-tab-pane>-->

    </el-tabs>

    <div class="right">
      <div class="newAdd" @click="addTag" v-if="hasPerm('content:course:types')">添加分类</div>
      <div class="upload" @click="upload" v-if="hasPerm('content:course:add')">上传</div>
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
  import book from "./components/book";  //子组件
  import discounts from "./components/discounts";  //子组件
  import free from "./components/free"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "course",
    directives: {
      waves,
    },
    components: {
      book,
      discounts,
      free,
    },

    data() {
      return {
        activeCourseName: 'book',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeCourseName);
        sessionStorage.setItem('activeCourseName', this.activeCourseName)
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
        this.$router.push({name: "classification",query:{
          type:"courseBook"
          }})
      },
      getList() {
        switch (this.activeCourseName) {
          case "book":
            this.$refs.book.getList();
            break;
          case "discounts":
            this.$refs.discounts.getList();
            break;
          case "free":
            this.$refs.free.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeCourseName')) {
        this.activeCourseName = sessionStorage.getItem('activeCourseName')
      } else {
        this.activeCourseName = "book"
      }
      console.log(this.activeCourseName, "activeCourseName");
      this.getList()
    }
  };
</script>
<style>
  .course .el-tabs__nav {
    margin-left: 40px;
  }

  .course .el-tabs__nav-wrap::after {
    background: none;
  }

  .course .el-tabs__header {
    margin: 0;
  }

  .course .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }

  .el-table::before {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .course {
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
