<template>
  <div class="homepageAdDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="main">
      <div class="content">
        <el-form class="form-container" ref="postForm" label-width="154px">
          <el-form-item label="选择优惠券">
            <el-select
              class="filter-item"
              style="width: 400px"
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
          <el-form-item label="单人数量">
            <el-input
              type="number"
              style="width:400px;"
              v-model="formParams.valueFormat"
              placeholder="优惠券面额"
            />
          </el-form-item>

          <el-form-item label="预约发送">
            <el-date-picker
              style="width:400px;"
              v-model="valuePicker"
              type="datetime"
              value-format="timestamp"
              @change="changePicker"
              placeholder="选择优惠截止时间"
              :picker-options="pickerOptions0"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="卡券说明">
            <el-input
              style="width:400px;"
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
      <div class="list">

        <div class="filter-container">
          <div class="left">接受人员</div>

          <div class="right">
            <el-button v-waves class="filter-item" type="text" style="color: #F65860">
              添加
            </el-button>
          </div>
        </div>
        <el-table :data="list" row-key="id" style="width: 100%;">
          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="工号">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              <span>{{scope.row.extra.trueName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="scope">
              <span>{{scope.row.departmentName || '--'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <div class="action">
                <div class="status">
                  <span v-if="scope.row.enable">未离职</span>
                  <span v-if="!scope.row.enable">已离职</span>
                  <el-switch
                    @change="(value)=>{changeStatus(value,scope.row)}"
                    style="display: block"
                    v-model="scope.row.enable"
                    active-color="#13ce66">
                  </el-switch>
                </div>
                <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">编辑</el-button>

              </div>

            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBox">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>

      </div>
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
        list: [],
        total: 0,
        page: 1,
        listQuery:{
          limit: 10,
          page: 0,
          token: getToken()
        },
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
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
    .main{
      padding: 20px;
      min-height: 90vh;
      display: flex;
      justify-content: space-between;
      .content {
        border: 1px solid red;
        width: 49%;
        background: #ffffff;

        .form-container {
          background: white;
          padding: 30px 0 100px;

        }
      }
      .list{
        width: 49%;
        background: #ffffff;
        .filter-container{
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left{
              color: #1B9AF7;
          }
        }
      }
    }


  }
</style>
