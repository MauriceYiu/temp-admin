<template>
  <div class="paymentAgreement">
    <!--<div class="head">-->
      <!--<div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>-->
      <!--<div class="save" @click="tagSubmitForm">保存</div>-->
    <!--</div>-->
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <!--<el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片">-->
          <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--:http-request="Uploadpicture"-->
            <!--action=""-->
            <!--:show-file-list="false">-->
            <!--<img v-if="formParams.cover" :src="formParams.cover" class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="标题">-->
          <!--<el-input-->
            <!--style="width: 800px;"-->
            <!--v-model="formParams.title"-->
            <!--placeholder="输入标题"-->
          <!--/>-->
        <!--</el-form-item>-->
        <el-form-item label="内容">
          <!-- <el-input
            style="width: 800px;"
            placeholder="输入内容"
            v-model="formParams.content"
            :autosize="{ minRows: 4, maxRows: 10}"
            type='textarea'>
          </el-input> -->
          <!-- <quill-editor ref="text" v-model="formParams.content" class="myQuillEditor" :options="editorOption" /> -->
          <Tinymce1 v-model="formParams.content"/>
        </el-form-item>

        <el-form-item>
        <el-button
        v-loading="loading"
        style="margin-left: 10px;"
        type="success"
        @click="tagSubmitForm"
        >保存
        </el-button>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>

  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {
    newsEdit,
    newsDetail,
  } from "../../../api/business";
  import {
    newsType,
  } from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "paymentAgreement",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1,
      quillEditor
    },
    data() {
      return {
        loading: false,
        formParams: {
          cover: "",
          title: "paymentAgreement",
          content: "",
          newsId: 0,
          type: "paymentAgreement",
          token: getToken(),
        }
      };
    },
    methods: {
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
          this.formParams.cover = result.url
        })
      },
      initData() {
        newsType({
          type: 'paymentAgreement',
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            this.formParams.newsId = json.data.id;
            this.formParams.cover = json.data.cover;
            this.formParams.title = json.data.title;
          } else {

          }
        });
      },
      back(){
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        // if (!this.formParams.cover) {
        //   this.$message({
        //     message: "请上传图片",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.title) {
        //   this.$message({
        //     message: "请输入标题",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.formParams.content) {
          this.$message({
            message: "请输入内容",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        newsEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });


          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }

        });
      },


    },
    mounted() {
      this.initData()
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
</style>
<style lang="scss" scoped>
  .paymentAgreement {

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
    .content {
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      .form-container {
        background: white;
        padding: 30px 0 50px;

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
