<template>
  <div class="quickEntry">

    <el-tabs v-model="activeEntryName" @tab-click="handleClick">
      <el-tab-pane label="辅助工具" name="auxiliaryTool" v-if="hasPerm('settings:quickEntry:tool')">
        <auxiliaryTool ref="auxiliaryTool"></auxiliaryTool>
      </el-tab-pane>
      <el-tab-pane label="智能攻略" name="smartStrategy" v-if="hasPerm('settings:quickEntry:guide')">
        <smartStrategy ref="smartStrategy"></smartStrategy>
      </el-tab-pane>
      <!--<el-tab-pane label="金融咨询" name="consultancy">-->
      <!--<consultancy ref="consultancy"></consultancy>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="实操助贷" name="sczd">-->
      <!--<sczd ref="sczd"></sczd>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="长线融资" name="financing">-->
      <!--<financing ref="financing"></financing>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="信用数据" name="creditData">-->
      <!--<creditData ref="creditData"></creditData>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="商务合作" name="cooperation">-->
      <!--<cooperation ref="cooperation"></cooperation>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="技术学习" name="study">-->
      <!--<study ref="study"></study>-->
      <!--</el-tab-pane>-->

    </el-tabs>
    <!--<div class="addTag" @click="addTag" v-if="activeEntryName==='auxiliaryTool'">新增</div>-->
    <div class="right">
      <!--<div class="newAdd" @click="openDialog">添加分类</div>-->
      <div class="addTag" @click="addTag" v-if="activeEntryName=='auxiliaryTool' && hasPerm('settings:quickEntry:tool:add')">新增</div>
      <div class="addTag" @click="addTag" v-if="activeEntryName=='smartStrategy' && hasPerm('settings:quickEntry:guide:add')">新增</div>
    </div>

    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">


        <el-form-item label="名称">
          <el-input
            style="width: 600px;"
            v-model="formParams.name"
            placeholder="输入名称"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            style="width: 600px;"
            v-model="formParams.queue"
            placeholder="输入序号"
          />
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
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import {
    typeEdit,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import auxiliaryTool from "./components/auxiliaryTool";  //子组件
  import smartStrategy from "./components/smartStrategy";  //子组件
  import consultancy from "./components/consultancy";  //子组件
  import sczd from "./components/sczd";  //子组件
  import financing from "./components/financing";  //子组件
  import creditData from "./components/creditData";  //子组件
  import cooperation from "./components/cooperation";  //子组件
  import study from "./components/study";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "quickEntry",
    directives: {
      waves,
    },
    components: {
      auxiliaryTool,
      smartStrategy,
      consultancy,
      sczd,
      financing,
      creditData,
      cooperation,
      study,
    },

    data() {
      return {
        activeEntryName: 'auxiliaryTool',
        dialogFormVisible: false,
        formLabelWidth: "100px",
        formParams: {
          name: "",
          type: "",
          enable: true,
          queue: null,
          token: getToken(),
        },
      };
    },
    methods: {
      tagSubmitForm() {
        console.log(this.formParams.type,"要提交的");
        if (!this.formParams.name) {
          this.$message({
            message: "请输入名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.queue) {
          this.$message({
            message: "请输入序号",
            type: "error"
          });
          return false;
        }

        this.loading = true;

        // type/edit 分类新建或修改
        typeEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.dialogFormVisible = false
            this.formParams = {
              name: "",
              type: "",
              enable: true,
              queue: null,
              token: getToken(),
            }
          } else {

          }

        });
      },
      handleClick(tab, event) {
        sessionStorage.setItem('activeEntryName', this.activeEntryName)
        this.getList();

      },
      openDialog(){
        this.dialogFormVisible = true
      },
      addTag() {
        switch (this.activeEntryName) {
          //辅助工具
          case "auxiliaryTool":
            this.$router.push({
              name: "auxiliaryToolDetail", params: {
                id: 0
              }
            })
            break;
          case "smartStrategy":  //智能攻略
            this.$router.push({
              name: "smartStrategypDetail", params: {
                id: 0
              }
            })
            break;
          case "consultancy":
            this.$router.push({
              name: "vipDetail", params: {
                id: 0
              }
            })
            break;
          case "financing":
            this.$router.push({
              name: "vipDetail", params: {
                id: 0
              }
            })
            break;
          case "creditData":
            this.$router.push({
              name: "vipDetail", params: {
                id: 0
              }
            })
            break;
          case "cooperation":
            this.$router.push({
              name: "vipDetail", params: {
                id: 0
              }
            })
            break;
          case "study":
            this.$router.push({
              name: "vipDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeEntryName) {
          case "auxiliaryTool":
            this.formParams.type = "tool"
            this.$refs.auxiliaryTool.getList();
            break;
          case "smartStrategy":
            this.formParams.type = "guide"
            this.$refs.smartStrategy.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeEntryName')) {
        this.activeEntryName = sessionStorage.getItem('activeEntryName')
      } else {
        this.activeEntryName = "auxiliaryTool"
      }
      console.log(this.activeEntryName, "activeEntryName");
      this.getList()
    }
  };
</script>
<style>
  .quickEntry .el-tabs__nav {
    margin-left: 40px;
  }

  .quickEntry .el-tabs__nav-wrap::after {
    background: none;
  }

  .quickEntry .el-tabs__header {
    margin: 0;
  }

  .quickEntry .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .quickEntry {
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
      .addTag {
        color: #F65860;
        font-size: 14px;
        cursor: pointer;
        margin-left: 40px;
      }
    }
  }
</style>
