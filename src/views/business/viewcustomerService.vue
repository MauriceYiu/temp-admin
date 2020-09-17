<template>
  <div class="viewcustomerService">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <!--<div class="save" @click="tagSubmitForm">保存</div>-->
    </div>
    <div class="container">
      <div class="left">
        <div class="item">
          <div class="label">头像</div>
          <div class="imgWrap">
            <img :src="avatar" alt="">
          </div>
        </div>
        <div class="item">
          <div class="label">所属部门</div>
          <div class="right">
           {{ departmentName }}
          </div>
        </div>
        <div class="item">
          <div class="label">老师名称</div>
          <div class="right">
            {{ roleName }}
          </div>
        </div>
        <div class="item">
          <div class="label">老师头衔</div>
          <div class="right">
            {{ roleTitle }}
          </div>
        </div>
        <div class="item">
          <div class="label">每日限额</div>
          <div class="right">
            {{ dayMaxService }}
          </div>
        </div>
        <div class="item">
          <div class="label">老师简介</div>
          <div class="right">
            {{ roleIntro }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <h5>服务客户</h5>
          <h5 class="people">{{service}}人</h5>
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
          <el-table-column align="center" label="注册手机号">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="等级">
            <template slot-scope="scope">
              <span>{{vipString(scope.row)}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="注册时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    serviceBuys,
    serviceDetail,
  } from "../../api/financeData";
  import {
    chatCsEvaluates,
  } from "../../api/business.js";
  import {
    userUpdateRoleInfo,
    userTeacher,
    userDetail,
  } from "@/api/user";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "viewcustomerService",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        total: 0,
        page: 1,
        service: 0,
        list: [],
        listQuery: {
          limit: 10,
          page: 0,
          csId:this.$route.params.id,
          token: getToken(),
        },
        vipData: [],
        listLoading: false,
        loading: false,
        dialogTableVisible: false,
        departmentName: "",
        dayMaxService: 0,
        avatar: "",
        roleIntro: "",
        roleName: "",
        roleTitle: "",
      };
    },
    methods: {
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
            console.log(this.vipData,"this.vipData");
          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      vipString(item) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (item.price >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        this.getList()
      },
      // 列表
      getList() {
          this.listLoading = true;
        chatCsEvaluates(this.listQuery).then(json => {
            this.listLoading = false;
            if (json.status === 200) {
              this.list = json.data;
              this.total = json.total
            } else {
              this.$message({
                message: json.message,
                type: "error"
              });
            }
          })
      },
      initData() {
        userDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {
            this.targetId = json.data.id;
            this.avatar = json.data.avatar;
            this.dayMaxService = json.data.extra.dayMaxService;
            this.roleIntro = json.data.extra.roleIntro;
            this.roleTitle = json.data.extra.roleTitle;
            this.roleName = json.data.extra.roleName;
          }
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      this.getVipList();
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.getList();
        this.initData();
      }
    }
  };
</script>
<style>

  /*.avatar-uploader .el-upload {*/
  /*border: 1px dashed #d9d9d9;*/
  /*border-radius: 50%;*/
  /*cursor: pointer;*/
  /*position: relative;*/
  /*overflow: hidden;*/
  /*}*/

  /*.avatar-uploader .el-upload:hover {*/
  /*border-color: #409EFF;*/
  /*}*/

  /*.avatar-uploader-icon {*/
  /*font-size: 28px;*/
  /*color: #8c939d;*/
  /*width: 70px;*/
  /*height: 70px;*/
  /*line-height: 70px;*/
  /*text-align: center;*/
  /*}*/
  .viewcustomerService .el-upload {
    width: 70px;
    height: 70px;
    display: block;
    border-radius: 50%;
    border: none;
  }

  .viewcustomerService .avatar {
    width: 70px;
    height: 70px;
    display: block;
    border-radius: 50%;
  }

</style>
<style lang="scss" scoped>
  .viewcustomerService {
    background: rgba(245, 246, 250, 0.61);
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333333;
      padding: 0 50px 0 20px;
      .back {
        color: #333333;
        cursor: pointer;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .container {
      margin: 20px 20px 0;
      display: flex;
      justify-content: space-between;
      height: calc(100vh - 120px);
      .left {
        background: #ffffff;
        width: 40%;
        padding: 50px 20px 0;
        box-sizing: border-box;
        .item {
          display: flex;
          margin-bottom: 50px;
          font-size: 14px;
          .label {
            width: 80px;
            display: flex;
            align-items: center;
            color: #999999;
          }
          .imgWrap {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
            }
          }
        }

      }
      .right {
        background: #ffffff;
        width: 58%;
        .top {
          display: flex;
          font-size: 15px;
          justify-content: space-between;
          padding: 0 30px;
          box-sizing: border-box;
          border-bottom: 1px solid #f2f2f2;
          h5 {
            color: #5BC0DF;
            font-size: 15px;
          }
          .people {
            color: #F65860;
          }
          /*border-bottom: 1px solid #cccccc;*/
        }
      }
    }

    .paginationBox {
      text-align: right;
      margin-top: 60px;
    }

  }
</style>
