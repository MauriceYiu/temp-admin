<template>
  <div class="offlineRecharge">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="submitForm">保存</div>
    </div>


    <div class="content">
      <div class="left">
        <userListChild @getRightData="getRightData"></userListChild>
      </div>


      <div class="rightMain">
        <div class="section">
          <h5>充值用户</h5>
          <div class="user-avatar">
            <img :src="avatar" alt="">
          </div>
          <div class="user-info">
            <div class="user-name">{{name}}</div>
            <div class="other-info">
              <span class="vip-info">{{vipString()}}</span>
              <span class="user-reg-time">注册时间 {{createTime | parseTime('{y}-{m}-{d} {h}:{i}')   }}</span>
            </div>
            <!-- <span class="line">|</span>
            <span>{{mobile}}</span>
            <span class="line">|</span>
            <span>{{vipString()}}</span>
            <span class="line">|</span>
            <span></span> -->
          </div>
          <div style="padding-top:15px;">
            <span class="phone">
              {{mobile}}
          </span>
            <span class="bind-people">
              <span>绑定人:{{inviteUserName}}({{inviteUserAccount}})</span>
            </span>
          </div>
          <div class="data" style="padding-top:30px;">
            <span>余额</span>
            <div class="blue money">{{surplus | showDecimal }} 币</div>
            <span style="margin-left:100px">累计充值</span>
            <div class="blue money">{{recharge | showDecimal }} 币</div>
          </div>
        </div>
        <div class="section">
          <h5>实际充值付费<span style="color: red">（当输入负数时，将对用户执行扣款）</span></h5>
          <div class="data"><span>人民币</span>
            <div class="money">
              <el-input
                type="number"
                style="width:200px;"
                v-model="formParams.moneyFormat"
                placeholder="请输入付费金额"
              />
            </div>
          </div>
          <div class="money-item-wrap">
            <span :class="nowSetPrice=='1288'?'money-item active':'money-item'" @click="nowSetPrice=1288">1288</span>
            <span :class="nowSetPrice=='4988'?'money-item active':'money-item'" @click="nowSetPrice=4988">4988</span>
            <span :class="nowSetPrice=='3700'?'money-item active':'money-item'" @click="nowSetPrice=3700">3700</span>
            <span :class="nowSetPrice=='1088'?'money-item active':'money-item'" @click="nowSetPrice=1088">1088</span>
            <span :class="nowSetPrice=='-1288'?'money-item active':'money-item'" @click="nowSetPrice=-1288">-1288</span>
          </div>
        </div>
        <div class="section">
          <!-- <h5>赠送币额</h5> -->
          <div class="data" style="color：#333;"><span>赠送币额</span>
            <div class="money">
              <el-input
                type="number"
                min="0"
                style="width:200px;"
                v-model="formParams.giftFormat"
                placeholder="请输入赠送币额"
              />
            </div>
          </div>
          <div class="section">
            <h5>到账币额：{{getMoney(+formParams.moneyFormat + +formParams.giftFormat) }} 币</h5>
            <!-- <div class="data"><span>币 额</span>
              <div class="trueMoney"></div>
            </div> -->
          </div>
          <div class="section">
            <span>选择充值时间：</span>
            <el-date-picker
              style="width:300px;"
              v-model="valuePicker"
              type="datetime"
              value-format="timestamp"
              @change="changePicker"
              placeholder="选择充值时间"
              :picker-options="pickerOptions0"
              default-time="12:00:00">
            </el-date-picker>
          </div>
          <div class="section">
            <span>充值说明：</span>
            <el-input
              style="width:400px;"
              type="text"
              v-model="formParams.remark"
              placeholder="输入说明内容，10字以内"
              :max-length="10"
            />
            <div class="money-item-wrap">
              <span :class="nowSetDescType=='线下充值'?'money-item active':'money-item'" @click="nowSetDescType='线下充值'">线下充值</span>
              <span :class="nowSetDescType=='线下退款'?'money-item active':'money-item'" @click="nowSetDescType='线下退款'">线下退款</span>
              <span :class="nowSetDescType=='线下充值(运营)'?'money-item active':'money-item'" @click="nowSetDescType='线下充值(运营)'">线下充值(运营)</span>
            </div>
          </div>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
  import {wealthOfflineRecharge,} from "../../api/user.js";
  import {vipAll,} from "@/api/settings";
  import {parseTime, showDecimal} from "@/utils/index";
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'
  import addColleague from './components/addColleague'
  import userListChild from './components/userListChild'
  // import addDepartment from './components/addDepartment'

  export default {
    name: "offlineRecharge",
    components: {
      pagination,
      addColleague,
      userListChild,
      // addDepartment,
    },
    directives: {
      waves,
    },
    data() {
      return {
        nowSetDescType:"",//当前所选择的type
        nowSetPrice:0,//当前所选择的金额
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        total: 0,
        page: 1,
        listLoading: false,
        loading: false,
        formParams: {
          actually: 0,   //实际到账币
          gift: 0,   //赠送币
          giftFormat: 0,
          money: 0,   //付款金额
          moneyFormat: null,
          payTime: 0,  //付款时间
          token: getToken(),
          userId: 0,
        },
        name: "",
        mobile: "",
        vipName: "",
        createTime: "",
        surplus: 0,
        recharge: 0,
        avatar: "",
        inviteUserName:"",
        inviteUserAccount:"",
        valuePicker: new Date().getTime(),
        vipData: [],
      }
    },
    watch:{
      nowSetPrice(val){
        // this.formParams.moneyFormat = val;
        this.$set(this.formParams,'moneyFormat',val);
      },
      nowSetDescType(val){
        console.log(val)
        // this.$nextTick(() => {
          this.$set(this.formParams,'remark',val);
          // this.formParams.remark = val;
        // });
      }
    },
    created() {

    },
    methods: {
      getMoney(num) {
        return num.toFixed(2);
      },
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            this.vipData = json.data;
            this.getRightData()
          } else {

          }
        });
      },
      changePicker() {
        this.formParams.payTime = this.valuePicker / 1000
      },
      getRightData(data) {
        console.log(data, "喝咖啡吗");
        if (data) {
          this.name = data.checkName
          this.formParams.userId = data.checkId
          this.mobile = data.mobile
          this.surplus = data.surplus
          this.createTime = data.createTime
          this.recharge = data.recharge
          this.avatar = data.avatar
          this.inviteUserName = data.inviteUserName
          this.inviteUserAccount = data.inviteUserAccount
        }
      },
      vipString() {
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            // console.log(-item.offset);
            if (this.recharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      newAdd() {
        this.formParams = {
          departmentId: 0,
          leaderId: null,
          name: "",
          token: getToken(),
          parentId: 0,
          number: "",
        }
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      submitForm() {
        // this.loading = true;
        if (!this.formParams.moneyFormat) {
          this.$message({
            message: "请输入付费金额",
            type: "error"
          });
          return false;
        }
        // if (!this.formParams.giftFormat) {
        //   this.$message({
        //     message: "请输入赠送币额",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (this.formParams.giftFormat<0) {
          this.$message({
            message: "赠送金额不允许为负",
            type: "error"
          });
          return false;
        }
        if (!this.valuePicker) {
          this.$message({
            message: "请选择充值时间",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.remark) {
          this.$message({
            message: "请输入说明内容",
            type: "error"
          });
          return false;
        }
        console.log(this.formParams, "formParams");
        this.formParams.payTime = this.valuePicker / 1000;
        this.formParams.gift = this.formParams.giftFormat * 100;
        this.formParams.money = this.formParams.moneyFormat * 100;
        this.formParams.actually = this.formParams.moneyFormat * 100;
        // this.formParams.actually = (+this.formParams.giftFormat + +this.formParams.moneyFormat) * 100;


        wealthOfflineRecharge(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            window.location.reload()
            this.formParams = {
              actually: 0,   //实际到账币
              gift: 0,   //赠送币
              giftFormat: 0,
              money: 0,   //付款金额
              moneyFormat: null,
              payTime: 0,  //付款时间
              token: getToken(),
              userId: 0,
            }

          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }

        });
      },
    },
    mounted() {
      // this.getList();
      this.getVipList()
      // this.nowSetPrice = 1288;
      // this.nowSetDescType = "线下充值";
    }
  }
</script>
<style lang="scss" scoped>
  .offlineRecharge {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
    .money-item-wrap{
      margin-top: 15px;
      span.money-item{
        display: inline-block;
        font-size: 16px;
        min-width: 100px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        color: #333;
        cursor: pointer;
        background: #fff;
        border: 1px solid #ddd;
        margin-right: 15px;
        &.active{
          background: rgb(95, 188, 251);
          color: #fff;
        }
      }
    }
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
        font-weight: bold;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .content {
      display: flex;
      background: #f4f5f7;
      padding: 20px;
      .left {
        width: 240px;
        min-height: 100vh;
        margin-right: 20px;
        background: #ffffff;
        /*display: flex;*/
        /*flex-direction: column;*/
        /*align-items: center;*/
        .department {
          border: 1px solid #999999;
          width: 70%;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          /*margin: 20px 0;*/
          margin: 20px auto;
          cursor: pointer;
        }
        .alldepartment {
          width: 70%;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          /*margin: 20px 0;*/
          margin: 20px auto;
        }
        .el-tree {
          background: #ffffff;
        }
      }
      .rightMain {
        background: #ffffff;
        flex-grow: 1; //铺满盒子剩余空间
        padding: 25px 50px;
        .user-avatar{
          display: inline-block;
          vertical-align: middle;
          img{
            width: 80px;
            height: 80px;
            border-radius: 40px;
          }
        }
        .user-info{
          display: inline-block;
          vertical-align: middle;
          line-height: 30px;
          margin-left: 20px;
          .user-name{
            font-weight: 600;
            font-size: 18px;
          }
          .other-info{
            .vip-info{
              font-weight: 600;
              font-size: 18px;
              color: rgb(95,188,251);
              margin-right: 10px;
            }
            .user-reg-time{
              font-size: 14px;
              color: #999;
            }
          }
        }
        .phone{
          display: inline-block;
          font-size: 20px;
          font-weight: 600;
          color: rgb(255,144,144);
          // padding: 0 50px;
          padding-right: 50px;
          vertical-align: middle;
        }
        .bind-people{
          display: inline-block;
          font-size: 16px;
          vertical-align: middle;
        }
        .filter-container {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }
        .section {
          margin-bottom: 40px;
          h5 {

          }
          p {
            margin: 30px 0;
            font-size: 15px;
            color: #666666;
            .line {
              margin: 0 6px;
            }
          }
          .data {
            display: flex;
            align-items: center;
            .blue {
              color: #5BC0DF;
              font-size: 20px;
              font-weight: bold;
              margin-left: 30px;
            }
            .money {
              margin-left: 30px;
            }
            span {
              color: #999999;
              font-size: 14px;

            }
            .trueMoney {
              margin-left: 30px;
            }
            
          }
        }

      }
    }

  }
</style>
