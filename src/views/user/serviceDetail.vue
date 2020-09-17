<template>
  <div class="serviceDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="right" v-if="status == 'checking'">
        <div class="pass btn" @click="changeStatus">处理</div>
      </div>
      <div class="right" v-if="status != 'checking'">
       <span :class="{green:status==='success',red:status==='failed'}">{{ checkStatus}}</span>
      </div>

    </div>
    <div class="content">
      <div class="left">
        <userInfo :jsonData="jsonData" v-show="status == 'checking'"></userInfo>
        <userInfoChecked :jsonData="jsonData" v-show="status != 'checking'"></userInfoChecked>
      </div>
      <div class="right">
        <chatHistory :jsonData="jsonData"></chatHistory>
      </div>
    </div>

    <el-dialog title="售后处理" :visible.sync="dialogFormVisible">
      <el-form :model="statusChangeParams">
        <el-form-item label="处理类型">
          <el-select v-model="statusChangeParams.type" placeholder="请选择处理类型">
            <el-option label="退款" value="1"></el-option>
            <el-option label="重选老师" value="2"></el-option>
            <el-option label="关闭评价" value="3"></el-option>
            <el-option label="默认评价" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款金额" v-if="statusChangeParams.type == 1">
          <el-input v-model="statusChangeParams.moneyFormat" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="售后说明">
          <el-input v-model="statusChangeParams.remark" autocomplete="off" style="width: 80%" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusChangeSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import {
    courseEdit,
    courseDetail,
  } from "../../api/content";
  import {
    serviceAcceptAfterSale,
    serviceBuyDetail,
    serviceRejectAfterSale,
  } from "../../api/user";
  import {vipAll} from "../../api/settings";
  import userInfo from "./components/userInfo"; //子组件
  import userInfoChecked from "./components/userInfoChecked"; //子组件
  import chatHistory from "./components/chatHistory"; //子组件
  import {userStaffs} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "serviceDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      userInfo,
      userInfoChecked,
      chatHistory
    },
    data() {
      return {
        jsonData:{},
        status:'',
        checkStatus:'',
        checkParams: {
          orderId: this.$route.params.id,
          token: getToken(),
        },
        rejctParams:{
          orderId: this.$route.params.id,
          reason: "",
          type: "rejct",
          token: getToken(),
        },
        dialogFormVisible: false,
        statusChangeParams: {
          orderId: "",
          type: "",
          moneyFormat: null,
          money: 0,
          remark: "",
          token: getToken(),
        }

      };
    },
    methods: {
      initData() {
        serviceBuyDetail({
          orderId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.status = json.data.afterSale.checkStatus.value;
            this.checkStatus = json.data.afterSale.checkStatus.text;
            console.log(this.status);
            console.log(this.checkStatus);
            this.jsonData = json.data
            console.log(this.jsonData,"this.data");
          }
        })
      },
      statusChangeSubmit() {
        this.statusChangeParams.money = this.statusChangeParams.moneyFormat * 100;
        serviceAcceptAfterSale(this.statusChangeParams).then(res => {
          if (res.status === 200) {
            this.$message.success("操作成功！");
            this.dialogFormVisible = false
          }
        });
      },
      changeStatus() {
        this.statusChangeParams.orderId = this.$route.params.id;
        this.dialogFormVisible = true;
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      reject() {
        this.$prompt('请输入驳回理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s|\S]{1,}$/,
          inputErrorMessage: '理由不能为空'
        }).then(({value}) => {
          this.rejctParams.reason = value;
          serviceRejectAfterSale(this.rejctParams).then(json => {
            if (json.status ===200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });

            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },
      //审核
      openDialog(data) {
        this.checkParams.orderId = data.id;
        this.$confirm("确认售后审核?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            serviceAcceptAfterSale(this.checkParams).then(res => {
              if (res.status === 200) {
                this.$message.success("同意审核！");
                this.getList();
              }
            });
          })
          .catch(() => {
            this.checkParams.orderId = "";
          });
      },
      pass() {
        this.$confirm("确认售后审核通过?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            serviceAcceptAfterSale(this.checkParams).then(res => {
              if (res.status === 200) {
                this.$message.success("同意审核！");
                this.getList();
              }
            });
          })
          .catch(() => {
            this.checkParams.orderId = "";
          });
      },


    },
    mounted() {
      this.initData();
    }
  };
</script>
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .serviceDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .serviceDetail .el-textarea {
    width: 86%;
  }

  .serviceDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .serviceDetail {
    background: rgba(245, 246, 250, 0.61);
    /*min-height: 100vh;*/
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333333;
      padding: 0 24px 0 20px;
      font-size: 15px;
      .back {
        color: #333333;
        cursor: pointer;
        font-weight: bold;
      }
      .right {
        display: flex;
        .btn {
          color: #F65860;
          cursor: pointer;
        }
        .reject {
          color: #5BC0DF;
        }
        .pass {
          margin-left: 30px;
        }
        .green{
          color: green;
        }
        .red{
          color: red;
        }
      }

    }
    .content {
      /*background: white;*/
      min-height: calc(100vh - 140px);
      margin: 20px;
      display: flex;
      justify-content: space-between;
      .left {
        width: 60%;
        background: #ffffff;
      }
      .right {
        background: #ffffff;
        width: 39%;
      }
    }

  }
</style>
