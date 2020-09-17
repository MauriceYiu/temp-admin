<template>
  <div class="serviceMarket">
    <h4>点击编辑广告</h4>
    <div class="content">
      <div class="left">
        <div class="main">
          <div class="imgWrap leftImg" :class="{borderStyle:currentIndx===5 }" @click="change(5)">
            <img v-if="formParams5.picture" :src="formParams5.picture" class="avatar">
          </div>
          <div class="rightImg">
            <div class="line">
              <div class="img4 imgWrap" :class="{borderStyle:currentIndx===4 }" @click="change(4)">
                <img v-if="formParams4.picture" :src="formParams4.picture" class="avatar">
              </div>
              <div class="img3 imgWrap" :class="{borderStyle:currentIndx===3 }" @click="change(3)">
                <img v-if="formParams3.picture" :src="formParams3.picture" class="avatar">
              </div>
            </div>
            <div class="line">
              <div class="img2 imgWrap" :class="{borderStyle:currentIndx===2 }" @click="change(2)">
                <img v-if="formParams2.picture" :src="formParams2.picture" class="avatar">
              </div>
              <div class="img1 imgWrap" :class="{borderStyle:currentIndx===1 }" @click="change(1)">
                <img v-if="formParams1.picture" :src="formParams1.picture" class="avatar">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <el-form class="form-container" ref="postForm" label-width="154px">
          <el-form-item label="广告链接" required>
            <el-input
              v-model="formParams.url"
              style="width:600px;"
              maxlength="20"
              placeholder="请输入广告链接，20字以内"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 40px;" prop="title" label="广告图片" required>
            <!--<el-upload-->
              <!--class="avatar-uploader"-->
              <!--:http-request="UploadCoverImage"-->
              <!--action=""-->
              <!--:show-file-list="false">-->
              <!--<el-button size="small" type="primary">点击上传</el-button>-->
              <!--<img v-if="formParams.picture" :src="formParams.picture" class="avatar">-->
              <!--&lt;!&ndash;<i v-else class="el-icon-plus avatar-uploader-icon"></i>&ndash;&gt;-->
            <!--</el-upload>-->

            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <img v-if="formParams.picture" :src="formParams.picture" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>

          <el-form-item>
            <el-button
              v-loading="loading"
              style="margin-left: 10px;"
              type="info"
              @click="tagSubmitForm"
            >提交
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>


  </div>
</template>

<script>

  import {
    adList,
    adEdit,
    adDetail,
  } from "../../api/ad";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "serviceMarket",
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
        currentIndx: 5,
        listQuery: {
          adType: "service",
          enable: 0,
          // unionId: 0
        },

        formParams: {
          adId: 0,
          adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 5,
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams5: {
          adId: 0,
          adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 5,
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams4: {
          adId: 0,
          adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 4,
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams3: {
          adId: 0,
          adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 3,
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams2: {
          adId: 0,
          adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 2,
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams1: {
          adId: 0,
          adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 1,
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
      };
    },
    methods: {
      //一级分类列表
      getList() {
        this.listLoading = true;
        adList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            json.data.forEach((item, index) => {
              switch (item.queue) {
                case 5:
                  this.formParams5 =  {
                    adId: item.id,
                    adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture:item.picture,
                    queue:item.queue,
                    title: item.title,
                    url: item.url,
                    token: getToken(),
                  }
                  break;
                case 4:
                  this.formParams4 =  {
                    adId: item.id,
                    adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture:item.picture,
                    queue:item.queue,
                    title: item.title,
                    url: item.url,
                    token: getToken(),
                  }
                  break;
                case 3:
                  this.formParams3 =  {
                    adId: item.id,
                    adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture:item.picture,
                    queue:item.queue,
                    title: item.title,
                    url: item.url,
                    token: getToken(),
                  }
                  break;
                case 2:
                  this.formParams2 =  {
                    adId: item.id,
                    adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture:item.picture,
                    queue:item.queue,
                    title: item.title,
                    url: item.url,
                    token: getToken(),
                  }
                  break;
                case 1:
                  this.formParams1 =  {
                    adId: item.id,
                    adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture:item.picture,
                    queue:item.queue,
                    title: item.title,
                    url: item.url,
                    token: getToken(),
                  }
                  break;
              }
            })
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      change(value) {
        this.currentIndx = value
        switch (value) {
          case 5:
            this.formParams = this.formParams5
            break;
          case 4:
            this.formParams = this.formParams4
            break;
          case 3:
            this.formParams = this.formParams3
            break;
          case 2:
            this.formParams = this.formParams2
            break;
          case 1:
            this.formParams = this.formParams1
            break;
        }
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
          this.formParams.picture = result.url
        })
      },

      tagSubmitForm() {
        if (!this.formParams.url) {
          this.$message({
            message: "请输入广告链接",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.picture) {
          this.$message({
            message: "请上传广告图片",
            type: "error"
          });
          return false;
        }


        this.loading = true;
        adEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$forceUpdate(),
            this.formParams = {
              adId: 0,
              unionId: null,
              adType: "service",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
              enable: true,
              picture: "",
              queue: null,
              title: "",
              url: "",
              token: getToken(),
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
      // this.initData();
      this.getList();
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
</style>
<style lang="scss" scoped>
  .serviceMarket {
    padding: 50px;
    display: flex;
    flex-direction: column;
    .content {
      display: flex;
      .left {
        .main {
          display: flex;
          .borderStyle {
            border: 1px solid rgba(30, 146, 247, 0.46);
            -moz-box-shadow: 0px 0px 10px #1E92F7;
            -webkit-box-shadow: 0px 0px 10px #1E92F7;
            box-shadow: 0px 0px 10px #1E92F7;
          }
          .imgWrap {
            background: #ECECEC;
            border-radius: 10px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 10px;
            }
          }
          .leftImg {
            width: 200px;
            height: 260px;
            margin-right: 20px;
          }
          .rightImg {
            width: 312px;
            height: 254px;
            display: flex;
            flex-direction: column;
            .line {
              display: flex;
              .img4, .img2 {
                margin-right: 10px;
              }
              .img4, .img1 {
                width: 180px;
                height: 120px;
              }
              .img2, .img3 {
                width: 120px;
                height: 120px;
              }
            }
            .line:first-child {
              margin-bottom: 20px;
            }
          }
        }
      }
      .right {

      }

    }

  }
</style>
