<template>
  <div class="businessProduct">

    <el-tabs v-model="activeNameBusiness" @tab-click="handleClick" v-if="hasPerm('business:service:list')">
      <el-tab-pane label="业务产品" name="businessProductChild">
        <businessProductChild ref="businessProductChild"></businessProductChild>
      </el-tab-pane>
      <!--<el-tab-pane label="技术老师" name="techTeacher">-->
        <!--<techTeacher ref="techTeacher"></techTeacher>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="客服服务" name="customerService">-->
        <!--<customerService ref="customerService"></customerService>-->
      <!--</el-tab-pane>-->

    </el-tabs>

    <div class="right">
      <!--<div class="upload" @click="open" style="color: black">服务说明协议</div>-->
      <div class="upload" @click="upload" v-if="hasPerm('business:service:add')">新增</div>
    </div>


    <el-dialog title="服务说明协议" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">

        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            style="width: 90%;"
            placeholder="输入内容"
            v-model="formParams.content"
            rows="4"
            type='textarea'>
          </el-input>
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
  import waves from "@/directive/waves"; // 水波纹指令
  import businessProductChild from "./components/businessProductChild";  //子组件
  import techTeacher from "./components/techTeacher";  //子组件
  import customerService from "./components/customerService";  //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "businessProduct",
    directives: {
      waves,
    },
    components: {
      businessProductChild,
      techTeacher,
      customerService,
    },

    data() {
      return {
        activeNameBusiness: 'businessProductChild',
        dialogFormVisible: false,
        formLabelWidth: "80px",
        formParams:{
          content:'',
        },
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameBusiness);
        sessionStorage.setItem('activeNameBusiness', this.activeNameBusiness)
        this.getList();
      },
      open(){
        this.dialogFormVisible = true
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
        newsEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.dialogFormVisible = false
          }
        });
      },
      upload() {
        switch (this.activeNameBusiness) {
          case "businessProductChild":
            this.$router.push({
              name: "businessDetail", params: {
                id: 0
              }
            })
            break;
          case "techTeacher":
            this.$router.push({
              name: "colleagueDetail", params: {
                id: 0
              }
            })
            break;
          case "customerService":
            this.$router.push({
              name: "colleagueDetail", params: {
                id: 0
              }
            })
            break;
        }

      },

      getList() {
        switch (this.activeNameBusiness) {
          case "businessProductChild":
            this.$refs.businessProductChild.getList();
            break;
          case "techTeacher":
            this.$refs.techTeacher.getList();
            break;
          case "customerService":
            this.$refs.customerService.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameBusiness')) {
        this.activeNameBusiness = sessionStorage.getItem('activeNameBusiness')
      } else {
        this.activeNameBusiness = "businessProductChild"
      }
      console.log(this.activeNameBusiness, "activeNameBusiness");
      this.getList()
    }
  };
</script>
<style>
  .businessProduct .el-tabs__nav {
    margin-left: 40px;
  }

  .businessProduct .el-tabs__nav-wrap::after {
    background: none;
  }

  .businessProduct .el-tabs__header {
    margin: 0;
  }

  .businessProduct .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .businessProduct {
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
