<template>
  <div class="bill">
    <userListChild @getRightList="getList"></userListChild>
    <!--<div class="leftMain">-->
      <!--<el-input @keyup.enter.native="getUserList" style="width: 180px;border-radius:30%;margin-left: 30px"-->
                <!--placeholder="搜索你想要的内容"-->
                <!--suffix-icon="el-icon-search"-->
                <!--v-model="listQueryUser.keyword">-->
      <!--</el-input>-->
      <!--<div class="leftList">-->
        <!--<p>客户列表</p>-->
        <!--<div class="list">-->
         <!--<div class="item" :class="{activeItem:checkIndex === index}" v-for="(item,index) in userList" :key="index" @click="checkUser(item,index)">-->
           <!--<img :src="item.extra.trueAvatar" alt="">-->
           <!--<span class="name">{{item.extra.trueName}}</span>-->
           <!--<span class="mobile">{{item.mobile}}</span>-->
         <!--</div>-->
        <!--</div>-->
        <!--<div class="leftPagination">-->
          <!--<el-pagination-->
            <!--layout="prev, pager, next"-->
            <!--:total="userTotal">-->
          <!--</el-pagination>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

    <!--列表 1 -->
    <div class="rightMain">
      <div class="filter-container">
        <div class="left" style="color: deepskyblue;font-size: 14px">
          {{checkName}}
        </div>
        <div class="right" v-show="false">
          <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                    placeholder="搜索你想要的内容"
                    v-model="listQuery.keyword">
          </el-input>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
            搜索
          </el-button>

        </div>
      </div>

      <el-table
        :data="list"
        stripe
        style="width: 100%">

        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="推广人">
          <template slot-scope="scope">
            <span>{{scope.row.inviteUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册手机号">
          <template slot-scope="scope">
            <span>{{scope.row.userAccount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员等级">
          <template slot-scope="scope">
            <span >{{vipString(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费类型">
          <template slot-scope="scope">
            <span>{{scope.row.operateType.text}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费金额">
          <template slot-scope="scope">
            <span>{{-scope.row.offset | showDecimal}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="支付方式">
          <template slot-scope="scope">
            <span>{{scope.row.payType.text}}</span>
          </template>
        </el-table-column>

        <el-table-column
          style="color:#5BC0DF;"
          align="center"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="action">
              <!--<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>-->
              <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">查看</el-button>

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
</template>

<script>
  import {
    types,
    typeEdit,
    typeDel,
    vipAll,
  } from "@/api/settings";
  import {list,wealthFlows,userEnable} from '@/api/user'
  import userListChild from "./components/userListChild"
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'

  export default {
    name: "bill",
    components: {
      pagination,
      userListChild,
    },
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        openIndex: 1,
        checkIndex: 0,
        checkName: "",
        total: 0,
        userTotal: 0,
        page: 1,
        list: [],
        userList: [],
        vipData: [],
        listLoading: false,
        loading: false,
        listQueryUser: {
          app: "app",
          keyword: "",
          limit: 10,
          page: 0,
          departmentId: 0,
          token: getToken()
        },
        listQuery: {
          limit: 10,
          page: 0,
          targetUserId: 0,
          wealthType: "money",
          token: getToken()
        },
        adDelParams: {
          targetId: "",
          token: getToken(),
        },
      }
    },
    created() {

    },
    methods: {
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            this.vipData = json.data;
            this.getList()
          } else {

          }
        });
      },
      checkUser(item,index){
        // console.log(item,"item");
        this.checkIndex =  index
        this.checkName =  item.extra.trueName
        this.getList(item.id)
      },
      addTag(data) {
        this.$router.push({
          name: "colleagueDetail", params: {
            id: data
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
      goDetails(id) {
        this.$router.push({
          name: 'courseDetail', params: {
            id: id
          }
        })
      },
      getUserList() {
        list(this.listQueryUser).then(json => {
          if (json.status === 200) {
            this.userList = json.data;
            this.userTotal = json.total;
            // console.log(json.data[0].id);
            this.listQuery.targetUserId = json.data[0].id
            this.checkName =  json.data[0].extra.trueName
            this.getList(json.data[0].id);
            // this.total = json.total
          }
        })
      },
      vipString(item) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            // console.log(-item.offset);
            if (-item.offset >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      getList(data) {
        console.log(data,"传的数据回来");
        this.listQuery.targetUserId = data.checkId
        wealthFlows(this.listQuery).then(json => {
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },

    },
    mounted() {

    }
  }
</script>
<style>

  .rightMain .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .rightMain .el-tabs__content {
    display: none;
  }

  .rightMain .filter-container .filter-item {
    margin-bottom: 0;
  }
  .leftMain .el-input{
    margin: 0 auto 30px;
  }
  .leftMain .el-input__inner{
    border-radius: 30px;
    line-height: 34px;
    height: 34px;
    margin: 0 auto;
  }
</style>
<style lang="scss" scoped>
  .bill {
    display: flex;
    background: #f4f5f7;
    padding: 20px;
    .leftMain {
      width: 240px;
      min-height: 100vh;
      margin-right: 20px;
      background: #ffffff;

      .alldepartment{
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
      .leftList{
        padding: 10px;
        p{
          font-size: 14px;
          margin:0 0 26px;
        }
        .list{
          .item{
            border-left:3px solid  #ffffff;
            height: 12px;
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-bottom: 22px;
            img{
              width: 20px;
              height: 20px;
              border-radius: 50%;
              margin-left: 10px;
            }

            .name{
              font-size: 14px;
              margin: 0 10px 0 6px;
              color: #333333;
            }
            .mobile{
              font-size: 14px;
              color: #c2c2c2;
            }
          }
          .activeItem{
            border-left:3px solid  #5BC0DF;
          }
        }
        .leftPagination{
          margin-top:100px;
          text-align: right;
        }
      }
    }
    .rightMain {
      background: #ffffff;
      flex-grow: 1; //铺满盒子剩余空间
      /*padding:15px;*/
      .filter-container {
        /*border: 1px solid red;*/
        height: 81px;
        display: flex;
        justify-content: space-between;
        background: white;
        padding: 20px;
        border-bottom: 1px solid #f2f2f2;
        align-items: center;
      }
      img {
        width: 80px;
      }
      .action {
        display: flex;
        justify-content: center;
        .status {
          display: flex;
          align-items: center;
          margin-right: 20px;
          span {
            margin-right: 6px;
          }
        }
      }

    }
  }
</style>
