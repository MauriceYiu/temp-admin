.
<template>
  <div class="auxiliaryToolDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">

        <el-form-item label="被评价人">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="role"
            placeholder="请选择"
            @change="initData()"
          >
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业评分设置">
          <div class="item">
            <span>标题</span>
            <el-input
              style="width: 400px"
              v-model="formParams.profession.title"
              placeholder="请输入标题"
            />
          </div>
          <div class="item">
            <span>专业文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.profession.perfect"
              placeholder="请输入专业文字描述"
            />
          </div>
          <div class="item">
            <span>一般文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.profession.good"
              placeholder="请输入一般文字描述"
            />
          </div>
          <div class="item">
            <span>差劲文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.profession.poor"
              placeholder="请输入差劲文字描述"
            />
          </div>

        </el-form-item>

        <el-form-item label="服务评分设置">
          <div class="item">
            <span>标题</span>
            <el-input
              style="width: 400px"
              v-model="formParams.service.title"
              placeholder="请输入标题"
            />
          </div>
          <div class="item">
            <span>专业文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.service.perfect"
              placeholder="请输入专业文字描述"
            />
          </div>
          <div class="item">
            <span>一般文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.service.good"
              placeholder="请输入一般文字描述"
            />
          </div>
          <div class="item">
            <span>差劲文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.service.poor"
              placeholder="请输入差劲文字描述"
            />
          </div>

        </el-form-item>

        <el-form-item label="速度评分设置">
          <div class="item">
            <span>标题</span>
            <el-input
              style="width: 400px"
              v-model="formParams.speed.title"
              placeholder="请输入标题"
            />
          </div>
          <div class="item">
            <span>专业文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.speed.perfect"
              placeholder="请输入专业文字描述"
            />
          </div>
          <div class="item">
            <span>一般文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.speed.good"
              placeholder="请输入一般文字描述"
            />
          </div>
          <div class="item">
            <span>差劲文字描述</span>
            <el-input
              style="width: 400px"
              v-model="formParams.speed.poor"
              placeholder="请输入差劲文字描述"
            />
          </div>

        </el-form-item>


      </el-form>

    </div>

  </div>
</template>

<script>

  import {
    evaluateEdit,
    toolDetail,
    toolList,
    evaluateType,
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
        typeOptions: [],
        role: 'teacher',
        options: [
          // user普通用户，teacher业务老师，official官方账号，salesman业务员，cs客服人员，admin管理人员
          {
            key: "teacher",
            name: "业务老师",
          }, {
            key: "cs",
            name: "客服人员",
          },
        ],
        listQuery: {
          limit: 10,
          page: 0,
          top: 0,
          type: "guide",
        },
        formParams: {
          token: getToken(),
          evaluateId: 0,
          profession: {
            good: "",     //一般文字描述
            perfect: "",   //专业文字描述
            poor: "",
            title: "",
          },
          service: {
            good: "",
            perfect: "",
            poor: "",
            title: "",
          },
          speed: {
            good: "",
            perfect: "",
            poor: "",
            title: "",
          },
        },
      };
    },
    methods: {

      initData() {
        evaluateType({
          role: this.role,
        }).then(json => {
          if (json.status === 200) {
            this.formParams.evaluateId = json.data.id;
            this.formParams.profession = json.data.profession;
            this.formParams.service = json.data.service;
            this.formParams.speed = json.data.speed;
          }
        });
      },

      back() {
        // this.$router.go(-1);//返回上一层
        this.$router.push({
          name: "gift"
        })

      },
      tagSubmitForm() {
        if (!this.role) {
          this.$message({
            message: "请选择被评价人",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.profession.title) {
          this.$message({
            message: "请输入专业评分标题",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.profession.perfect) {
          this.$message({
            message: "请输入专业文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.profession.good) {
          this.$message({
            message: "请输入一般文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.profession.poor) {
          this.$message({
            message: "请输入差劲文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.service.title) {
          this.$message({
            message: "请输入服务评分标题",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.service.perfect) {
          this.$message({
            message: "请输入服务专业文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.service.good) {
          this.$message({
            message: "请输入服务一般文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.service.poor) {
          this.$message({
            message: "请输入服务差劲文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.speed.title) {
          this.$message({
            message: "请输入速度评分标题",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.speed.perfect) {
          this.$message({
            message: "请输入速度专业文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.speed.good) {
          this.$message({
            message: "请输入速度一般文字描述",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.speed.poor) {
          this.$message({
            message: "请输入速度差劲文字描述",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        evaluateEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.$router.push({
              name: "gift"
            })
            this.formParams = {
              token: getToken(),
              evaluateId: 0,
              profession: {
                good: "",     //一般文字描述
                perfect: "",   //专业文字描述
                poor: "",
                title: "",
              },
              service: {
                good: "",
                perfect: "",
                poor: "",
                title: "",
              },
              speed: {
                good: "",
                perfect: "",
                poor: "",
                title: "",
              },
            }

          }
        });
      },
    },
    mounted() {
      this.initData();
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

    .item {
      width: 600px;
      display: flex;
      margin-bottom: 20px;
      span {
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 20px;
      }

    }

  }
</style>
