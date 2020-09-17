<template>
  <div class="liveDatingClientList">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <!--<div class="save" @click="salaryExport">导出</div>-->
    </div>
    <div class="content">
      <div class="client">
        <div class="filter-container">
          <div class="left">
            <span class="text">邀约名单</span>
            <span>总收入 {{income | showDecimal}}币</span>
          </div>
          <div class="right">
            <!--<el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"-->
            <!--placeholder="搜索你想要的内容"-->
            <!--v-model="listQuery.keyword">-->
            <!--</el-input>-->
            <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
            <!--搜索-->
            <!--</el-button>-->
          </div>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%">

          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.userId}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="预约人姓名">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系电话">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否购买">
            <template slot-scope="scope">
              <span>{{scope.row.bought?'是':'否'}}</span>
            </template>
          </el-table-column>

        </el-table>
      </div>

    </div>
  </div>
</template>

<script>

  import {
    liveDetail,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from "@/utils/auth";

  export default {
    name: "liveDatingClientList",
    directives: {
      waves,
    },
    data() {
      return {
        income: 1,
        list: []
      }
    },
    methods: {
      back() {
        this.$router.go(-1);//返回上一层
      },
      // 邀约的列表
      getList() {
        liveDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.income = json.data.buyUser * json.data.price;
            if (json.data.inviteUsers) {
              this.list = json.inviteUsers
            }
          }
        });
      }
    },
    mounted() {
      this.getList()
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

  .liveDatingClientList .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .liveDatingClientList .el-textarea {
    width: 86%;
  }

  .liveDatingClientList .time .el-form-item__content {
    margin-left: 16px !important;
  }

  .el-table::before {
    background: none;
  }

  .liveDatingClientList .filter-container .filter-item {
    margin-bottom: 0;
  }

</style>
<style lang="scss" scoped>
  .liveDatingClientList {
    /*background: rgba(245, 246, 250, 0.61);*/
    background: rgb(245, 246, 250);
    min-height: 100vh;

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
        font-size: 15px;
        font-weight: bold;
      }

      .save {
        color: #F65860;
        cursor: pointer;
      }
    }

    .content {
      border: 1px solid #FFFFFF;
      min-height: 100vh;
      margin: 20px;
      background: white;

      .form-container {
        background: white;
        padding: 30px 0 100px;
      }

      & > .client {
        border: 1px solid #f2f2f2;
        width: 50%;
        margin: 50px auto 0;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .filter-container {
          display: flex;
          justify-content: space-between;
          background: white;
          padding: 0 20px;
          height: 60px;
          border-bottom: 1px solid #f2f2f2;
          align-items: center;

          .left {
            font-size: 14px;

            .text {
              color: #409EFF;
              margin-right: 30px;
            }

          }
        }

        .action {
          display: flex;
          justify-content: center;

          .status {
            display: flex;
            align-items: center;
            margin-right: 20px;

            span {
              margin-right: 6px;
            }
          }
        }

        .el-table {
          min-height: calc(100vh - 310px);

        }

        .paginationBox {
          margin: 10px auto;
          text-align: center;
        }
      }
    }

  }
</style>
