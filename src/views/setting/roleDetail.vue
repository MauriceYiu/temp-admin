<template>
  <div class="roleDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">更新</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item style="margin-bottom: 40px;font-weight: bold" prop="title" label="编辑角色" class="editRole">
          <!--<h5>编辑角色</h5>-->
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="formParams.role"
            placeholder="请选择角色"
            @change="typeChange"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>

        </el-form-item>
        <div v-if="formParams.role === 'teacher' || formParams.role === 'cs' || formParams.role === 'afterSale'">
          <el-form-item style="margin-bottom: 40px;" prop="title" label="头像">
            <el-upload
              class="avatar-uploader"
              :http-request="Uploadpicture"
              action=""
              :show-file-list="false">
              <img v-if="formParams.roleAvatar" :src="formParams.roleAvatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="名称">
            <el-input
              style="width:600px;"
              v-model="formParams.roleName"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item label="头衔">
            <el-input
              style="width:600px;"
              v-model="formParams.roleTitle"
              placeholder="请输入头衔"
            />
          </el-form-item>
          <el-form-item label="每日限额" v-if="formParams.role === 'teacher'">
            <el-input
              type="number"
              style="width:600px;"
              v-model="formParams.dayMaxService"
              placeholder="请输入每日限额，0为不限"
            />
          </el-form-item>
          <el-form-item label="介绍">
            <el-input
              style="width: 600px"
              type="textarea"
              :rows="4"
              v-model="formParams.roleIntro"
              placeholder="输入介绍内容"
            />
          </el-form-item>

        </div>



      </el-form>
    </div>

  </div>
</template>

<script>

  import {userDetail, userUpdateRoleInfo} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "roleDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        urlLabel: "链接",
        placeholder: "请输入广告链接地址",
        uploadImages: [],
        // 广告跳转类型：none不跳转，url链接，tool辅助工具，guide智能攻略，course课程，live直播，activity线下活动
        typeOptions: [
          {
            key: "salesman",
            name: "业务员"
          },
          {
            key: "admin",
            name: "管理员"
          },
          {
            key: "teacher",
            name: "业务老师"
          },
          {
            key: "official",
            name: "官方账号"
          },
          {
            key: "cs",
            name: "客服人员"
          },
          {
            key: "afterSale",
            name: "售后人员"
          },
          {
            key: "operation",
            name: "运营人员"
          },
          {
            key: "administrative",
            name: "行政专员"
          },
        ],
        loading: false,
        formParams: {
          targetId: 0,
          role: "",
          roleAvatar: "",
          roleName: "",
          roleTitle: "",
          roleIntro: "",
          dayMaxService: 0,
          token: getToken(),
        },
      };
    },
    methods: {
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },

      typeChange() {
        this.formParams.roleAvatar = ""
        this.formParams.roleName = ""
        this.formParams.roleTitle = ""
        this.formParams.roleIntro = ""
        this.formParams.dayMaxService = 0
      },

      Uploadpicture(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp']
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
      initData() {
        userDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.targetId = json.data.id;
            this.formParams.role = json.data.role.value;
            this.formParams.roleAvatar = json.data.extra.roleAvatar;
            this.formParams.roleName = json.data.extra.roleName;
            this.formParams.roleTitle = json.data.extra.roleTitle;
            this.formParams.roleIntro = json.data.extra.roleIntro;
            this.formParams.dayMaxService = json.data.extra.dayMaxService || 0;
          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        if(this.formParams.role === 'teacher' || this.formParams.role === 'cs' ){
          if (!this.formParams.roleAvatar) {
            this.$message({
              message: "请上传头像",
              type: "error"
            });
            return false;
          }
          if (!this.formParams.roleName) {
            this.$message({
              message: "请输入名称",
              type: "error"
            });
            return false;
          }
          if (!this.formParams.roleTitle) {
            this.$message({
              message: "请输入头衔",
              type: "error"
            });
            return false;
          }
          if (!this.formParams.roleIntro) {
            this.$message({
              message: "请输入排序",
              type: "error"
            });
            return false;
          }
        }

        // if(this.formParams.role === 'teacher' ){
        //   if (!this.formParams.dayMaxService) {
        //     this.$message({
        //       message: "请输入每日限额",
        //       type: "error"
        //     });
        //     return false;
        //   }
        // }

        this.loading = true;
        userUpdateRoleInfo(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });
            this.$router.go(-1);//返回上一层
          }

        });
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

</style>
<style lang="scss" scoped>
  .roleDetail {
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
