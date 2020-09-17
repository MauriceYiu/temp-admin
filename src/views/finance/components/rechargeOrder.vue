<template>
  <div class="rechargeOrder">
    <div class="filter-container">
      <div class="left">
        全部
      </div>
      <div class="right">
        <el-input @keyup.enter.native="search" style="width: 300px;margin-left: 20px" class="filter-item"
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
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册手机号">
        <template slot-scope="scope">
          <span>{{scope.row.userMobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">
          <span>{{vipString(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付时间">
        <template slot-scope="scope">
          <span v-if="scope.row.payTime">{{scope.row.payTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付金额">
        <template slot-scope="scope">
          <span>{{scope.row.money | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值数额">
        <template slot-scope="scope">
          <span>{{scope.row.actually | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="赠送数额">
        <template slot-scope="scope">
          <span>{{scope.row.gift | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <span>{{scope.row.payType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.payType.value === 'offline' ? scope.row.name : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务员">
        <template slot-scope="scope">
          <span v-if="scope.row.inviteUserId > 0">{{ scope.row.inviteUserName}}【{{ scope.row.inviteUserMobile }}】</span>
          <span v-else> -- </span>
        </template>
      </el-table-column>

      <!--<el-table-column-->
      <!--style="color:#5BC0DF;"-->
      <!--align="center"-->
      <!--label="操作"-->
      <!--class-name="small-padding fixed-width"-->
      <!--&gt;-->
      <!--<template slot-scope="scope">-->
      <!--<div class="action">-->
      <!--&lt;!&ndash;<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>&ndash;&gt;-->
      <!--<el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">查看</el-button>-->

      <!--</div>-->

      <!--</template>-->
      <!--</el-table-column>-->
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
</template>

<script>
  import {
    wealthRechargeCardOrders,
  } from "../../../api/financeData";
  import {
    vipAll,
  } from "@/api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "rechargeOrder",
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          keyword: '',
          limit: 10,
          page: 0,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        adDelParams: {
          targetId: "",
          token: getToken(),
        },
        vipData: [],
      };
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

      search(){
        this.listQuery.page = 0;
        this.getList();
      },
// 列表
      getList() {
        this.listLoading = true;
        wealthRechargeCardOrders(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },
      vipString(item) {
        console.log(item, "item");
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            // console.log(-item.offset);
            if (item.userRecharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      addTag(data) {
        // this.$router.push({
        //   name: "pushDetail", params: {
        //     id: data
        //   }
        // })
      },


    },
    mounted() {
    }
  };
</script>
<style>

  .rechargeOrder .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .rechargeOrder .el-tabs__content {
    display: none;
  }

  .rechargeOrder .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .rechargeOrder {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 0 20px;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
      .left {
        color: #409EFF;
        font-size: 14px;
      }
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
    .el-table {
      min-height: calc(100vh - 260px);

    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }

  }
</style>
