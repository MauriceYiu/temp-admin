<template>
  <div class="trainingDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="标题">
          <el-input
            style="width: 600px"
            v-model="formParams.title"
            placeholder="输入标题"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input
            style="width: 600px"
            v-model="formParams.tagsText"
            placeholder="请输入标签,顿号分隔"
          />
        </el-form-item>
        <el-form-item label="内容">
          <Tinymce1 id="Tinymce1" v-model="formParams.content" :height="400" :width="600"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-checkbox v-model="formParams.enable"></el-checkbox>
        </el-form-item>
        <el-form-item label="是否推荐" prop="top">
          <el-checkbox v-model="formParams.top"></el-checkbox>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button-->
        <!--v-loading="loading"-->
        <!--style="margin-left: 10px;"-->
        <!--type="info"-->
        <!--@click="tagSubmitForm"-->
        <!--&gt;提交-->
        <!--</el-button>-->
        <!--</el-form-item>-->

      </el-form>
    </div>

  </div>
</template>

<script>

  import {
    newsEdit,
    newsDetail,
  } from "../../api/business";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "trainingDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        loading: false,
        formParams: {
          title: "",
          content: "",
          newsId: 0,
          tags: [],
          tagsText: '',
          type: "manual",
          enable:true,
          top:true,
          token: getToken(),
        },
      };
    },
    methods: {
      initData() {
        newsDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            this.formParams.newsId = json.data.id;
            this.formParams.title = json.data.title;
            this.formParams.top = json.data.top;
            this.formParams.enable = json.data.enable;
            if(json.data.tags){
              this.formParams.tagsText = json.data.tags.join("、");
            }
          }
        });


      },
      back(){
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        if (!this.formParams.title) {
          this.$message({
            message: "请输入标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.tagsText) {
          this.$message({
            message: "请输入标签",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.content) {
          this.$message({
            message: "请输入内容",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.tags = this.formParams.tagsText.split("、")
        console.log(this.formParams);
        newsEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "training"
            })
            this.formParams = {
              type: "manual",
              title: "",
              content: "",
              newsId: 0,
              tags: [],
              tagsText: "",
              enable:true,
              top:true,
              token: getToken(),
            }
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
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
</style>
<style lang="scss" scoped>
  .trainingDetail {
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
      padding: 20px;
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
