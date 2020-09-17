<template>
  <div class="courseDetail">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="课程名称">
        <el-input
          style="width:600px;"
          v-model="formParams.title"
          placeholder="请输入课程名称"
        />
      </el-form-item>
      <el-form-item label="课程分类" prop="title">

        <el-select
          class="filter-item"
          style="width: 300px"
          v-model="formParams.typeId"
          placeholder="请选择课程分类"
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
      <el-form-item label="课程级别">

        <el-select
          class="filter-item"
          style="width: 300px"
          v-model="formParams.vipId"
          placeholder="请选择课程级别"
          @change="vipChange"
        >
          <el-option
            v-for="item in vipOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          ></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="课程价格">
        <el-input
          style="width:600px;"
          type="number"
          v-model="formParams.priceFormat"
          placeholder="请输入课程价格"
        />
      </el-form-item>
      <el-form-item label="课程标签">
        <el-input
          style="width:600px;"
          v-model="tags"
          placeholder="请输入课程标签，以顿号分开"
        />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="课程封面">
        <el-upload
          class="avatar-uploader"
          :http-request="UploadCoverImage"
          action=""
          :show-file-list="false">
          <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!--<el-form-item style="margin-bottom: 40px;" prop="title" label="轮播图">-->
      <!--<el-upload-->
      <!--:http-request="Upload"-->
      <!--action=""-->
      <!--list-type="picture-card"-->
      <!--:file-list="uploadImages"-->
      <!--:on-preview="handlePictureCardPreview"-->
      <!--:on-remove="handleRemove">-->
      <!--<i class="el-icon-plus"></i>-->
      <!--</el-upload>-->
      <!--</el-form-item>-->

      <el-form-item label="视频链接">
        <el-input
          v-model="formParams.videoUrl"
          placeholder="请输入视频链接"
        />
      </el-form-item>
      <el-form-item label="课程说明">
        <el-input
          v-model="formParams.intro"
          placeholder="请输入课程说明"
        />
      </el-form-item>
      <el-form-item label="课程详情">
        <Tinymce1 id="Tinymce1" v-model="formParams.content" :height="300"/>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-checkbox v-model="formParams.recommend"></el-checkbox>
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
    name: "courseDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        vipOptions: [],
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
          content: "",
          videoUrl: "",
          courseId: 0,
          coverImage: "",
          images: [],
          intro: "",
          price: 0,
          priceFormat: null,
          tags: [],
          title: "",
          token: getToken(),
          recommend: true,
          typeId: null,
          vipId: null
        },
      };
    },
    methods: {
      typeChange(value) {
        this.formParams.typeId = value;
      },
      vipChange(value) {
        this.formParams.vipId = value;
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      beforeUpload() {

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
          this.formParams.coverImage = result.url
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
      initData() {
        courseDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            // this.uploadImages = [];
            // json.data.images.forEach((image, index) => {
            //   this.uploadImages.push({
            //     name: index,
            //     url: image
            //   });
            // });
            this.formParams.courseId = json.data.id;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.intro = json.data.intro;
            this.formParams.videoUrl = json.data.videoUrl;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.formParams.tags = json.data.tags;
            this.tags = json.data.tags.join("、")
            this.formParams.title = json.data.title;
            this.formParams.recommend = json.data.recommend;
            this.formParams.typeId = json.data.typeId;
            this.formParams.vipId = json.data.vip.id;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });


      },
      tagSubmitForm() {
        if (!this.formParams.title) {
          this.$message({
            message: "请输入课程名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.typeId) {
          this.$message({
            message: "请选择课程分类",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.vipId) {
          this.$message({
            message: "请选择课程级别",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入课程价格",
            type: "error"
          });
          return false;
        }

        if (!this.tags) {
          this.$message({
            message: "请输入课程标签",
            type: "error"
          });
          return false;
        }

        this.formParams.tags = this.tags.split("、")

        if (!this.formParams.coverImage) {
          this.$message({
            message: "请上传课程封面",
            type: "error"
          });
          return false;
        }

        // this.uploadImages.forEach((image, index) => {
        //   this.formParams.images.push(image.url)
        // })
        // console.log(this.formParams.images,"uploadImages");

        // if (this.formParams.images.length ===0) {
        //   this.$message({
        //     message: "至少上传一张轮播图片",
        //     type: "error"
        //   });
        //   return false;
        // }

        // if (!this.formParams.videoUrl) {
        //   this.$message({
        //     message: "请输入视频链接",
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

        if (!this.formParams.content) {
          this.$message({
            message: "请输入课程详情",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        this.formParams.price = this.formParams.priceFormat * 100
        courseEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "course"
            })
            this.formParams = {
              content: "",
              courseId: 0,
              coverImage: "",
              images: [],
              intro: "",
              price: 0,
              priceFormat: null,
              tags: [],
              title: "",
              token: getToken(),
              recommend: true,
              typeId: null,
              vipId: null
            }
          }else {

          }


        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      console.log(this.$route.params.id);
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
</style>
<style lang="scss" scoped>
  .courseDetail {
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
