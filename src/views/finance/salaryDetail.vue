<template>
  <div class="salaryDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="salaryExport">导出</div>
    </div>
    <div class="content">
      <div class="filter-container">
        <div class="left">
          薪资明细
        </div>
        <div class="right"></div>
      </div>
      <div class="data">
        <div class="left">
          <div class="item">提成<span>{{ data.divide | showDecimal }}元</span></div>
          <div class="item">基本薪资<span>{{ data.base | showDecimal }}元</span></div>
          <div class="item">奖励<span>{{ data.reward | showDecimal }}元</span></div>
          <div class="item">扣罚<span>{{ data.fine | showDecimal }}元</span></div>
        </div>
        <div class="right">
          {{data.createTime | parseTime('{y}/{m}/{d}')}}-{{(data.createTime + 7*24*60*60 - 1) | parseTime('{y}/{m}/{d}')}}
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
        <el-table-column align="center" label="客户">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册号码">
          <template slot-scope="scope">
            <span>{{scope.row.userAccount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提成时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提成类型">
          <template slot-scope="scope">
            <span>{{scope.row.type.text}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="提成细则">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.id}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="提成比例">
          <template slot-scope="scope">
            <span>{{scope.row.ratio}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提成金额">
          <template slot-scope="scope">
            <span>{{scope.row.divide | showDecimal}} </span>
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
</template>

<script>

  import {
    staffCustomersDynamics
  } from "../../api/user";

  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal, isMobile} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "salaryDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        total: 0,
        page: 1,
        list: [],
        data:{},
        listLoading: false,
        loading: false,
        listQuery: {
          limit: 10,
          page: 0,
          // startTime: 0,
          // endTime: 0,
          salaryId: this.$route.query.id,
          token: getToken(),
        }
      };
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        this.getList()
      },
      salaryExport() {
        let url ="http:"+ window.API_BASE_URI + "/api/v1" + '/salary/export?token='+ encodeURIComponent(getToken());
        // console.log(url,"url");
        window.open(url, '_blank')
      },
      // 列表
      getList() {
        this.listLoading = true;
        staffCustomersDynamics(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      back(){
        this.$router.go(-1);//返回上一层
      },

    },
    mounted() {
      this.getList()
      if( this.$route.query.data){
        this.data = this.$route.query.data
        console.log(this.data,'this.data ');
      }
    }
  };
</script>
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
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
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }

  .avatar {
    width: 70px;
    height: 70px;
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

  .salaryDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .salaryDetail .el-textarea {
    width: 86%;
  }

  .salaryDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .salaryDetail {
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
        font-size: 15px;
        font-weight: bold;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .content {
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      .filter-container {
        display: flex;
        justify-content: space-between;
        background: white;
        height: 60px;
        padding: 0 20px;
        border-bottom: 1px solid #f2f2f2;
        align-items: center;
        .left {
          color: #409EFF;
          font-size: 14px;
        }
      }
      .data {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
        height: 80px;
        padding: 0 20px;
        .left {
          display: flex;
          .item {
            font-size: 14px;
            margin-right: 70px;
            color: rgba(102, 102, 102, 0.86);
            span {
              color: #409EFF;
              margin-left: 18px;
            }
          }

        }
        .right {
          color: rgba(102, 102, 102, 0.86);
          font-size: 14px;
        }

      }

    }
    .el-table{
      min-height: calc(100vh - 340px);

    }
    .paginationBox{
      margin: 10px auto;
      text-align: center;
    }

  }
</style>
