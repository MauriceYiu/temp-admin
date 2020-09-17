<template>
  <div class="workDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">提交</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="分类">
          <el-select v-model="formParams.typeId" placeholder="请选择分类" style="width:700px">
            <el-option :label="item.name" :value="item.typeId" v-for="(item,index) in list" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片">
          <el-upload
            :http-request="Upload"
            action=""
            list-type="picture-card"
            :file-list="uploadImages"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!--<el-form-item label="标题">-->
          <!--<el-input-->
            <!--style="width:700px;"-->
            <!--v-model="formParams.title"-->
            <!--placeholder="请输入标题"-->
          <!--/>-->
        <!--</el-form-item>-->

        <el-form-item label="内容">
          <el-input
            style="width:700px"
            type="textarea"
            :rows="3"
            v-model="formParams.content"
            placeholder="请输入内容"
          />
        </el-form-item>


      </el-form>
    </div>

  </div>
</template>

<script>

  import {
    wccEdit,
    wccDetail,
  } from "../../api/content";
  import {
    types
  } from "../../api/settings";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "workDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        uploadUrl: "",//你要上传视频到你后台的地址
        videoFlag: false, //是否显示进度条
        videoUploadPercent: "", //进度条的进度，
        isShowUploadVideo: false, //显示上传按钮
        onDiscounts: false, //默认不开启优惠
        attachmentOptions: [
          {
            key: "text",
            name: "图文"
          },
          {
            key: "audio",
            name: "音频"
          },
          {
            key: "video",
            name: "视频"
          }
        ],
        tags: '',
        time: '',
        timeLimit: true,
        dynamicTags: [],
        vipOptions: [],
        inputVisible: false,
        inputValue: '',
        formParams: {
          content: "",
          typeId: "",
          attachments: [
            // {
            //   desc:'',
            //   name:'',
            //   type:'image',
            //   url:'',
            //   length:0,
            // }
          ],
          dynamicId: 0,
          token: getToken(),
        },
        uploadImages: [],
        // 广告跳转类型：none不跳转，url链接，tool辅助工具，guide智能攻略，course课程，live直播，activity线下活动
        loading: false,
        valuePicker: "",
        list: [],
        listQuery: {
          type: "workingCircle"
        },
      };
    },
    methods: {
      getTypeList() {
        types(this.listQuery).then(json => {
          if (json.status === 200) {
            this.list = json.data;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },

      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
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
        let names = [];
        switch (this.formParams.attachmentType) {
          case "audio":
            names = ['mp3', 'wav', 'wmv'];
            break;
          case "video":
            names = ['mp4', 'm2v', 'MP4', 'mpg', 'avi', 'mkv'];
            break;
        }
        console.log(exname);
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          console.log(result.url, "result.url");
          this.formParams.attachmentUrl = result.url
        })
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
          this.formParams.picture = result.url
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
        wccDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            this.formParams.dynamicId = json.data.id;
            this.uploadImages = [];
            json.data.attachments.forEach((image, index) => {
              this.uploadImages.push({
                name: index,
                url: image,
                type: "image"
              });
            });
            // this.formParams.title = json.data.title;
          } else {

          }
        });


      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        // console.log(this.uploadImages);
        // if (this.uploadImages.length ===0) {
        //   this.$message({
        //     message: "至少上传一张图片",
        //     type: "error"
        //   });
        //   return false;
        // }
        this.formParams.attachments=[]
        this.uploadImages.forEach((item, index) => {
          // this.formParams.attachments.push(image.url)
          this.formParams.attachments.push({
            url:item.url,
            type:"image",
          })
        })
        console.log(this.formParams);

        // if (!this.formParams.title) {
        //   this.$message({
        //     message: "请输入标题",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.formParams.typeId) {
          this.$message({
            message: "请选择分类",
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
        wccEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "work"
            })
            this.formParams = {
              content: "",
              attachments: [],
              dynamicId: 0,
              // title: "",
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
      this.getTypeList();
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

  .workDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .workDetail .el-textarea {
    width: 86%;
  }

  .workDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .workDetail {
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
