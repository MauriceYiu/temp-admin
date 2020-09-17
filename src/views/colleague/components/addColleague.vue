<template>
  <div class="addColleague">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="同事姓名" required>
        <el-input
          style="width:600px;"
          maxlength="10"
          v-model="formParams.trueName"
          placeholder="请输入同事姓名，10字以内"
        />
      </el-form-item>
      <el-form-item label="性别" required>

        <el-select
          class="filter-item"
          style="width:600px;"
          v-model="formParams.gender"
          placeholder="请选择"
          @change="genderChange"
        >
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="登录账号" required>
        <el-input
          style="width:600px;"
          v-model="formParams.mobile"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="初始密码" required>
        <el-input
          minlength="6"
          maxlength="12"
          style="width:600px;"
          v-model="formParams.password"
          placeholder="请输入6到12位密码"
        />
      </el-form-item>
      <el-form-item label="职称">
        <el-input
          minlength="2"
          maxlength="10"
          style="width:600px;"
          v-model="formParams.jobPosition"
          placeholder="请输入职称，2到10个字"
        />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="形象封面">
        <el-upload
          class="avatar-uploader"
          :http-request="UploadCoverImage"
          action=""
          :show-file-list="false">
          <img v-if="formParams.trueAvatar" :src="formParams.trueAvatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="所属部门" required>

        <el-select
          class="filter-item"
          style="width:600px;"
          v-model="formParams.roleGroupId"
          placeholder="请选择"
          @change="typeChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.typeId"
            :label="item.name"
            :value="item.typeId"
          ></el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="个人简介">
        <el-input
          type="textarea"
          style="width:600px;height: 180px"
          v-model="formParams.intro"
          placeholder="请输入个人简介，120字以内"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="info"
          @click="submitForm"
        >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {
    userEdit,
    userDetail,
  } from "../../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, isMobile, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "addColleague",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        genderOptions: [
          {
            value: "male",
            text: "男",
          }, {
            value: "female",
            text: "女",
          },
        ],
        typeOptions: types.course,
        tags: '',
        dialogVisible: false,
        total: 0,
        page: 1,
        tableStatus: false,
        activeName: "msg",
        value: "",
        tableKey: 0,
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        uploadImages: [],
        formParams: {
          enable: true,
          gender: "male",   //male男, female女
          jobPosition: "",
          mobile: "",
          password: "",
          roleGroupId: null,
          token: getToken(),
          trueAvatar: "",
          trueName: "",
          intro: "",
          userId: 0,
        },
      };
    },
    methods: {
      genderChange(value) {
        this.formParams.gender = value;
      },
      typeChange(value) {
        this.formParams.roleGroupId = value;
      },
      UploadCoverImage(file) {
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
          this.formParams.trueAvatar = result.url
        })
      },
      initData() {
        userDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.enable = json.data.enable;
            this.formParams.gender = json.data.gender;
            this.formParams.jobPosition = json.data.jobPosition;
            this.formParams.mobile = json.data.mobile;
            this.formParams.password = json.data.password;
            this.formParams.roleGroupId = json.data.roleGroupId;
            this.formParams.trueAvatar = json.data.trueAvatar;
            this.formParams.trueName = json.data.trueName;
            this.formParams.intro = json.data.intro;
            this.formParams.userId = json.data.id;
          }
        });


      },
      submitForm() {
        if (!this.formParams.trueName) {
          this.$message({
            message: "请输入同事姓名",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.gender) {
          this.$message({
            message: "请选择性别",
            type: "error"
          });
          return false;
        }
        if (!isMobile(this.formParams.mobile)) {
          this.$message({
            message: "请输入正确的手机号码",
            type: "error"
          });
          return false;
        }
        if (this.formParams.password.length < 6 || this.formParams.password.length > 12) {
          this.$message({
            message: "请输入6到12位密码",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.jobPosition) {
          this.$message({
            message: "请输入职称",
            type: "error"
          });
          return false;
        }


        if (!this.formParams.trueAvatar) {
          this.$message({
            message: "请上传形象封面",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.roleGroupId) {
          this.$message({
            message: "请选择所属部门",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入个人简介",
            type: "error"
          });
          return false;
        }

        this.loading = true;

        userEdit(this.formParams).then(json => {
          this.loading = false;
          if(json.status === 200 ){
          this.$message({
            message: "保存成功！",
            type: json.status === 200 ? "success" : "error"
          });

          this.formParams = {
            enable: true,
            gender: "male",   //male男, female女
            jobPosition: "",
            mobile: "",
            password: "",
            roleGroupId: null,
            token: getToken(),
            trueAvatar: "",
            trueName: "",
            intro: "",
            userId: 0,
          }
        }


        });
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

  textarea {
    min-height: 150px;
  }
</style>
<style lang="scss" scoped>
  .addColleague {
    padding: 15px;
    .filter-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .hiderow {
      visibility: hidden;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .logo {
      width: 60px;
    }
    .paginationBox {
      text-align: right;
      margin-top: 60px;
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
