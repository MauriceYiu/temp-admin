<template>
  <div class="customerServiceDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <div class="imgsWrap" style="display: flex">
          <el-form-item style="margin-bottom: 40px;" prop="title" label="上传头像">
            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <img v-if="formParams.roleAvatar" :src="formParams.roleAvatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item label="客服名称">
          <el-input
            style="width:600px;"
            v-model="formParams.roleName"
            maxlength="12"
            placeholder="请输入客服名称"
          />
        </el-form-item>


        <el-form-item label="客服头衔">
          <el-input
            style="width:600px;"
            v-model="formParams.roleTitle"
            maxlength="12"
            placeholder="请输入客服头衔"
          />
        </el-form-item>

        <el-form-item label="客服简介">
          <el-input
            style="width:600px;"
            type="textarea"
            :rows="4"
            v-model="formParams.roleIntro"
            placeholder="请输入客服简介"
          />
        </el-form-item>

        <!--<el-form-item label="是否启用" prop="enable">-->
        <!--<el-checkbox v-model="formParams.enable"></el-checkbox>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>

  import {
    pkEdit,
    serviceDetail,
  } from "../../api/business";
  import {
    userUpdateRoleInfo,
    userTeacher,
    userDetail,
  } from "@/api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "customerServiceDetail",
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
        tableKey: 0,
        list: [],
        departmentOptions: [],
        listLoading: false,
        loading: false,
        dialogTableVisible: false,
        formParams: {
          dayMaxService: 0,
          roleAvatar: "",
          roleIntro: "",
          roleName: "",
          roleTitle: "",
          targetId: 0,
          token: getToken(),
        },
      };
    },
    methods: {
      back() {
        this.$router.go(-1);//返回上一层
      },
      UploadCoverImage(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'JPG', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        // console.log(file.file);
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.roleAvatar = result.url
        })
      },
      handleChange() {

      },
      initData() {
        userDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {
            this.formParams.targetId = json.data.id;
            this.formParams.roleAvatar = json.data.avatar;
            this.formParams.dayMaxService = json.data.dayMaxService;
            this.formParams.roleIntro = json.data.roleIntro;
            this.formParams.roleName = json.data.roleName;
            this.formParams.roleTitle = json.data.roleTitle;
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        });


      },
      tagSubmitForm() {
        if (!this.formParams.roleAvatar) {
          this.$message({
            message: "请上传头像",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.roleName) {
          this.$message({
            message: "请输入客服名称",
            type: "error"
          });
          return false;
        }


        if (!this.formParams.roleTitle) {
          this.$message({
            message: "请输入客服头衔",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.roleIntro) {
          this.$message({
            message: "请输入客服简介",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        userUpdateRoleInfo(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
          this.$message({
            message: "保存成功！",
            type: json.status ? "success" : "error"
          });

          this.$router.push({
            name: "businessProduct"
          })
          this.formParams = {
            dayMaxService: 0,
            roleAvatar: "",
            roleIntro: "",
            roleName: "",
            roleTitle: "",
            targetId: 0,
            token: getToken(),
          }
        }else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
        }

        })
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
    }
  };
</script>
<style>
  .customerServiceDetail .el-upload {
    width: 70px;
    height: 70px;
    display: block;
    border-radius: 50%;
    border: none;
  }
  .customerServiceDetail .avatar {
    width: 70px;
    height: 70px;
    display: block;
    border-radius: 50%;
  }

</style>
<style lang="scss" scoped>
  .customerServiceDetail {
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
      /*background: rgba(245, 246, 250, 0.61);*/
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      .form-container {
        background: white;
        padding: 30px 0 100px;

      }
    }

    .imbox {
      display: flex;
      justify-content: center;
      .imgWrap {
        margin-right: 6px;
        img {
          width: 60px;
        }
      }
      .imgWrap:last-child {
        margin-right: 0;
      }
    }
  }
</style>
