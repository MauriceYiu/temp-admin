<template>
  <div class="rewardDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="salaryExport">导出</div>
    </div>
    <div class="content">
      <div class="client">
        <div class="filter-container">
          <div class="left">
             打赏明细
          </div>
          <!--<div class="right">-->
            <!--<el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"-->
            <!--placeholder="搜索你想要的内容"-->
            <!--v-model="listQuery.keyword">-->
            <!--</el-input>-->
            <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
            <!--搜索-->
            <!--</el-button>-->

          <!--</div>-->
        </div>




        <el-table
          :data="list"
          stripe
          v-if="hasPerm('business:newcomer:list')"
          style="width: 100%">

          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.userAccount}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="等级">
            <template slot-scope="scope">
              <span>{{vipString(scope.row)}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="打赏时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="打赏类型">
            <template slot-scope="scope">
              <span>{{scope.row.type.text}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="打赏金币">
          <template slot-scope="scope">
            <span>{{scope.row.amount | showDecimal}}</span>
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

  import {
    newsEnable,
    newsTop,
    newsDelete,
  } from "../../api/business.js";
  import {
    staffDynamics,
  } from "../../api/user.js";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "rewardDetail",
    directives: {
      waves,
    },
    data() {
      return {
        adDelParams:{
          targetId:0,
          token: getToken(),
        },
        enableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        vipData: [],
        listQuery: {
          limit: 10,
          salaryId: this.$route.params.id,
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
            this.getList()
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
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该条文档, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            newsDelete(this.adDelParams).then(res => {
              // console.log(res,"res");
              if (res.status ===200) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.adDelParams.targetId = "";
          });
      },

      addTag(data) {
        this.$router.push({
          name: "trainingDetail", params: {
            id: data
          }
        })
      },
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        newsEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          }
        })
      },
      changeTop(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        newsTop(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },
      salaryExport() {
        let url ="http:"+ window.API_BASE_URI + "/api/v1" + '/salary/export/bestow/detail?token='+ encodeURIComponent(getToken())+"&salaryId="+ this.$route.params.id;
        // console.log(url,"url");
        window.open(url, '_blank')
      },
      back(){
        this.$router.go(-1);//返回上一层
      },
      // 列表
      getList() {
        this.listLoading = true;
        staffDynamics(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
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
      this.getVipList()
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

  .rewardDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .rewardDetail .el-textarea {
    width: 86%;
  }

  .rewardDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
  .el-table::before{
    background: none;
  }
  .rewardDetail .filter-container .filter-item {
    margin-bottom: 0;
  }

</style>
<style lang="scss" scoped>
  .rewardDetail {
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
      min-height: 100vh;
      padding: 20px;
      .form-container {
        background: white;
        padding: 30px 0 100px;
      }
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
          padding: 0 20px;
          height: 60px;
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
