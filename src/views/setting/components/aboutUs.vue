<template>
  <div class="aboutUs">
    <!--<div class="head">-->
    <!--<div class="back">-->
    <!--帮助文档-->
    <!--<div class="line"></div>-->
    <!--</div>-->
    <!--<div class="save" @click="addTag(0)">新建</div>-->
    <!--</div>-->
    <div class="content">
      <div class="client">
        <div class="filter-container">
          <div class="left">
            全部反馈
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

          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="提交人">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提交账号">
            <template slot-scope="scope">
              <span>{{scope.row.userAccount}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="等级">
            <template slot-scope="scope">
              <span>{{vipString(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="意见内容">
            <template slot-scope="scope">
              <span>{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.replyTime > 0 ? '已处理 ':'未处理'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            style="color:#5BC0DF;"
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <div class="action">
                <div class="status">
                  <span v-if="scope.row.replyTime > 0">已处理</span>
                  <span v-if="scope.row.replyTime === 0">未处理</span>
                  <el-switch
                    v-if="!scope.row.replied"
                    @change="(value)=>{changeStatus(value,scope.row)}"
                    style="display: block"
                    v-model="scope.row.replied"
                    active-color="#13ce66">
                  </el-switch>
                </div>
                <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>
                <!--<el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">查看</el-button>-->

              </div>

            </template>
          </el-table-column>
        </el-table>

        <div class="paginationBox">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  import {feedbackDel, feedbackList, feedbackReply, vipAll} from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";


  export default {
    name: "aboutUs",
    directives: {
      waves,
    },
    data() {
      return {
        delParams: {
          targetId: 0,
          token: getToken(),
        },
        vipData: [],
        enableParams: {
          feedbackId: 0,
          reply: true,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        listQuery: {
          limit: 10,
          page: 0,
          token: getToken(),
        }

      };
    },
    methods: {
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
          } else {

          }
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },

      vipString(item) {
        console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (item.userRecharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      //删除
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该条反馈, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            feedbackDel(this.delParams).then(res => {
              // console.log(res,"res");
              if (res.status === 200) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.delParams.targetId = "";
          });
      },

      addTag(data) {
        this.$router.push({
          name: "helpDetail", params: {
            id: data
          }
        })
      },
      changeStatus(value, item) {
        this.enableParams.feedbackId = item.id
        this.enableParams.reply = "ignore"
        feedbackReply(this.enableParams).then(json => {
          if (json.status === 200) {
            item.replyTime = 1;
            item.replied = true;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },
      // 列表
      getList() {
        this.listLoading = true;
        feedbackList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.list.forEach((item, index) => {
              item.replied = item.replyTime > 0;
            });
            this.total = json.total
          } else {

          }
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        // sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
    },
    mounted() {
      setTimeout(() => {
        this.getList()
      }, 500)
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

  .aboutUs .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .aboutUs .el-textarea {
    width: 86%;
  }

  .aboutUs .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .aboutUs {
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 27px 0 40px;
      .back {
        color: #000000;
        font-size: 14px;
        cursor: pointer;
        line-height: 46px;
        position: relative;
        /*border-bottom: 2px solid #5BC0DF;*/
      }
      .line {
        width: 32px;
        height: 2px;
        background: #5BC0DF;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .content {
      background: white;
      min-height: calc(100vh - 140px);
      margin: 20px;
      & > .client {
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .filter-container {
          display: flex;
          justify-content: space-between;
          background: white;
          padding: 20px;
          border-bottom: 1px solid #f2f2f2;
          align-items: center;
          .left {
            color: #409EFF;
            font-size: 14px;
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
          min-height: calc(100vh - 260px);

        }
        .paginationBox {
          margin: 10px auto;
          text-align: center;
        }
      }
    }

  }
</style>
