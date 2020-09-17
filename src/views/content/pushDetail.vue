<template>
  <div class="pushDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="200px">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片">
        <el-upload
        class="avatar-uploader"
        :http-request="UploadCoverImage"
        action=""
        :show-file-list="false">
        <img v-if="formParams.image" :src="formParams.image" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>

        <el-form-item label="消息说明" prop="title">
          <el-input
            style="width:700px;"
            v-model="formParams.title"
            placeholder="请输入消息说明"
          />
        </el-form-item>
        <el-form-item label="消息类型" prop="title">
          <el-select
            class="filter-item"
            style="width: 260px"
            v-model="formParams.app"
            placeholder="请选择消息类型"
          >
            <el-option
              v-for="item in Options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="消息内容">-->
          <!--<el-input-->
            <!--style="width:700px"-->
            <!--type="textarea"-->
            <!--:rows="3"-->
            <!--v-model="formParams.content"-->
            <!--placeholder="请输入消息内容"-->
          <!--/>-->
        <!--</el-form-item>-->
        <el-form-item label="广告跳转类型">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="formParams.redirectType"
            placeholder="请选择广告跳转类型"
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
        <el-form-item :label="urlLabel" v-if="formParams.redirectType !=='none'">
          <el-input
            style="width:600px;"
            type="text"
            v-model="formParams.url"
            :placeholder="placeholder"
          />
        </el-form-item>
        <el-form-item label="立即发送">
          <el-switch
            style="display: inline-block;"
            v-model="immediately"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>

        <el-form-item label="预约发送" v-if="!immediately">
          <el-date-picker
            style="width: 700px"
            v-model="valuePicker"
            type="datetime"
            value-format="timestamp"
            @change="changePicker"
            placeholder="选择预约发送时间"
            :picker-options="pickerOptions0"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>


      </el-form>
    </div>

  </div>
</template>

<script>

  import {pushDetail, pushEdit,} from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "pushDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        // 广告跳转类型：none不跳转，url链接，tool辅助工具，guide智能攻略，course课程，live直播，activity线下活动
        typeOptions: [
          {
            key: "none",
            name: "不跳转"
          },
          {
            key: "url",
            name: "链接"
          },
          {
            key: "tool",
            name: "辅助工具"
          },
          {
            key: "guide",
            name: "智能攻略"
          },
          {
            key: "course",
            name: "课程"
          },
          {
            key: "live",
            name: "直播"
          },
          {
            key: "activity",
            name: "线下活动"
          },
          {
            key: "news",
            name: "资讯"
          },
          {
            key: "tech",
            name: "技术"
          },

          {
            key: "service",
            name: "业务套餐"
          },
        ],
        infoTypeOptions: [
          {
            value: 'push',
            label: '推送消息',
          },
          {
            value: 'system',
            label: '系统消息',
          },
        ],
        Options: [
          {
            value: 'app',
            label: '客户端',
          },
          {
            value: 'staff',
            label: '员工端',
          },
        ],
        urlLabel: "链接",
        placeholder: "请输入广告链接地址",
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        formParams: {
          app: "app",
          image: "",
          content: "",
          messageId: 0,
          pushTime: 0,
          redirectType: "",
          title: "",
          token: getToken(),
          url: "",
        },
        immediately: false,
        loading: false,
        valuePicker: "",
      };
    },
    methods: {
      changePicker() {
        this.formParams.pushTime = this.valuePicker / 1000
      },
      initData() {
        pushDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.app = json.data.app.value;
            this.formParams.content = json.data.content;
            this.formParams.image = json.data.image;
            this.formParams.messageId = json.data.id;
            this.formParams.title = json.data.title;
            this.formParams.redirectType = json.data.redirectType.value;
            this.typeChange()
            this.formParams.url = json.data.url;
            if (json.data.pushTime === 0) {
              this.immediately = true
            } else {
              this.immediately = false
              this.valuePicker = json.data.pushTime * 1000
            }

          } else {

          }
        });


      },
      typeChange() {
        this.formParams.url = null;
        this.urlLabel = "链接";
        this.placeholder = "请输入广告链接地址";
        switch (this.formParams.redirectType) {
          case "none":
            this.formParams.url = null;
            break;
          case "url":
            this.urlLabel = "链接";
            this.placeholder = "请输入广告链接地址";
            break;
          case "tool":
            this.urlLabel = "ID";
            this.placeholder = "选填，不填跳相应主页";
            break;
          case "guide":
            this.urlLabel = "ID";
            this.placeholder = "选填，不填跳相应主页";
            break;
          case "course":
            this.urlLabel = "ID";
            this.placeholder = "请填写课程ID";
            break;
          case "live":
            this.urlLabel = "ID";
            this.placeholder = "请填写直播ID";
            break;
          case "activity":
            this.urlLabel = "ID";
            this.placeholder = "选填，不填跳线下课程列表";
            break;
          case "news":
            this.urlLabel = "ID";
            this.placeholder = "请填写资讯ID";
            break;
          case "tech":
            this.urlLabel = "ID";
            this.placeholder = "请填写技术课程ID";
            break;
          case "service":
            this.urlLabel = "ID";
            this.placeholder = "请填写业务套餐ID";
            break;
        }
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
          this.formParams.image = result.url
        })
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        // console.log(this.formParams);
        if (!this.formParams.title) {
          this.$message({
            message: "请输入消息说明",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.app) {
          this.$message({
            message: "请选择APP端类型",
            type: "error"
          });
          return false;
        }
        // if (!this.formParams.content) {
        //   this.$message({
        //     message: "请输入消息内容",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.formParams.redirectType) {
          this.$message({
            message: "请选择广告跳转类型",
            type: "error"
          });
          return false;
        }
        // if (!this.formParams.url) {
        //   this.$message({
        //     message: "请输入推荐链接",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.immediately && !this.valuePicker) {
          this.$message({
            message: "选择预约发送时间",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        if (this.immediately) {
          this.formParams.pushTime = 0
        } else {
          this.formParams.pushTime = this.valuePicker / 1000
        }
        console.log(this.formParams.pushTime);
        pushEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "push"
            })
            this.formParams = {
              app: "app",
              content: "",
              image: "",
              messageId: 0,
              pushTime: 0,
              title: "",
              token: getToken(),
              url: "",
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

  .pushDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .pushDetail .el-textarea {
    width: 86%;
  }

  .pushDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .pushDetail {
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
