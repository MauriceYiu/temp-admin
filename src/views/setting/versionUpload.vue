<template>
  <div class="versionUpload">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="类型">
          <el-select
            class="filter-item"
            style="width: 300px"
            v-model="formParams.app"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>

        </el-form-item>


        <el-form-item label="平台">
          <el-select
            class="filter-item"
            style="width: 300px"
            v-model="formParams.platform"
            placeholder="请选择平台"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>

        </el-form-item>


        <el-form-item label="应用名称">
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            placeholder="请输入应用名称"
          />
        </el-form-item>

        <el-form-item label="版本名称">
          <el-input
            style="width:600px;"
            v-model="formParams.versionName"
            placeholder="请输入版本名称"
          />
        </el-form-item>

        <el-form-item label="版本号">
          <el-input
            style="width:600px;"
            v-model="formParams.version"
            placeholder="请输入版本号"
          />
        </el-form-item>
        <el-form-item label="应用地址">
          <el-input
            style="width:600px;"
            v-model="formParams.url"
            placeholder="请输入应用地址"
          />
          <div class="upload">点击上传

            <el-upload
              class="avatar-uploader"
              :http-request="UploadFile"
              action=""
              :show-file-list="false">
              <!--<img v-if="formParams.url" :src="formParams.url" class="avatar">-->
              <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
              <div class="inner"></div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="版本描述">
          <el-input
            style="width:600px;"
            v-model="formParams.detail"
            :autosize="{ minRows: 4, maxRows: 10}"
            type='textarea'
            placeholder="请输入版本描述"
          />
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>

  import {appVersionAdd,} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "versionUpload",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        // 广告类型：checkIn签到券，register注册券，issue发放券
        typeOptions: [
          {
            key: "app",
            name: "用户端"
          },
          {
            key: "staff",
            name: "员工端"
          },

        ],
        platformOptions: [
          {
            key: "android",
            name: "android"
          },
          {
            key: "ios",
            name: "ios"
          }
        ],
        loading: false,
        // app客户端App，staff员工端App
        formParams: {
          app: "",
          detail: "",
          name: "",
          platform: '',   //h5、android、ios、pc
          token: getToken(),
          url: "",
          version: null,
          versionName: "",
        },
      };
    },
    methods: {
      UploadFile(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        // 匹配 视频
        // var videolist = ['mp4', 'm2v', 'mkv'];
        // 匹配 音频
        // var radiolist = ['mp3', 'wav', 'wmv']
        // const names = ['video', 'mp4','mp3', 'avi', 'flv', 'wmv']
        const names = ['apk'];
        // const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          console.log(result.url, "result.url");
          this.formParams.url = result.url
        })
      },
      tagSubmitForm() {
        if (!this.formParams.app) {
          this.$message({
            message: "请选择类型",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.platform) {
          this.$message({
            message: "请选择平台",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.name) {
          this.$message({
            message: "请输入应用名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.versionName) {
          this.$message({
            message: "请输入版本名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.version) {
          this.$message({
            message: "请输入版本号",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.url) {
          this.$message({
            message: "请输入应用地址",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.detail) {
          this.$message({
            message: "请输入版本描述",
            type: "error"
          });
          return false;
        }
        appVersionAdd(this.formParams).then(json => {
          this.loading = false;
          // const json = response.data;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "otherSettiing"
            })
            this.formParams = {
              app: "",
              detail: "",
              name: "",
              platform: '',   //h5、android、ios、pc
              token: getToken(),
              url: "",
              version: null,
              versionName: "",
            }
          }

        });
      },
      back() {
        this.$router.go(-1);//返回上一层
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
  /*.avatar-uploader .el-upload {*/
    /*border: 1px dashed #d9d9d9;*/
    /*border-radius: 6px;*/
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
    /*width: 178px;*/
    /*height: 178px;*/
    /*line-height: 178px;*/
    /*text-align: center;*/
  /*}*/

  /*.avatar {*/
    /*width: 178px;*/
    /*height: 178px;*/
    /*display: block;*/
  /*}*/

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }
</style>
<style lang="scss" scoped>
  .versionUpload {

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
      background: rgba(245, 246, 250, 0.61);
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      .form-container {
        background: white;
        padding: 30px 0 100px;

      }
    }
    .upload {
      display: inline-block;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 30px;
      background: #1B9AF7;
      color: white;
      cursor: pointer;
      position: relative;
    }
    .avatar-uploader{
      width: 100px;
      height: 30px;
      position: absolute;
      left:0;
      top:0;
      /*border: 1px solid red;*/
      z-index: 2000;
      .inner{
        width: 100px;
        height: 30px;
        /*border: 1px solid red;*/
      }
    }

  }
</style>
