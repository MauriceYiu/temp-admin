<template>
  <div class="roleView">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
    </div>
    <div class="main">
      <div class="content">
        <el-form class="form-container" label-width="154px">
          <el-form-item label="头像">
            <img class="avatar" style="width: 60px;height: 60px;border-radius: 50%" :src="user.extra.trueAvatar || ''">
          </el-form-item>
          <el-form-item label="角色分类">
            <span>{{user.role.text || '--'}}</span>
          </el-form-item>
          <el-form-item label="名称">
            <span>{{user.extra.roleName || '--'}}</span>
          </el-form-item>
          <el-form-item label="头衔">
            <span>{{user.extra.roleTitle || '--'}}</span>
          </el-form-item>
          <el-form-item label="每日限额">
            <span>{{user.extra.dayMaxService || '--'}}</span>
          </el-form-item>
          <el-form-item label="老师简介">
            <div>
              {{user.extra.roleIntro || '--'}}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="list">

        <div class="filter-container">
          <div class="left">服务客户</div>

          <div class="right">
            {{total}}人
          </div>
        </div>
        <el-table :data="list" row-key="id" style="width: 100%;">
          <el-table-column align="center" label="服务时间" >
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册手机号">
            <template slot-scope="scope">
              <span>{{scope.row.mobile || scope.row.userMobile}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="等级">
            <template slot-scope="scope">
              <span>{{vipString(scope.row.userRecharge)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间">
            <template slot-scope="scope">
              <span>{{scope.row.userRegisterTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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

  import {userDetail, chatCsEvaluates} from "../../api/user";
  import {serviceBuys} from '../../api/financeData'
  import {vipAll} from '../../api/settings'
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "roleView",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        vipData: [],
        list: [],
        total: 0,
        role: '',
        page: 1,
        listQuery: {
          app: 'app',
          teacherId: null,
          csId: null,
          token: getToken()
        },
        user: {
          role: {},
          extra: {}
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
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      initData() {
        userDetail({
          targetId: this.$route.query.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.user = json.data;
          }
        });
      },
      getList() {
        switch (this.role) {
          case "teacher":
            serviceBuys(this.listQuery).then(json => {
              if (json.status === 200) {
                this.list = json.data;
                this.total = json.total;
              }
            });
            break
          case "cs":
            chatCsEvaluates(this.listQuery).then(json => {
              if (json.status === 200) {
                this.list = json.data;
                this.total = json.total;
              }
            });
            break
        }
      },
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            this.vipData = json.data;
            this.getList()
          } else {

          }
        });
      },
      vipString(money) {
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            // console.log(-item.offset);
            if (money >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
    },
    mounted() {
      if (parseInt(this.$route.query.id) > 0) {
        this.listQuery.teacherId = parseInt(this.$route.query.id)
        this.listQuery.csId = parseInt(this.$route.query.id)
        this.role = this.$route.query.role
        this.initData();
        this.getVipList();
      }
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

  .roleView .main .content .el-form-item__content {
    margin-left: 180px !important;
  }

  .roleView .main .content .el-form-item__label {
    color: #999999 !important;
  }
</style>
<style lang="scss" scoped>
  .roleView {

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

    .main {

      margin: 20px;
      /*background: white;*/
      min-height: calc(100vh - 140px);
      display: flex;
      justify-content: space-between;

      .content {
        /*border: 1px solid red;*/
        width: 49%;
        background: #ffffff;

        .form-container {
          background: white;
          padding: 30px 0 100px;

        }

        .intro {
          border: 1px solid #f2f2f2;
          width: 70%;
          height: 100px;
          padding: 0 10px;
        }
      }

      .list {
        /*border:3px solid yellow;*/
        width: 50%;
        background: #ffffff;

        .filter-container {
          padding: 0 20px;
          height: 60px;
          border-bottom: 1px solid #f2f2f2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;

          .left {
            color: #1B9AF7;
          }

          .right {
            color: #F65860;
            cursor: pointer;
          }
        }

        .paginationBox {
          margin: 10px auto;
          text-align: center;
        }
      }
    }

  }
</style>
