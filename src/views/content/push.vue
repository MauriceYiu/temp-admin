<template>
  <div class="push">
    <el-tabs v-model="activePushName" @tab-click="handleClick">
      <el-tab-pane label="客户端" name="app" v-if="hasPerm('content:push:app')">
        <app ref="app"></app>
      </el-tab-pane>
      <el-tab-pane label="员工端" name="staff" v-if="hasPerm('content:push:staff')">
        <staff ref="staff"></staff>
      </el-tab-pane>
      <el-tab-pane label="跑马灯" name="marquee" v-if="hasPerm('content:push:marquee')">
        <marquee ref="marquee"></marquee>
      </el-tab-pane>

    </el-tabs>


    <div class="newAdd" @click="dialogFormVisible = true" v-if="activePushName==='marquee' && hasPerm('content:push:marquee:add')">自定义添加</div>
    <div class="newAdd" @click="addTag" v-if="activePushName == 'staff' && hasPerm('content:push:staff:add')">新增</div>
    <div class="newAdd" @click="addTag" v-if="activePushName == 'app' && hasPerm('content:push:app:add')">新增</div>


    <el-dialog title="自定义添加跑马灯" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">

        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            style="width: 800px;"
            placeholder="请输入内容"
            v-model="formParams.content"
            :autosize="{ minRows: 6, maxRows: 10}"
            type='textarea'>
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="enable">
          <el-switch
            style="display: inline-block;"
            v-model="formParams.shown"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tagSubmitForm">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
    marqueeEdit,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import app from "./components/app";  //子组件
  import staff from "./components/staff";  //子组件
  import marquee from "./components/marquee";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "push",
    directives: {
      waves,
    },
    components: {
      app,
      staff,
      marquee,
    },

    data() {
      return {
        activePushName: 'app',
        dialogFormVisible: false,
        formLabelWidth: "80px",
        formParams: {
          content: "",
          marqueeId: 0,
          shown: true,
          token: getToken(),
        },
      };
    },
    methods: {
      handleClick(tab, event) {
        // console.log(this.activePushName);
        sessionStorage.setItem('activePushName', this.activePushName)
        this.getList();
      },
      addTag() {
        this.$router.push({
          name: "pushDetail", params: {
            id: 0
          }
        })
      },
      tagSubmitForm() {
        if (!this.formParams.content) {
          this.$message({
            message: "请输入内容",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        marqueeEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.dialogFormVisible = false
            this.$refs.marquee.getList();
            this.formParams = {
              content: "",
              marqueeId: 0,
              shown: false,
              token: getToken(),
            }
          } else {

          }

        });
      },
      getList() {
        switch (this.activePushName) {
          case "app":
            this.$refs.app.getList();
            break;
          case "staff":
            this.$refs.staff.getList();
            break;
          case "marquee":
            this.$refs.marquee.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activePushName')) {
        this.activePushName = sessionStorage.getItem('activePushName')
      } else {
        this.activePushName = "app"
      }
      // console.log(this.activePushName, "activePushName");
      this.getList()
    }
  };
</script>
<style>
  .push .el-tabs__nav {
    margin-left: 22px;
  }

  .push .el-tabs__nav-wrap::after {
    background: none;
  }

  .push .el-tabs__header {
    margin: 0;
  }

  .push .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .push {
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
