<template>
  <div class="smartStrategypDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>

    <div class="content">
      <div class="left">
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
              style="width: 400px"
              v-model="formParams.name"
              placeholder="输入名称"
            />
          </el-form-item>
          <!--<el-form-item label="价格">-->
          <!--<el-input-->
          <!--style="width: 400px"-->
          <!--type="number"-->
          <!--v-model="formParams.valueFormat"-->
          <!--placeholder="输入面额"-->
          <!--/>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="选择分类">-->
          <!--<el-select-->
          <!--class="filter-item"-->
          <!--style="width: 400px"-->
          <!--v-model="formParams.typeId"-->
          <!--placeholder="请选择类型"-->
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

          <el-form-item label="链接工具">
            <el-select
              style="width: 400px"
              class="filter-item"
              v-model="formParams.unionId"
              placeholder="请选择工具"
            >
              <el-option
                v-for="item in toolOptions"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>

          </el-form-item>
          <!--<el-form-item label="三方链接">-->
          <!--<el-input-->
          <!--style="width: 400px"-->
          <!--v-model="formParams.name"-->
          <!--placeholder="输入三方链接"-->
          <!--/>-->
          <!--</el-form-item>-->

          <el-form-item label="简介说明">
            <el-input
              style="width: 400px"
              type="textarea"
              :rows="6"
              v-model="formParams.intro"
              placeholder="输入简介说明"
            />
          </el-form-item>


        </el-form>
      </div>
      <div class="right">
        <div class="top">
          <el-tabs v-model="typeName" @tab-click="handleClick">
            <!--<el-tab-pane name="first">-->
            <!--<span slot="label"> 攻略介绍</span><i class="el-icon-date"></i>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane name="second">-->
            <!--<span slot="label"> 攻略详情</span><i class="el-icon-date"></i>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane name="third">-->
            <!--<span slot="label"> 操作流程</span><i class="el-icon-date"></i>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane name="fourth">-->
            <!--<span slot="label"> 注意事项</span><i class="el-icon-date"></i>-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane name="fifth">-->
            <!--<span slot="label"> 结果反馈</span><i class="el-icon-date"></i>-->
            <!--</el-tab-pane>-->
            <el-tab-pane label="攻略介绍" name="first"></el-tab-pane>
            <el-tab-pane label="攻略详情" name="second"></el-tab-pane>
            <!--<el-tab-pane label="操作流程" name="third"></el-tab-pane>-->
            <!--<el-tab-pane label="注意事项" name="fourth"></el-tab-pane>-->
            <!--<el-tab-pane label="结果反馈" name="fifth"></el-tab-pane>-->
          </el-tabs>
        </div>
        <el-form class="form-container" ref="postForm" label-width="64px" v-show="typeName==='first'">
          <el-form-item label="标题">
            <el-input
              style="width:800px;"
              v-model="formParams.guide.intro.title"
              placeholder="请输入标题"
            />
          </el-form-item>

          <el-form-item label="内容">
            <Tinymce1 id="Tinymce1" v-model="formParams.guide.intro.content" :height="360" :width="80"/>
          </el-form-item>

        </el-form>
        <el-form class="form-container" ref="postForm" label-width="64px" v-show="typeName==='second'">
          <el-form-item label="标题">
            <el-input
              style="width:800px;"
              v-model="formParams.guide.ready.title"
              placeholder="请输入标题"
            />
          </el-form-item>

          <el-form-item label="内容">
            <Tinymce1 id="Tinymce12" v-model="formParams.guide.ready.content" :height="360" :width="80"/>
          </el-form-item>

        </el-form>
        <el-form class="form-container" ref="postForm" label-width="64px" v-show="typeName==='third'">
          <el-form-item label="标题">
            <el-input
              style="width:800px;"
              v-model="formParams.guide.flows.title"
              placeholder="请输入标题"
            />
          </el-form-item>

          <el-form-item label="内容">
            <Tinymce1 id="Tinymce3" v-model="formParams.guide.flows.content" :height="360" :width="80"/>
          </el-form-item>

        </el-form>
        <el-form class="form-container" ref="postForm" label-width="64px" v-show="typeName==='fourth'">
          <el-form-item label="标题">
            <el-input
              style="width:800px;"
              v-model="formParams.guide.attention.title"
              placeholder="请输入标题"
            />
          </el-form-item>

          <el-form-item label="内容">
            <Tinymce1 id="Tinymce14" v-model="formParams.guide.attention.content" :height="360" :width="80"/>
          </el-form-item>

        </el-form>
        <el-form class="form-container" ref="postForm" label-width="64px" v-show="typeName==='fifth'">
          <el-form-item label="标题">
            <el-input
              style="width:800px;"
              v-model="formParams.guide.result.title"
              placeholder="请输入标题"
            />
          </el-form-item>

          <el-form-item label="内容">
            <Tinymce1 id="Tinymce15" v-model="formParams.guide.result.content" :height="360" :width="80"/>
          </el-form-item>

        </el-form>
      </div>

    </div>

  </div>
</template>

<script>

  import {toolDetail, toolEdit, toolList, types,} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "smartStrategypDetail",
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
        typeName: "first",
        uploadImages: [],
        typeOptions: [],
        toolOptions: [],
        listQuery: {
          limit: 10,
          page: 0,
          top: 0,
          type: "tool",
        },
        formParams: {
          enable: true,
          guide: {
            attention: {
              title: "",
              content: ""
            },   //注意事项
            flows: {
              title: "",
              content: ""
            },  //操作流程
            intro: {
              title: "",
              content: ""
            },  //攻略介绍
            ready: {
              title: "",
              content: ""
            },  //攻略详情
            result: {
              title: "",
              content: ""
            },  //结果反馈
          },
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
          type: "guide",
          unionId: null,
          url: "",
        },
      };
    },
    methods: {
      // 获取工具列表
      getToolList() {
        this.listLoading = true;
        toolList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.toolOptions.push({
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
          type: "guide"
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
      handleClick(tab, event) {
        console.log(this.typeName);
        // switch (tab.name) {
        //   case "first":
        //     console.log("first ");
        //     break;
        //   case "second":
        //     console.log("second ");
        //     break;
        // }
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
            this.formParams.logo = json.data.logo
            this.formParams.name = json.data.name
            this.formParams.intro = json.data.intro;
            this.formParams.price = json.data.price;
            if (json.data.guide) {
              this.formParams.guide = json.data.guide;
            }
            this.formParams.queue = json.data.queue;
            this.formParams.toolId = json.data.id;
            this.formParams.typeId = json.data.typeId;
            this.formParams.top = json.data.top;
            this.formParams.type = json.data.type.value;
            if (json.data.union) {
              this.formParams.unionId = json.data.union.id;
            }
            this.formParams.url = json.data.url;

          } else {

          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        // console.log(this.formParams);
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
            message: "输入名称",
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
        if (!this.formParams.intro) {
          this.$message({
            message: "输入简介说明",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "输入三方链接",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.guide.intro.title) {
          this.$message({
            message: "输入攻略介绍标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.guide.intro.content) {
          this.$message({
            message: "输入攻略介绍内容",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.guide.ready.title) {
          this.$message({
            message: "输入攻略详情标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.guide.ready.content) {
          this.$message({
            message: "输入攻略详情内容",
            type: "error"
          });
          return false;
        }

        // if (!this.formParams.guide.flows.title) {
        //   this.$message({
        //     message: "输入操作流程标题",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.guide.flows.content) {
        //   this.$message({
        //     message: "输入操作流程内容",
        //     type: "error"
        //   });
        //   return false;
        // }
        //
        // if (!this.formParams.guide.attention.title) {
        //   this.$message({
        //     message: "输入注意事项标题",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.guide.attention.content) {
        //   this.$message({
        //     message: "输入注意事项内容",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.guide.result.title) {
        //   this.$message({
        //     message: "输入结果反馈标题",
        //     type: "error"
        //   });
        //   return false;
        // }
        // if (!this.formParams.guide.result.content) {
        //   this.$message({
        //     message: "输入结果反馈内容",
        //     type: "error"
        //   });
        //   return false;
        // }

        this.loading = true;
        this.formParams.url = null
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
              guide: {
                attention: {},   //注意事项
                flows: {},  //操作流程
                intro: {},  //攻略介绍
                ready: {},  //攻略详情
                result: {},  //结果反馈
              },
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
              type: "guide",
              unionId: null,
              url: "",
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

    }
    ,
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
      this.types();
      this.getToolList();
    }
  }
  ;
</script>
<style lang="scss">
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

  .smartStrategypDetail .el-tabs__nav {
    margin-left: 22px;
  }

  .smartStrategypDetail .el-tabs__nav-wrap::after {
    background: none;
  }

  .smartStrategypDetail .el-tabs__header {
    margin: 0;
  }

  .smartStrategypDetail .el-tabs__active-bar {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .smartStrategypDetail {
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
      /*border: 1px solid red;*/
      display: flex;
      justify-content: space-between;
      margin: 20px;
      min-height: calc(100vh - 140px);
      .left {
        background: white;
        /*border: 1px solid red;*/
        width: 40%;
        .form-container {
          padding: 30px 0 50px;
        }
      }
      .right {
        /*border: 1px solid red;*/
        width: 59%;
        background: white;
        .top {
          position: relative;
          /*width: 100%;*/
          /*box-sizing: border-box;*/
          display: flex;
          align-items: center;
          /*justify-content: space-between;*/
          height: 60px;
          /*!*padding: 0 20px;*!*/
          border-bottom: 1px solid #f2f2f2;
          /*font-size: 16px;*/
          margin-bottom: 20px;

          .rightEdit {
            cursor: pointer;
            position: absolute;
            right: 24px;
            top: 19px;
            color: #F65860;
            font-size: 14px;
            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }

    }

  }
</style>
