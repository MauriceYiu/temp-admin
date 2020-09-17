<template>
  <div class="dynamicDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">提交</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <el-form-item label="附件类型" prop="title">

          <el-select
            class="filter-item"
            style="width: 260px"
            v-model="attachmentType"
            placeholder="请选择附件类型"
            @change="typeChange"
          >
            <el-option
              v-for="item in attachmentOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>

        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="选取文件"
                      v-if="attachmentType!=='image'">
          <el-upload
            class="avatar-uploader"
            :http-request="UploadFile"
            action=""
            :show-file-list="false">
            <audio :src="formParams.attachments[0].url" v-if="'audio' === attachmentType"
                   controls preload="auto" autoplay></audio>
            <video :src="formParams.attachments[0].url" v-if="'video' === attachmentType"
                   controls width="400" height="300" preload="auto" autoplay></video>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片" v-if="'image' === attachmentType">
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
        <el-form-item label="标题">
          <el-input
            style="width:700px;"
            v-model="formParams.title"
            placeholder="请输入标题"
          />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            style="width:700px"
            type="textarea"
            :rows="3"
            maxlength="1000"
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
    dynamicEdit,
    dynamicDetail,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "dynamicDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        typeOptions: [
          {
            value: 'pub',
            label: '公开',
          }, {
            value: 'secret',
            label: '密训',
          }, {
            value: 'dating',
            label: '邀约',
          },
        ],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        options: [
          {
            value: 1001,
            label: '客户',
          }, {
            value: 1002,
            label: '好友',
          }, {
            value: 1003,
            label: '同事',
          },
        ],
        adTypeOptions: [
          {
            key: "collegeCourse",
            name: "学院课程广告"
          },
          {
            key: "collegeNews",
            name: "学院资讯广告"
          },
          {
            key: "collegeTech",
            name: "学院技术广告"
          }
        ],
        uploadUrl: "",//你要上传视频到你后台的地址
        videoFlag: false, //是否显示进度条
        videoUploadPercent: "", //进度条的进度，
        isShowUploadVideo: false, //显示上传按钮
        onDiscounts: false, //默认不开启优惠
        attachmentOptions: [
          {
            key: "image",
            name: "图片"
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
        attachmentType: "image",   //接口没有
        formParams: {
          content: "",
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
          title: "",
          token: getToken(),
        },
        uploadImages: [],
        // 广告跳转类型：none不跳转，url链接，tool辅助工具，guide智能攻略，course课程，live直播，activity线下活动
        loading: false,
        valuePicker: "",
      };
    },
    methods: {
      changeOption(value) {
        // console.log(value);
        // console.log(this.formParams.inviteUsers)
      },
      changePicker() {
        this.formParams.startTime = this.valuePicker / 1000
      },
      vipChange(value) {
        this.formParams.vipId = value;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.vipOptions.push({
                key: item.id,
                label: item.name
              })
            })
          } else {

          }
        });
      },
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
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
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
          this.formParams.coverImage = result.url
        })
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
        switch (this.attachmentType) {
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
          this.formParams.attachments[0].url = result.url
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
            url: result.url,
            type: 'image',
          });
        })
      },
      typeChange() {
        this.formParams.attachments = []
        this.uploadImages = []
        if(this.attachmentType !== 'image'){
          this.formParams.attachments[0] ={
            url: "",
            type: "",
          }
        }

      },
      initData() {
        dynamicDetail({
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
            this.formParams.title = json.data.title;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });


      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        switch (this.attachmentType) {
          case 'image':
            if (this.uploadImages.length === 0) {
              this.$message({
                message: "至少上传一张图片",
                type: "error"
              });
              return false;
            }
            break;
          case 'audio':
            if (!this.formParams.attachments[0].url) {
              this.$message({
                message: "请上传音频文件",
                type: "error"
              });
              return false;
            }
            this.formParams.attachments[0].type = "audio";
            break;
          case 'video':
            if (!this.formParams.attachments[0].url) {
              this.$message({
                message: "请上传视频文件",
                type: "error"
              });
              return false;
            }
            this.formParams.attachments[0].type = "video";
            break;
        }
        this.uploadImages.forEach((item, index) => {
          // this.formParams.attachments.push(image.url)
          this.formParams.attachments.push({
            url: item.url,
            type: "image",
          })
        })


        // console.log(this.formParams);

        if (!this.formParams.title) {
          this.$message({
            message: "请输入标题",
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
        dynamicEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "discover"
            })
            this.formParams = {
              content: "",
              attachments: [],
              dynamicId: 0,
              title: "",
              token: getToken(),
            }
          } else {

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
      this.getVipList();
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

  .dynamicDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .dynamicDetail .el-textarea {
    width: 86%;
  }

  .dynamicDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .dynamicDetail {
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
