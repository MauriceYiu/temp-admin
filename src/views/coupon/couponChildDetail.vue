<template>
  <div class="homepageAdDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="选择类型">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="formParams.type"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="优惠券名称">
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            placeholder="名称（限3字）"
          />
        </el-form-item>

        <el-form-item label="优惠券面额">
          <el-input
            type="number"
            style="width:600px;"
            v-model="formParams.valueFormat"
            placeholder="优惠券面额"
          />
        </el-form-item>

        <el-form-item label="满额条件">
          <el-input
            type="number"
            style="width:600px;"
            v-model="formParams.sufficeFormat"
            placeholder="满额条件"
          />
        </el-form-item>
        <el-form-item label="使用类型">
          <el-radio-group v-model="radio" @change="changeRadio">
            <el-radio :label="1">领取后自动过期</el-radio>
            <el-radio :label="2">时间段内过期</el-radio>
            <el-radio :label="3">综合设置</el-radio>
          </el-radio-group>

          <div class="expireTime" v-if="radio=='2'||radio=='3'">
            <el-date-picker
              style="width: 280px"
              v-model="valuePickerStart"
              type="datetime"
              value-format="timestamp"
              @change="changePicker"
              placeholder="开始时间"
              :picker-options="pickerOptions0"
              default-time="12:00:00">
            </el-date-picker>
            <span style="margin: 0 8px">至</span>
            <el-date-picker
              style="width: 280px"
              v-model="valuePickerEnd"
              type="datetime"
              value-format="timestamp"
              @change="changePickerEnd"
              placeholder="结束时间"
              :picker-options="pickerOptions0"
              default-time="12:00:00">
            </el-date-picker>
          </div>

          <div class="expireDays" v-if="radio=='1'||radio=='3'">
            <el-input
              style="width:600px;"
              type="number"
              v-model="formParams.days"
              placeholder="用户领取多少天后自动过期"
            />
            天
          </div>

        </el-form-item>
        <!--<el-form-item label="时间设置">-->
          <!--<el-date-picker-->
            <!--style="width: 600px"-->
            <!--v-model="pickerValue"-->
            <!--type="datetimerange"-->
            <!--@change='changePicker()'-->
            <!--:picker-options="pickerOptions2"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--align="right">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="卡券说明">
          <el-input
            style="width:600px;"
            v-model="formParams.intro"
            :autosize="{ minRows: 4, maxRows: 10}"
            type='textarea'
            placeholder="请输入卡券说明"
          />
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button-->
        <!--v-loading="loading"-->
        <!--style="margin-left: 10px;"-->
        <!--type="info"-->
        <!--@click="tagSubmitForm"-->
        <!--&gt;提交-->
        <!--</el-button>-->
        <!--</el-form-item>-->

      </el-form>
    </div>

  </div>
</template>

<script>

  import {
    couponEdit,
    couponDetail,
  } from "../../api/coupon";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "homepageAdDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        radio: 1,
        valuePickerStart: '',
        valuePickerEnd: '',
        pickerValue: '',
        // 广告类型：checkIn签到券，register注册券，issue发放券
        typeOptions: [
          {
            key: "checkIn",
            name: "签到券"
          },
          {
            key: "register",
            name: "注册券"
          },
          {
            key: "issue",
            name: "发放券"
          },
        ],
        loading: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        formParams: {
          checkInDays: 0,
          couponId: 0,
          days: null,
          enable: true,
          intro: "",
          name: "",
          type: "issue",
          suffice: 0,
          sufficeFormat: null,
          token: getToken(),
          validStartTime: 0,
          validEndTime: 0,
          value: 0,
          valueFormat: null,
        },
      };
    },
    methods: {
      changePicker() {
        if (this.pickerValue) {
          this.formParams.startTime = this.pickerValue[0] / 1000;
          this.formParams.endTime = this.pickerValue[1] / 1000;
        } else {
          this.formParams.startTime = ''
          this.formParams.endTime = ''
        }
      },
      changeRadio(value) {
        this.formParams.days = null
        this.valuePickerStart = ''
        this.valuePickerEnd = ''
      },
      changePicker() {
        this.formParams.validStartTime = this.valuePickerStart / 1000
      },
      changePickerEnd() {
        this.formParams.validEndTime = this.valuePickerEnd / 1000
      },
      initData() {
        couponDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.couponId = json.data.id;
            this.formParams.days = json.data.days;
            this.formParams.intro = json.data.intro;
            this.formParams.type = json.data.type.value;
            this.formParams.name = json.data.name;
            this.valuePickerStart = json.data.validStartTime * 1000;
            this.valuePickerEnd = json.data.validEndTime * 1000;
            this.formParams.sufficeFormat = showDecimal(json.data.suffice);
            this.formParams.valueFormat = showDecimal(json.data.value);
          } else {

          }
        });


      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.type) {
          this.$message({
            message: "请选择类型",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.name) {
          this.$message({
            message: "请输入卡券名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.valueFormat) {
          this.$message({
            message: "请输入卡券面额",
            type: "error"
          });
          return false;
        }

        if (this.formParams.sufficeFormat === null) {
          this.$message({
            message: "请输入满额条件",
            type: "error"
          });
          return false;
        }

        if (this.radio == '1' || this.radio == '3') {
          if (!this.formParams.days) {
            this.$message({
              message: "请输入用户领取多少天后自动过期",
              type: "error"
            });
            return false;
          }
        }

        if (this.radio == '2' || this.radio == '3') {
          if (!this.valuePickerStart) {
            this.$message.error('选择开始时间！')
            return false;
          }
          if (!this.valuePickerEnd) {
            this.$message.error('选择结束时间！')
            return false;
          }
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "请输入卡券详情",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.suffice = this.formParams.sufficeFormat * 100;
        this.formParams.value = this.formParams.valueFormat * 100;
        this.formParams.validStartTime = this.valuePickerStart / 1000;
        this.formParams.validEndTime = this.valuePickerEnd / 1000;
        console.log(this.formParams);
        couponEdit(this.formParams).then(json => {
          this.loading = false;
          // const json = response.data;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "coupon"
            })
            this.formParams = {
              checkInDays: 0,
              couponId: 0,
              days: null,
              enable: true,
              intro: "",
              name: "",
              type: "",
              suffice: 0,
              sufficeFormat: null,
              token: getToken(),
              validStartTime: 0,
              validEndTime: 0,
              value: 0,
              valueFormat: null,
            }
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }


        });
      },
      back(){
        this.$router.go(-1);//返回上一层
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
  .homepageAdDetail {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
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
      background: rgba(245, 246, 250, 0.61);
      padding: 20px;
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
