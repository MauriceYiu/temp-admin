<template>
  <div class="awardSet">

    <div class="content">
      <div class="left">
        <el-form class="form-container" ref="postForm" label-width="154px">
          <el-form-item label="充值提成" class="itemTitle"></el-form-item>
          <el-form-item label="提成比例" class="gray">
            <el-input
              style="width: 400px;"
              placeholder="输入内容"
              v-model="formParams.dividedOfRecharge"
              type='number'>
            </el-input> %
          </el-form-item>
          <el-form-item label="默认购买课程提成" class="itemTitle"></el-form-item>
          <el-form-item label="提成比例" class="gray">
            <el-input
              style="width: 400px;"
              placeholder="输入默认购买课程提成"
              v-model="formParams.dividedOfCourse"
              type='number'>
            </el-input> %
          </el-form-item>

          <el-form-item label="默认直播提成" class="itemTitle"></el-form-item>
          <el-form-item label="提成比例" class="gray">
            <el-input
              style="width: 400px;"
              placeholder="输入默认直播提成"
              v-model="formParams.dividedOfLive"
              type='number'>
            </el-input> %
          </el-form-item>
          <el-form-item label="在线指导服务提成" class="itemTitle"></el-form-item>
          <el-form-item label="业务选择" class="gray itemTitle">
            <el-select
              class="filter-item"
              style="width: 500px"
              v-model="serviceId"
              placeholder="请选择"
              @change="changeService"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="业务员提成比例" class="gray itemTitle" style="margin-left: 100px">
              {{salesmanRatio}}%
            </el-form-item>

            <el-form-item label="老师提成比例" class="gray itemTitle">
              {{teacherRatio}}%
            </el-form-item>
          </div>


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
      <div class="right">
        <el-form class="form-container" ref="postForm" label-width="154px">
          <el-form-item label="评价提成" class="itemTitle" ></el-form-item>
          <el-form-item label="提成比例" class="gray">
            <el-input
              style="width: 400px;"
              placeholder="输入内容"
              v-model="formParams.dividedOfServiceFinished"
              type='number'>
            </el-input> %
          </el-form-item>
          <el-form-item label="售后提成" class="itemTitle"></el-form-item>
          <el-form-item label="提成比例" class="gray">
            <el-input
              style="width: 400px;"
              placeholder="输入售后提成"
              v-model="formParams.dividedOfServiceAfterSale"
              type='number'>
            </el-input> %
          </el-form-item>

        </el-form>
      </div>


    </div>

  </div>
</template>

<script>

  import {
    serviceList,
  } from "../../../api/business";
  import {
    settingRuleEdit,
    settingRuleGet,
  } from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "awardSet",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        options:[],
        loading: false,
        serviceId: null,   //业务ID
        salesmanRatio: 0,
        teacherRatio: 0,
        formParams: {
          dividedOfCourse: 0,   //课程默认提成（%）
          dividedOfLive: 0,    //直播默认提成（%）
          dividedOfRecharge: 0,    //业务员充值提成（%）
          dividedOfServiceAfterSale: 0,    //业务结束后，售后提成（%）（%）
          dividedOfServiceFinished: 0,    //业务结束后，服务老师提成（%）
          token: getToken(),
        },
      };
    },
    methods: {
      //列表
      serviceList() {
        this.listLoading = true;
        let params = {
          limit: 500,
          page: 0,
          keyword: "",
        }

        serviceList(params).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.options = []
            json.data.forEach((item,index)=>{
              this.options.push({
                id:item.id,
                name:item.name,
              })
            })

            for(let i=0;i< json.data.length;i++){
              if(this.serviceId === json.data[i].id){
                this.salesmanRatio = json.data[i].staffRatio
                this.teacherRatio = json.data[i].ratio
              }
            }

          }
        });
      },
      initData() {
        settingRuleGet(this.formParams).then(json => {
          if (json.status === 200) {
            this.formParams.dividedOfCourse = json.data.rule.dividedOfCourse;
            this.formParams.dividedOfLive = json.data.rule.dividedOfLive;
            this.formParams.dividedOfRecharge = json.data.rule.dividedOfRecharge;
            this.formParams.dividedOfServiceAfterSale = json.data.rule.dividedOfServiceAfterSale;
            this.formParams.dividedOfServiceFinished = json.data.rule.dividedOfServiceFinished;
          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      changeService() {
        this.serviceList();
      },
      tagSubmitForm() {
        if (!this.formParams.dividedOfRecharge) {
          this.$message({
            message: "请输入充值提成",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.dividedOfCourse) {
          this.$message({
            message: "请输入默认购买课程提成",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.dividedOfLive) {
          this.$message({
            message: "请输入默认直播提成",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.dividedOfServiceFinished) {
          this.$message({
            message: "请输入评价提成",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.dividedOfServiceAfterSale) {
          this.$message({
            message: "请输入售后提成",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        settingRuleEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });


          }

        });
      },


    },
    mounted() {
      this.serviceList()
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

  .awardSet .gray{
    margin-bottom: 50px;
  }
  .awardSet .gray .el-form-item__label {
    color: #c0c0c0;
  }

  .awardSet .itemTitle {
    margin-bottom: 10px;
  }
</style>
<style lang="scss" scoped>
  .awardSet {

    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333333;
      padding: 0 50px 0 20px;
      .back {
        color: #333333;
        cursor: pointer;
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
      display: flex;
      .form-container {
        background: white;
        padding: 30px 0 50px;
      }
      .left, .right {
        width: 50%;
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
