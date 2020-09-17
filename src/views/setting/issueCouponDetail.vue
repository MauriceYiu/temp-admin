<template>
  <div class="issueCouponDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">发送</div>
    </div>
    <div class="main">
      <div class="content">
        <el-form class="form-container" ref="postForm" label-width="154px">
          <el-form-item label="选择优惠券">
            <el-select
              class="filter-item"
              style="width: 70%"
              v-model="formParams.couponId"
              placeholder="请选择优惠券"
            >
              <!--输入优惠券ID（只能选择“发放券”类型的优惠券）-->
              <el-option
                v-for="item in couponOptions"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="单人数量">
            <el-input
              type="number"
              style="width: 30%"
              v-model="formParams.amount"
              placeholder="单人数量"
            />
          </el-form-item>

          <el-form-item label="预约发送">
            <el-date-picker
              style="width: 30%"
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
              style="width: 70%"
              v-model="formParams.intro"
              :autosize="{ minRows: 6, maxRows: 10}"
              type='textarea'
              placeholder="请输入卡券说明"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="list">

        <div class="filter-container">
          <div class="left">接受人员</div>

          <div class="right" @click="openDialog">
            添加
          </div>
        </div>
        <el-table :data="selectArr" row-key="id" style="width: 100%;">
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
              <span>{{scope.row.name}}</span>
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
                <el-button type="text" size="mini" @click="delTag(scope.$index, scope.row.id)" style="color: #DADADA">删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--<div class="paginationBox">-->
        <!--<el-pagination-->
        <!--background-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="page"-->
        <!--:page-sizes="[10,20,30, 50]"-->
        <!--:page-size="listQuery.limit"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="total"-->
        <!--&gt;</el-pagination>-->
        <!--</div>-->

      </div>
    </div>


    <el-dialog title="添加接受人员" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">


        <el-form-item label="接受人员">
          <el-select style="width: 70%" v-model="formParams.userIds" filterable multiple placeholder="请选择接受人员">
            <el-option
              v-for="item in staffOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import {
    couponAll,
    cgcAdd,
  } from "../../api/coupon";
  import {
    userStaffs,
  } from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "issueCouponDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        selectArr: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        radio: 1,
        valuePicker: '',
        list: [],
        staffOptions: [],
        total: 0,
        page: 1,
        listQuery: {
          limit: 10,
          page: 0,
          token: getToken()
        },
        dialogFormVisible: false,
        // 广告类型：checkIn签到券，register注册券，issue发放券
        couponOptions: [],
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
          amount: "",
          couponId: "",
          intro: "",
          sendTime: 0,
          userIds: [],
          token: getToken(),
        },
      };
    },
    methods: {
      openDialog() {
        this.dialogFormVisible = true
        //this.formParams.userIds = [];
      },
      //删除
      delTag(index, id) {
        this.$confirm("确定删除此接受人?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectArr.splice(index, 1)
          this.formParams.userIds.splice(this.formParams.userIds.indexOf(id), 1)
          this.$message.success("删除成功！");
        })
      },
      getAllCoupon() {
        couponAll({
          token: getToken(),
          type: "issue"
        }).then(json => {
          if (json.status === 200) {
            // console.log(json);
            // this.couponOptions
            json.data.forEach((item, index) => {
              this.couponOptions.push({
                key: item.id,
                name: item.name,
              })
            })
          } else {

          }
        })
      },
      confirmSelect() {
        this.dialogFormVisible = false;
        this.selectArr = [];
        this.staffOptions.forEach((item, index) => {
          if (this.formParams.userIds.indexOf(item.id) > -1) {
            this.selectArr.push(item)
          }
        })
      },
      //删除
      delTag(index, id) {
        this.$confirm("确定删除此接受人?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectArr.splice(index, 1)
          this.formParams.userIds.splice(this.formParams.userIds.indexOf(id), 1)
          this.$message.success("删除成功！");
        })
      },
      getAllStaffs() {
        userStaffs({
          enable: 1,
          jobLeave: 1,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            // console.log(json);
            this.staffOptions = json.data
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
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
      changePicker() {
        this.formParams.sendTime = this.valuePicker / 1000
      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.couponId) {
          this.$message({
            message: "请选择优惠券",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.amount) {
          this.$message({
            message: "请输入单人数量",
            type: "error"
          });
          return false;
        }

        if (!this.valuePicker) {
          this.$message({
            message: "选择优惠截止时间",
            type: "error"
          });
          return false;
        }

        if (this.formParams.userIds.length === 0) {
          this.$message({
            message: "请选择接受人员",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入卡券详情",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.sendTime = this.valuePicker / 1000;
        cgcAdd(this.formParams).then(json => {
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
              amount: "",
              couponId: "",
              intro: "",
              sendTime: 0,
              userIds: [],
              token: getToken(),
            }
          } else {

          }


        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },


    },
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
      this.getAllCoupon();
      this.getAllStaffs();
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
  .issueCouponDetail {

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
    .main {

      margin: 20px;
      /*background: white;*/
      min-height: calc(100vh - 140px);
      display: flex;
      justify-content: space-between;
      .content {
        /*border: 1px solid red;*/
        width: 49%;
        background: #ffffff;

        .form-container {
          background: white;
          padding: 30px 0 100px;

        }
      }
      .list {
        /*border:3px solid yellow;*/
        width: 50%;
        background: #ffffff;
        .filter-container {
          padding: 0 20px;
          height: 60px;
          border-bottom: 1px solid #f2f2f2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          .left {
            color: #1B9AF7;
          }
          .right {
            color: #F65860;
            cursor: pointer;
          }
        }
      }
    }

  }
</style>
