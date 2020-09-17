.
<template>
  <div class="auxiliaryToolDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="图片">
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
            style="width: 600px"
            v-model="formParams.name"
            placeholder="输入名称"
          />
        </el-form-item>
        <!--<el-form-item label="价格">-->
        <!--<el-input-->
        <!--style="width: 600px"-->
        <!--type="number"-->
        <!--v-model="formParams.valueFormat"-->
        <!--placeholder="输入面额"-->
        <!--/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="选择分类">-->
        <!--<el-select-->
        <!--class="filter-item"-->
        <!--style="width: 600px"-->
        <!--v-model="formParams.typeId"-->
        <!--placeholder="请选择分类"-->
        <!--&gt;-->
        <!--<el-option-->
        <!--v-for="item in typeOptions"-->
        <!--:key="item.key"-->
        <!--:label="item.name"-->
        <!--:value="item.key"-->
        <!--&gt;</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <div class="" style="display: flex">
          <el-form-item label="推热">
            <el-switch
              style="display: inline-block;"
              v-model="formParams.top"
              active-color="#13ce66">
            </el-switch>

          </el-form-item>
          <el-form-item label="启用">
            <el-switch
              style="display: inline-block;"
              v-model="formParams.enable"
              active-color="#13ce66">
            </el-switch>

          </el-form-item>
        </div>

        <el-form-item label="链接攻略">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="formParams.unionId"
            placeholder="请选择攻略"
          >
            <el-option
              v-for="item in guideOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三方链接">
          <el-input
            style="width: 600px"
            v-model="formParams.url"
            placeholder="输入三方链接"
          />
        </el-form-item>

        <el-form-item label="简介说明">
          <el-input
            style="width: 600px"
            type="textarea"
            :rows="4"
            v-model="formParams.intro"
            placeholder="输入简介说明"
          />
        </el-form-item>


      </el-form>

    </div>

  </div>
</template>

<script>

  import {
    types,
    toolEdit,
    toolDetail,
    toolList,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "auxiliaryToolDetail",
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
        uploadImages: [],
        typeOptions: [],
        guideOptions: [],
        listQuery: {
          limit: 10,
          page: 0,
          top: 0,
          type: "guide",
        },
        formParams: {
          enable: true,
          guide: null,
          intro: "",
          logo: "",
          name: "",
          price: 0,
          priceFormat: null,
          queue: null,
          token: getToken(),
          toolId: 0,
          top: true,
          typeId: null,
          type: "tool",
          unionId: null,
          url: "",
        },
      };
    },
    methods: {
      // 获取攻略列表
      getGuideList() {
        this.listLoading = true;
        toolList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.guideOptions.push({
                key: item.id,
                name: item.name,
              })
            })

          } else {

          }
        })
      },
      types() {
        types({
          type: "tool"
        }).then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.typeOptions.push({
                key: item.typeId,
                name: item.name,
              })
            })
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
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
      initData() {
        toolDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.enable = json.data.enable;
            this.formParams.guide = json.data.guide
            this.formParams.logo = json.data.logo
            this.formParams.name = json.data.name
            this.formParams.intro = json.data.intro;
            this.formParams.price = json.data.price;
            this.formParams.queue = json.data.queue;
            this.formParams.toolId = json.data.id;
            this.formParams.typeId = json.data.typeId;
            this.formParams.top = json.data.top;
            this.formParams.type = json.data.type.value;
            this.formParams.unionId = json.data.union.id;
            this.formParams.url = json.data.url;
          } else {

          }
        });
      },

      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        console.log(this.formParams);
        // console.log(this.uploadImages);
        if (!this.formParams.logo) {
          this.$message({
            message: "请上传图片",
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
        // if (!this.formParams.typeId) {
        //   this.$message({
        //     message: "请选择分类",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.formParams.url) {
          this.$message({
            message: "请输入三方链接",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "请输入简介说明",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        // this.formParams.price = this.formParams.priceFormat * 100
        toolEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.$router.push({
              name: "quickEntry"
            })
            this.formParams = {
              enable: true,
              guide: null,
              intro: "",
              logo: "",
              name: "",
              price: 0,
              priceFormat: null,
              queue: null,
              token: getToken(),
              toolId: 0,
              top: true,
              typeId: null,
              type: "tool",
              unionId: null,
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
      this.types();
      this.getGuideList()
    }
  }
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
  .auxiliaryToolDetail {
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
      background: rgba(245, 246, 250, 0.61);
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
