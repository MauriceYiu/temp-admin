<template>
  <div class="liveBuysClientList">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <!--<div class="save" @click="salaryExport">导出</div>-->
    </div>
    <div class="content">
      <div class="client">
        <div class="filter-container">
          <div class="left">
            <span class="text">购买名单</span>
            <span>总收入 {{money | showDecimal}}币</span>
          </div>
          <div class="right">
            <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                      placeholder="搜索你想要的内容"
                      v-model="listQuery.keyword">
            </el-input>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
              搜索
            </el-button>
          </div>
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

          <el-table-column align="center" label="购买人姓名">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系电话">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="价格">
            <template slot-scope="scope">
              <span>{{scope.row.price | showDecimal}}</span>
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="留言">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{scope.row.userName}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column align="center" label="状态">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{scope.row.userName}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->

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
    liveDetail,
  } from "../../api/content";
  import {
    liveBuys,
  } from "../../api/financeData";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "liveBuysClientList",
    directives: {
      waves,
    },
    data() {
      return {
        adDelParams: {
          targetId: 0,
          token: getToken(),
        },
        enableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        money: 0,
        total: 0,
        page: 1,
        list: [],
        listQuery: {
          limit: 10,
          liveId: this.$route.params.id,
          page: 0,
          keyword:'',
          token: getToken(),
        }

      };
    },
    methods: {

      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
    //   live/buys
    // 直播购买列表
      getList() {
        this.listLoading = true;
        liveBuys(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
            this.money = json.data[0] ? json.data[0].price * this.total :0

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

  .liveBuysClientList .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .liveBuysClientList .el-textarea {
    width: 86%;
  }

  .liveBuysClientList .time .el-form-item__content {
    margin-left: 16px !important;
  }

  .el-table::before {
    background: none;
  }

  .liveBuysClientList .filter-container .filter-item {
    margin-bottom: 0;
  }

</style>
<style lang="scss" scoped>
  .liveBuysClientList {
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
