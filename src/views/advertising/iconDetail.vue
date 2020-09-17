<template>
  <div class="iconDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片">
          <el-upload
            class="avatar-uploader"
            :http-request="Uploadpicture"
            action=""
            :show-file-list="false">
            <img v-if="formParams.logo" :src="formParams.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            placeholder="输入图片名称"
          />
        </el-form-item>
        <el-form-item label="类型">
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
        <el-form-item label="介绍">
          <el-input
            type="textarea"
            :rows="4"
            style="width:600px;"
            v-model="formParams.intro"
            placeholder="输入介绍内容"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input

            style="width:600px;"
            v-model="formParams.queue"
            placeholder="数字越大越靠前"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            style="margin-right: 10px"
            v-model="formParams.enable"
            active-color="#13ce66">
          </el-switch>
          <!--<span>启用</span>-->
        </el-form-item>


      </el-form>
    </div>

  </div>
</template>

<script>

  import {
    menuEdit,
    menuDetail,
  } from "../../api/ad";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "iconDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        urlLabel: "链接",
        placeholder: "请输入链接地址",
        uploadImages: [],
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
        loading: false,
        formParams: {
          intro: "",
          logo: "",
          menuId: 0,
          name: "",
          redirectType: "url",
          queue: null,
          token: getToken(),
          url: "",
          enable: true
        },
      };
    },
    methods: {
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
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
          this.formParams.logo = result.url
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
        menuDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.menuId = json.data.id;
            this.formParams.intro = json.data.intro;
            this.formParams.redirectType = json.data.redirectType ? json.data.redirectType.value : "none";
            this.formParams.logo = json.data.logo;
            this.formParams.queue = json.data.queue;
            this.formParams.name = json.data.name;
            this.typeChange()
            this.formParams.url = json.data.url;
            this.formParams.enable = json.data.enable;
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
        if (!this.formParams.logo) {
          this.$message({
            message: "请上传图标",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.name) {
          this.$message({
            message: "请输入名称",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.redirectType) {
          this.$message({
            message: "请选择类型",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "请输入介绍内容",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }


        this.loading = true;
        menuEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "iconSet"
            })
            this.formParams = {
              intro: "",
              logo: "",
              menuId: 0,
              name: "",
              queue: null,
              redirectType: "",
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
</style>
<style lang="scss" scoped>
  .iconDetail {
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
