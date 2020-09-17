<template>
  <div class="newsDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">更新</div>
    </div>
    <div class="content">
      <div class="left">
        <el-form class="form-container" ref="postForm" label-width="100px">
          <el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片">
            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="附件类型" prop="title">

            <el-select
              class="filter-item"
              style="width: 260px"
              v-model="formParams.attachmentType"
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
                        v-if="formParams.attachmentType!=='text'">
            <el-upload
              class="avatar-uploader"
              :http-request="UploadFile"
              action=""
              :show-file-list="false">
              <audio :src="formParams.attachmentUrl" v-if="'audio' === formParams.attachmentType"
                     controls preload="auto" autoplay></audio>
              <video :src="formParams.attachmentUrl" v-if="'video' === formParams.attachmentType"
                     controls width="400" height="300" preload="auto" autoplay></video>
            </el-upload>
          </el-form-item>

          <el-form-item label="二级分类" prop="title">
            <el-select style="width: 500px" :multiple-limit="multipleLimit" v-model="formParams.typeIds" filterable multiple placeholder="请选择课程分类"
                      >
              <el-option
                v-for="item in typeOptions"
                :key="item.typeId"
                :label="item.name"
                :value="item.typeId"
              ></el-option>
            </el-select>
            限5个

          </el-form-item>
          <el-form-item label="添加标签">
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

          <!--<el-form-item label="课程级别">-->

            <!--<el-select-->
              <!--class="filter-item"-->
              <!--style="width: 260px"-->
              <!--v-model="formParams.vipId"-->
              <!--placeholder="请选择课程级别"-->
              <!--@change="vipChange"-->
            <!--&gt;-->
              <!--<el-option-->
                <!--v-for="item in vipOptions"-->
                <!--:key="item.key"-->
                <!--:label="item.label"-->
                <!--:value="item.key"-->
              <!--&gt;</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<div class="price" style="display: flex">-->
            <!--<el-form-item label="课程原价">-->
              <!--<el-input-->
                <!--style="width:260px;"-->
                <!--type="number"-->
                <!--v-model="formParams.priceFormat"-->
                <!--placeholder="请输入课程原价(填0代表免费)"-->
              <!--/>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="提成比例">-->
              <!--<el-input-->
                <!--style="width:260px;"-->
                <!--type="number"-->
                <!--v-model="formParams.ratio"-->
                <!--placeholder="请输入提成比例"-->
              <!--/>-->
              <!--%-->
            <!--</el-form-item>-->
          <!--</div>-->
          <!--<el-form-item label="是否优惠" class="onDiscounts">-->
            <!--<el-switch-->
              <!--style="display: inline-block;"-->
              <!--v-model="onDiscounts"-->
              <!--active-color="#13ce66">-->
            <!--</el-switch>-->
          <!--</el-form-item>-->
          <!--<div class="price" style="display: flex" v-if="onDiscounts">-->
            <!--<el-form-item label="优惠价格">-->
              <!--<el-input-->
                <!--style="width:260px;"-->
                <!--type="number"-->
                <!--v-model="formParams.preferPriceFormat"-->
                <!--placeholder="请输入优惠后价格（不能高于原价）"-->
              <!--/>-->
            <!--</el-form-item>-->
            <!--<el-form-item class="timeLimit">-->
              <!--<el-switch-->
                <!--style="display: inline-block;"-->
                <!--v-model="timeLimit"-->
                <!--active-color="#13ce66">-->
              <!--</el-switch>-->
              <!--<span>{{timeLimit?"限时":"已关闭限时"}}</span>-->
            <!--</el-form-item>-->

            <!--<el-form-item class="time">-->
              <!--<el-input-->
                <!--v-if="!timeLimit"-->
                <!--v-model="time"-->
                <!--:disabled="true">-->
              <!--</el-input>-->
              <!--<el-date-picker-->
                <!--v-if="timeLimit"-->
                <!--style="width:200px"-->
                <!--v-model="valuePicker"-->
                <!--type="datetime"-->
                <!--value-format="timestamp"-->
                <!--@change="changePicker"-->
                <!--placeholder="选择优惠截止时间"-->
                <!--:picker-options="pickerOptions0"-->
                <!--default-time="12:00:00">-->
              <!--</el-date-picker>-->
            <!--</el-form-item>-->
          <!--</div>-->
          <el-form-item label="课程说明">
            <el-input
              style="width:618px"
              type="textarea"
              :rows="5"
              v-model="formParams.intro"
              placeholder="请输入课程说明"
            />
          </el-form-item>
          <el-form-item label="是否启用" prop="enable">
            <el-switch
              style="display: inline-block;"
              v-model="formParams.enable"
              active-color="#13ce66">
            </el-switch>
          </el-form-item>
          <el-form-item label="点赞基数">
            <el-input
              style="width:260px;"
              type="number"
              v-model="formParams.awesomeBase"
              placeholder="请输入点赞基数"
            />
          </el-form-item>
          <el-form-item label="收藏基数">
            <el-input
              style="width:260px;"
              type="number"
              v-model="formParams.favBase"
              placeholder="请输入收藏基数"
            />
          </el-form-item>
          <el-form-item label="访问量基数">
            <el-input
              style="width:260px;"
              type="number"
              v-model="formParams.visitBase"
              placeholder="请输入访问量基数"
            />
          </el-form-item>

        </el-form>
      </div>
      <div class="right">
        <el-form class="form-container" ref="postForm" label-width="100px">
          <el-form-item label="标题">
            <el-input
              style="width:600px;"
              v-model="formParams.title"
              placeholder="请输入标题"
            />
          </el-form-item>

          <el-form-item label="正文">
            <Tinymce1 id="Tinymce1" v-model="formParams.content" :height="500" :width="100"/>
          </el-form-item>

        </el-form>
      </div>


    </div>

  </div>
</template>

<script>

  import {
    courseEdit,
    courseDetail,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "newsDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        // courseBook
        // courseNews
        // courseTech
        typeOptions: types.courseNews,
        multipleLimit: 5,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
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
          attachmentType: "text",
          attachmentUrl: "",
          content: "",
          courseId: 0,
          coverImage: "",
          enable: 0,
          intro: "",
          preferPrice: -1,
          preferPriceFormat: null,
          preferTime: null,
          price: 0,
          ratio: null,
          priceFormat: null,
          recommend: true,
          tags: [],
          title: "",
          token: getToken(),
          type: "news",
          typeIds: [],
          vipId: 0,
          awesomeBase: 0,
          favBase: 0,
          visitBase: 0,
        },
        uploadImages: [],
        // 广告跳转类型：none不跳转，url链接，tool辅助工具，guide智能攻略，course课程，live直播，activity线下活动
        loading: false,
        valuePicker: "",
      };
    },
    methods: {
      changePicker() {
        this.formParams.preferTime = this.valuePicker / 1000
      },
      handleClose(tag) {
        console.log(tag);
        this.formParams.tags.splice(this.formParams.tags.indexOf(tag), 1);
        console.log(this.formParams.tags);
      },
      vipChange(value) {
        this.formParams.vipId = value;
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
            this.formParams.vipId = this.vipOptions[0].key
          } else {

          }
        });
      },
      showInput() {
        console.log(this.formParams.tags);
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
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
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
      typeChange() {
        this.formParams.attachmentUrl = ""
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
        courseDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.attachmentType = json.data.attachmentType.value;
            this.formParams.attachmentUrl = json.data.attachmentUrl;
            this.formParams.content = json.data.content;
            this.formParams.courseId = json.data.id;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.intro = json.data.intro;
            this.formParams.recommend = json.data.recommend;
            this.formParams.enable = json.data.enable;
            this.formParams.title = json.data.title;
            this.formParams.type = json.data.type.value;
            if (json.data.types) {
              json.data.types.forEach((item, index) => {
                this.formParams.typeIds.push(item.id)
              })
            }
            this.formParams.vipId = json.data.vip.id;
            this.formParams.ratio = json.data.ratio;
            this.formParams.tags = json.data.tags;
            this.formParams.priceFormat = showDecimal(json.data.price);
            if (json.data.preferPrice !== -1) {
              this.formParams.preferPriceFormat = showDecimal(json.data.preferPrice);
              this.onDiscounts = true
              this.valuePicker = json.data.preferTime * 1000
            } else {
              this.formParams.preferPriceFormat = null
              this.onDiscounts = false
              this.valuePicker = 0
            }
            this.formParams.awesomeBase = json.data.awesomeBase
            this.formParams.favBase = json.data.favBase
            this.formParams.visitBase = json.data.visitBase
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
        console.log(this.formParams);
        if (!this.formParams.coverImage) {
          this.$message({
            message: "请上传图片",
            type: "error"
          });
          return false;
        }
        if (this.formParams.typeIds.length === 0) {
          this.$message({
            message: "请选择课程分类",
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
        // if (!this.formParams.vipId) {
        //   this.$message({
        //     message: "请选择课程级别",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.priceFormat) {
        //   this.$message({
        //     message: "请输入课程原价",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.ratio) {
        //   this.$message({
        //     message: "请输入提成比例",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (this.onDiscounts && !this.formParams.preferPriceFormat) {
        //   this.$message({
        //     message: "请输入优惠价格",
        //     type: "error"
        //   });
        //   return false;
        // }

        // if (this.onDiscounts && +this.formParams.preferPriceFormat >= +this.formParams.priceFormat) {
        //   this.$message({
        //     message: "优惠价格不能高于或等于原价",
        //     type: "error"
        //   });
        //   return false;
        // }
        //
        // if (this.onDiscounts && this.timeLimit && !this.valuePicker) {
        //   this.$message({
        //     message: "选择优惠截止时间",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入课程说明",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.title) {
          this.$message({
            message: "请输入标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.content) {
          this.$message({
            message: "请输入课程正文详情",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        // this.formParams.price = this.formParams.priceFormat * 100
        // console.log(this.onDiscounts);
        // if (this.onDiscounts) {
        //   this.formParams.preferPrice = this.formParams.preferPriceFormat * 100
        //   this.formParams.preferTime = this.valuePicker / 1000
        // } else {
        //   this.formParams.preferPrice = -1
        //   this.formParams.preferPriceFormat = null
        // }
        courseEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "news"
            })
            this.formParams = {
              attachmentType: "text",
              attachmentUrl: "",
              content: "",
              courseId: 0,
              coverImage: "",
              enable: 0,
              intro: "",
              preferPrice: -1,
              preferPriceFormat: null,
              preferTime: null,
              price: 0,
              priceFormat: null,
              recommend: true,
              tags: [],
              title: "",
              token: getToken(),
              type: "news",
              typeIds: [],
              vipId: null
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

  .newsDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .newsDetail .el-textarea {
    width: 86%;
  }

  .newsDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .newsDetail {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
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
      background: rgba(245, 246, 250, 0.61);
      padding: 20px;
      /*border: 1px solid red;*/
      display: flex;

      .left {
        background: white;
        width: 46%;
        /*border: 1px solid red;*/
        .form-container {
          background: white;
          padding: 30px 0 100px;

        }
      }
      .right {
        background: #ffffff;
        width: 54%;
        padding-top: 30px;
        padding-right: 40px;
        /*border: 1px solid greenyellow;*/
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
