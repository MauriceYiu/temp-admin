<template>
  <div class="roleView2">
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
    </div>
  </div>
</template>

<script>

  import {userDetail,list} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "roleView2",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        list: [],
        total: 0,
        role: '',
        page: 1,
        listQuery: {
          app: 'app',
          // limit: 10,
          // page: 0,
          // enable: 1,
          // jobLeave: 1,
          inviteUserId: null,
          // role: '',
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
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.user = json.data;
          }
        });
      },
      getList() {
        list(this.listQuery).then(json => {
          if (json.status === 200) {
            this.list = json.data;
            this.total =json.total;
          }
        });
      },
    },
    mounted() {
      if (parseInt(this.$route.params.id) > 0) {
        this.listQuery.inviteUserId = parseInt(this.$route.params.id)
        this.initData();
        this.getList();
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

  .roleView2 .main .content .el-form-item__content {
    margin-left: 180px !important;
  }

  .roleView2 .main .content .el-form-item__label {
    color: #999999 !important;
  }
</style>
<style lang="scss" scoped>
  .roleView2 {

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
        background: #ffffff;
        width: 100%;
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
    }

  }
</style>
