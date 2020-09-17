<template>
  <div class="pushViewDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <!--<div class="save" @click="tagSubmitForm">保存</div>-->
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="200px">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="图片">
          <img v-if="formParams.image" :src="formParams.image" class="avatar">
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <span>{{formParams.title}}</span>
        </el-form-item>
        <el-form-item label="消息类型" prop="title">
          <span>{{formParams.appText}}</span>
        </el-form-item>
        <el-form-item label="消息说明">
          <span>{{formParams.title}}</span>
        </el-form-item>
        <el-form-item label="广告跳转类型">
          <span>{{formParams.redirectTypeText}}</span>
        </el-form-item>
        <el-form-item :label="urlLabel" v-if="formParams.redirectType=='url'||formParams.redirectType=='course'||formParams.redirectType=='live'||formParams.redirectType=='activity'">
          <span>{{formParams.url}}</span>
        </el-form-item>
        <el-form-item label="发送时间" v-if="!immediately">
          <span>{{formParams.executeTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    name: "pushViewDetail",
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
          appText: "app",
          image: "",
          content: "",
          messageId: 0,
          executeTime: 0,
          redirectType: "",
          redirectTypeText: "",
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
      initData() {
        pushDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.app = json.data.app.value;
            this.formParams.appText = json.data.app.text;
            this.formParams.content = json.data.content;
            this.formParams.image = json.data.image;
            this.formParams.messageId = json.data.id;
            this.formParams.title = json.data.title;
            this.formParams.redirectType = json.data.redirectType.value;
            this.formParams.redirectTypeText = json.data.redirectType.text;
            this.formParams.url = json.data.url;
            this.formParams.executeTime = json.data.executeTime;

          } else {

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

  .pushViewDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .pushViewDetail .el-textarea {
    width: 86%;
  }

  .pushViewDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .pushViewDetail {
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
