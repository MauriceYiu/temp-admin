<template>
  <div class="guestDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">提交</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <div class="imgsWrap" style="display: flex">
          <el-form-item style="margin-bottom: 40px;" prop="title" label="上传头像">
            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <img v-if="formParams.avatar" :src="formParams.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item label="姓名">
          <el-input
            style="width:700px;"
            v-model="formParams.name"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="头衔">
          <el-input
            style="width:700px;"
            v-model="formParams.jp"
            placeholder="请输入职称"
          />
        </el-form-item>
        <el-form-item label="标签">
        <el-tag
        :key="tag"
        v-for="tag in formParams.tags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
        </el-tag>
        <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        <span style="margin-left: 10px;color: #666666">限5个</span>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-checkbox v-model="formParams.enable"></el-checkbox>
        </el-form-item>
        <el-form-item label="老师简介" prop="intro">
          <el-input
            style="width:700px;"
            v-model="formParams.intro"
            :autosize="{ minRows: 4, maxRows: 10}"
            type='textarea'
            placeholder="请输入老师简介"
          />
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>

  import {
    atcEdit,
    atcDetail,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "guestDetail",
    directives: {
      waves,
    },
    data() {
      return {
        valuePicker_sign: '',  //签到时间
        pickerValue: '', //活动时间
        dialogMapVisible: false,
        uploadImages: [],
        uploadUrl: "",//你要上传视频到你后台的地址
        videoFlag: false, //是否显示进度条
        videoUploadPercent: "", //进度条的进度，
        isShowUploadVideo: false, //显示上传按钮
        inputVisible: false,
        inputValue: '',
        formParams: {
          avatar: "",
          enable: true,
          jp: "",
          name: "",
          intro: "",
          tags: [],
          teacherId: 0,
          token: getToken(),
        },
        loading: false,
      };
    },
    methods: {

      showInput() {
        if (this.formParams.tags.length < 5) {
          this.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        } else {
          this.inputVisible = false;
        }

      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.formParams.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
        console.log(this.formParams.tags);
      },
      handleClose(tag) {
        // console.log(tag);
        this.formParams.tags.splice(this.formParams.tags.indexOf(tag), 1);
        // console.log(this.formParams.tags);
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
          this.formParams.avatar = result.url
        })
      },

      Upload(file) {
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
          this.uploadImages.push({
            name: file.file.name,
            url: result.url
          });
        })
      },
      initData() {
        atcDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {
            this.formParams.avatar = json.data.avatar;
            this.formParams.enable = json.data.enable;
            this.formParams.jp = json.data.jp;
            this.formParams.name = json.data.name;
            this.formParams.tags = json.data.tags;
            this.formParams.intro = json.data.intro;
            this.formParams.teacherId = json.data.id;
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        });


      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.avatar) {
          this.$message({
            message: "请上传头像",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.name) {
          this.$message({
            message: "请输入姓名",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.jp) {
          this.$message({
            message: "请输入职称",
            type: "error"
          });
          return false;
        }
        if (this.formParams.tags.length === 0) {
          this.$message({
            message: "请至少输入一个标签",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "请输入老师简介",
            type: "error"
          });
          return false;
        }
        this.loading = true;

        atcEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "activity"
            })
            this.formParams = {
              avatar: "",
              enable: true,
              jp: "",
              name: "",
              intro: "",
              tags: [],
              teacherId: 0,
              token: getToken(),
            }
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
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

  .guestDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .guestDetail .el-textarea {
    width: 86%;
  }

  .guestDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .guestDetail {
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
