<template>
  <div class="leftMain">
    <h5>客户列表</h5>
    <el-input @keyup.enter.native="getUserList" style="width: 180px;border-radius:30%;margin-left: 30px"
              placeholder="昵称/手机号"
              suffix-icon="el-icon-search"
              v-model="listQueryUser.keyword">
    </el-input>
    <div class="leftList">
      <p>客户列表</p>
      <div class="list">
        <div class="item" :class="{activeItem:checkIndex === index}" v-for="(item,index) in userList" :key="index"
             @click="checkUser(item,index)">
          <img :src="item.extra.trueAvatar" alt="">
          <span class="name">{{item.extra.trueName}}</span>
          <span class="mobile">{{item.mobile}}</span>
        </div>
      </div>
      <div class="leftPagination">
        <el-pagination
          :current-page="page"
          :pager-count="5"
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="userTotal">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
  import {
    types,
    typeEdit,
    typeDel,
    vipAll,
  } from "@/api/settings";
  import {list, wealthFlows, userEnable} from '@/api/user'
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'

  export default {
    name: "bill",
    components: {
      pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        checkIndex: 0,
        checkName: "",
        checkId: "",
        userTotal: 0,
        page: 1,
        userList: [],
        listQueryUser: {
          app: "app",
          keyword: "",
          limit: 10,
          page: 0,
          departmentId: 0,
          token: getToken()
        },
      }
    },
    props: ["id", "token"],
    created() {

    },
    methods: {
      handleSizeChange(val) {
        this.listQueryUser.limit = val;
        this.getUserList()
      },
      handleCurrentChange(val) {
        this.listQueryUser.page = val - 1
        this.page = this.listQueryUser.page + 1
        this.getUserList()
      },
      checkUser(item, index) {
        console.log(item);
        this.checkIndex = index
        this.checkName = item.extra.trueName
        this.checkId = item.id
        this.$emit("getRightData", {
          checkIndex: this.checkIndex,
          checkName: this.checkName,
          checkId: this.checkId,
          token: item.token,
          surplus: item.surplus,
          createTime: item.createTime,
          mobile: item.mobile,
          recharge: item.recharge,
          avatar:item.extra.trueAvatar,
          inviteUserName:item.inviteUserName,
          inviteUserAccount:item.inviteUserAccount,
        })
      },
      getUserList() {
        list(this.listQueryUser).then(json => {
          if (json.status === 200) {
            console.log(json.data);
            this.userList = json.data;
            this.userTotal = json.total;
            if (this.userTotal > 0) {
              this.$emit("getRightData", {
                checkIndex: 0,
                checkName: json.data[0].extra.trueName,
                checkId: json.data[0].id,
                token: json.data[0].token,
                surplus: json.data[0].surplus,
                createTime: json.data[0].createTime,
                mobile: json.data[0].mobile,
                recharge: json.data[0].recharge,
                avatar:json.data[0].extra.trueAvatar,
                inviteUserName:json.data[0].inviteUserName,
                inviteUserAccount:json.data[0].inviteUserAccount,
              })
            }
          }
        })
      },

    },
    mounted() {
      this.getUserList();
    }
  }
</script>
<style>
  .leftMain .el-input {
    margin: 0 auto 30px;
  }

  .leftMain .el-input__inner {
    border-radius: 30px;
    line-height: 34px;
    height: 34px;
    margin: 0 auto;
    /*background: #f9f9f9;*/
  }
</style>
<style lang="scss" scoped>
  .leftMain {
    width: 240px;
    min-height: 100vh;
    margin-right: 20px;
    padding-top: 20px;
    background: #ffffff;
    h5 {
      text-align: center;
      color: #5BC0DF;
    }

    .el-tree {
      background: #ffffff;
    }
    .leftList {
      padding: 10px;
      p {
        font-size: 14px;
        margin: 0 0 26px;
      }
      .list {
        .item {
          border-left: 3px solid #ffffff;
          height: 12px;
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 22px;
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-left: 10px;
          }

          .name {
            font-size: 14px;
            margin: 0 6px;
            color: #333333;
          }
          .mobile {
            font-size: 14px;
            color: #c2c2c2;
          }
        }
        .activeItem {
          border-left: 3px solid #5BC0DF;
        }
      }
      .leftPagination {
        margin-top: 100px;
        text-align: center;
      }
    }
  }
</style>
