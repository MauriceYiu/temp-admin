<template>
  <div class="intelligent">
    <h4>点击编辑广告</h4>
    <div class="content">
      <div class="left">
        <div class="main">

          <div class="leftImg">
            <div class="line">
              <div class="img4 imgWrap" :class="{borderStyle:currentIndx===4 }" @click="change(4, formParams4)">
                <img v-if="formParams4.picture" :src="formParams4.picture" class="avatar">
              </div>
              <div class="img3 imgWrap" :class="{borderStyle:currentIndx===3 }" @click="change(3, formParams3)">
                <img v-if="formParams3.picture" :src="formParams3.picture" class="avatar">
              </div>
            </div>
            <div class="line">
              <div class="img1 imgWrap" :class="{borderStyle:currentIndx===1 }" @click="change(1, formParams1)">
                <img v-if="formParams1.picture" :src="formParams1.picture" class="avatar">
              </div>
            </div>
          </div>

          <div class="imgWrap rightImg" :class="{borderStyle:currentIndx===2 }" @click="change(2, formParams2)">
            <img v-if="formParams2.picture" :src="formParams2.picture" class="avatar">
          </div>

        </div>
      </div>
      <div class="right">
        <el-form class="form-container" ref="postForm" label-width="154px">
          <el-form-item label="标题">
            <el-input
              style="width:600px;"
              v-model="formParams.title"
              placeholder="输入广告标题"
            />
          </el-form-item>
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

          <el-form-item style="margin-bottom: 40px;" prop="title" label="广告图片" required>
            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <img v-if="formParams.picture" :src="formParams.picture" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>
          <el-form-item label="点击量">
            <span style="font-weight: bold">{{ formParams.click }}</span>
          </el-form-item>

          <el-form-item>
            <el-button
              v-loading="loading"
              style="margin-left: 10px;"
              type="success"
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

  import {adDetail, adEdit, adList,} from "../../../api/ad";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "intelligent",
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
        currentIndx: 4,
        listQuery: {
          adType: "guide",
          enable: 0,
          // unionId: 0
        },
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
        urlLabel: "链接",
        placeholder: "请输入广告链接地址,例：http://www.baidu.com",
        formParams: {
          click: null,
          adId: 0,
          adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 4,
          title: "",
          redirectType: "url",
          url: "",
          token: getToken(),
          unionId: null
        },

        formParams4: {
          click: null,
          adId: 0,
          adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 4,
          redirectType: "url",
          title: "",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams3: {
          click: null,
          adId: 0,
          adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 3,
          title: "",
          redirectType: "url",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams2: {
          click: null,
          adId: 0,
          adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 2,
          title: "",
          redirectType: "url",
          url: "",
          token: getToken(),
          unionId: null
        },
        formParams1: {
          click: null,
          adId: 0,
          adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
          enable: true,
          picture: "",
          queue: 1,
          title: "",
          redirectType: "url",
          url: "",
          token: getToken(),
          unionId: null
        },
      };
    },
    methods: {
      typeChange() {
        switch (this.formParams.redirectType) {
          case "none":
            this.formParams.url = null;
            break;
          case "url":
            this.urlLabel = "链接";
            this.placeholder = "请输入广告链接地址,例：http://www.baidu.com";
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

      getList(index) {
        this.listLoading = true;
        adList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            json.data.forEach((item, index) => {
              switch (item.queue) {
                case 4:
                  this.formParams4 = {
                    click: item.click,
                    adId: item.id,
                    adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture: item.picture,
                    queue: item.queue,
                    title: item.title,
                    redirectType: "url",
                    url: item.url,
                    token: getToken(),
                  };
                  break;
                case 3:
                  this.formParams3 = {
                    click: item.click,
                    adId: item.id,
                    adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture: item.picture,
                    queue: item.queue,
                    title: item.title,
                    redirectType: "url",
                    url: item.url,
                    token: getToken(),
                  };
                  break;
                case 2:
                  this.formParams2 = {
                    click: item.click,
                    adId: item.id,
                    adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture: item.picture,
                    queue: item.queue,
                    title: item.title,
                    redirectType: "url",
                    url: item.url,
                    token: getToken(),
                  };
                  break;
                case 1:
                  this.formParams1 = {
                    click: item.click,
                    adId: item.id,
                    adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                    enable: item.enable,
                    picture: item.picture,
                    queue: item.queue,
                    title: item.title,
                    redirectType: "url",
                    url: item.url,
                    token: getToken(),
                  };
                  break;
              }
            })
            if (!index) {
              this.currentIndx = 4
              this.change(4, this.formParams4)
            }
          }
        })
      },
      change(value, data) {
        this.currentIndx = value
        if (data.adId) {
          adDetail({targetId: data.adId}).then(json => {
            if (json.status === 200) {
              let item = json.data;
              this.formParams.click = item.click,
                this.formParams.adId = item.id,
                this.formParams.adType = item.adType.value,  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
                this.formParams.enable = item.enable,
                this.formParams.picture = item.picture,
                this.formParams.queue = item.queue,
                this.formParams.title = item.title,
                this.formParams.redirectType = item.redirectType.value,
                this.formParams.url = item.url,
                this.formParams.token = getToken()
              this.typeChange()
            }
          })
        } else {
          this.formParams = {
            click: null,
            adId: 0,
            adType: "guide",  //index首页轮播广告，service服务市场广告，tool辅助工具广告，course学院广告
            enable: true,
            picture: "",
            queue: value,
            title: "",
            redirectType: "url",
            url: "",
            token: getToken(),
            unionId: null
          };
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
        if (!this.formParams.title) {
          this.$message({
            message: "请输入广告标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.redirectType) {
          this.$message({
            message: "请选择广告跳转类型",
            type: "error"
          });
          return false;
        }
        // if (this.formParams.redirectType!=='none'&&!this.formParams.url) {
        //   this.$message({
        //     message: this.placeholder,
        //     type: "error"
        //   });
        //   return false;
        // }
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
            this.formParams.adId = json.data.id
            this.getList(json.data.queue);
          }
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      // this.initData();
      // this.getList();
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
  .intelligent {
    margin: 20px;
    padding: 30px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
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
            width: 260px;
            height: 260px;
            margin-right: 20px;
            display: flex;
            flex-direction: column;
            .line {
              display: flex;
              .img4 {
                margin-right: 20px;
              }
              .img4, .img3 {
                width: 124px;
                height: 124px;
              }
              .img1 {
                width: 260px;
                height: 124px;
              }
            }

            .line:first-child {
              margin-bottom: 20px;
            }

          }
          .rightImg {
            width: 150px;
            height: 260px;

          }
        }
      }
      .right {

      }

    }

  }
</style>
