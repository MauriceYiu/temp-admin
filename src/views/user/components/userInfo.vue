<template>
  <div class="userInfo">
    <el-form class="form-container" ref="postForm" label-width="100px">
      <el-form-item prop="title" label="提交信息" class="bold"></el-form-item>
      <el-form-item prop="title" label="提交人">
        <span>{{ submitStaffName  }}</span>
      </el-form-item>

      <div class="flex">
        <el-form-item class="leftFormItem" prop="title" label="提交时间">
          <span>{{afterSaleCreateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </el-form-item>

        <el-form-item class="rightFormItem" prop="title" label="提交类型">
          <span v-if="order.afterSale.type">{{ order.afterSale.type  }}</span>
        </el-form-item>
      </div>

      <div class="flex">
        <el-form-item class="leftFormItem" prop="title" label="业务订单号">
          <span>{{ number  }}</span>
        </el-form-item>

        <el-form-item class="rightFormItem" prop="title" label="付费">
          <span>{{ order.price | showDecimal  }}</span>
        </el-form-item>
      </div>
      <el-form-item prop="title" label="服务老师">
      <span>{{ teacherName  }}</span>
      </el-form-item>
      <el-form-item prop="title" label="客户信息" class="bold marginTop"></el-form-item>
      <div class="flex">
        <el-form-item class="leftFormItem" prop="title" label="客户昵称">
          <span>{{ userName  }}</span>
        </el-form-item>

        <el-form-item class="rightFormItem" prop="title" label="会员等级">
          <span>{{vipString(userRecharge)}}</span>
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item class="leftFormItem" prop="title" label="性别">
          <span>{{ order.userGender ? order.userGender.text : '--'  }}</span>
        </el-form-item>

        <el-form-item class="rightFormItem" prop="title" label="注册手机">
          <span>{{ mobile  }}</span>
        </el-form-item>
      </div>

      <el-form-item prop="title" label="注册时间">
        <span>{{userRegisterTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </el-form-item>


      <el-form-item prop="title" label="推广员？">
        <span>{{ order.userInviteName || '--'  }}</span>
      </el-form-item>


      <el-form-item prop="title" label="售后备注" class="marginTop"></el-form-item>
      <el-form-item prop="title" class="tip" style="margin-left: 0">
        <span>{{ order.afterSale.reason  }}</span>
      </el-form-item>

      <!--<el-form-item prop="title" label="服务名称">-->
      <!--<span>{{ order.serviceName  }}</span>-->
      <!--</el-form-item>-->

    </el-form>

  </div>
</template>

<script>
  import {typeDel, typeEdit, types, vipAll,} from "@/api/settings";
  import {serviceBuyDetail} from '@/api/user'
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'

  export default {
    name: "userInfo",
    components: {
      pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        vipData: [],
        submitStaffName: '',
        serviceIntro: '',
        teacherName: '',
        userName: '',
        mobile: '',
        number: '',
        userRegisterTime: '',
        userRecharge: 0,
        afterSaleCreateTime: '',
        afterSaleReason: '',
        listQuery: {
          orderId: this.$route.params.id,
          token: getToken()
        },
        order: {
          afterSale:{},
        }
      }
    },
    props: ['jsonData'],
    watch: {
      jsonData(val) {
        this.order = val;
        console.log(this.order.afterSale.type,"this.order");
        this.submitStaffName = val.afterSale.submitStaffName;
        this.teacherName = val.teacherName;
        this.userName = val.userName;
        this.number = val.number;
        this.mobile = val.mobile;
        this.userRegisterTime = val.userRegisterTime;
        this.userRecharge = val.userRecharge;
        this.afterSaleCreateTime = val.afterSale.createTime
        this.afterSaleReason = val.afterSale.reason
        this.serviceIntro = val.serviceIntro
      }
    },
    methods: {
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
            // if (parseInt(this.$route.params.id) > 0) {
            //   this.initData()
            // }
          }
        });
      },
      vipString(userRecharge) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (userRecharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },

      initData() {
        serviceBuyDetail(this.listQuery).then(json => {
          if (json.status === 200) {
            this.teacherName = json.data.teacherName;
            this.userName = json.data.userName;
            this.mobile = json.data.mobile;
            this.userRegisterTime = json.data.userRegisterTime;
            this.userRecharge = json.data.userRecharge;
            this.afterSaleCreateTime = json.data.afterSale.createTime
            this.afterSaleReason = json.data.afterSale.reason
          }
        })
      },

    },
    mounted() {
      this.getVipList();
      // console.log(this.jsonData, "jsonData");
    }
  }
</script>
<style>
  .userInfo .el-form-item__label {
    color: #999999;
    margin-right: 20px;
    text-align: left;
  }

  .userInfo .bold .el-form-item__label {
    color: #333333;
    font-weight: bold;
  }

  .userInfo .el-form-item {
    margin-bottom: 0;
  }

  .userInfo .tip .el-form-item__content {
    margin-left: 0!important;
  }
  .userInfo .tip  .el-form-item__content{
    line-height: 24px;
  }
</style>

<style lang="scss" scoped>
  .userInfo {
    padding: 40px;
    .flex {
      width: 80%;
      display: flex;
      .leftFormItem {
        width: 50%;
      }
      .rightFormItem {
        width: 50%;
      }
    }
    .marginTop {
      margin-top: 26px;
    }

  }
</style>
