<template>
  <div class="businessDetail">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="卡券名称" required>
        <el-input
          style="width:600px;"
          v-model="formParams.name"
          maxlength="10"
          placeholder="用于记录卡券用途，10字以内"
        />
      </el-form-item>
      <el-form-item label="卡券面额" required>
        <el-input
          style="width:600px;"
          v-model="formParams.valueFormat"
          placeholder="请输入卡券面额"
        />
      </el-form-item>
      <el-form-item label="满额条件" required>
        <el-input
          style="width:600px;"
          type="number"
          v-model="formParams.sufficeFormat"
          placeholder="订单大于多少悟空币才能使用该券，填0则不限制"
        />
      </el-form-item>
      <el-form-item label="卡券有效期" required>
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

      <el-form-item prop="title" label="卡券详情" required>
        <Tinymce1 id="Tinymce1" v-model="formParams.intro" :height="300"/>
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
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "businessDetail",
    directives: {
      waves,
      elDragDialog
    },
    components: {
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
        loading: false,
        formParams: {
          couponId: 0,
          days: null,
          intro: "",
          name: "",
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
              couponId: 0,
              days: null,
              intro: "",
              name: "",
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
      }
      ,
      handleDrag() {
        // this.$refs.select.blur()
      }
      ,

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

</style>
<style lang="scss" scoped>
  .businessDetail {
    padding: 15px;
    .filter-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .expireTime {
      margin-bottom: 20px;
    }

  }
</style>
