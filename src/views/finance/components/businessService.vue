<template>
  <div class="businessService">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="first"/>
          <el-tab-pane label="待审售后" name="second"/>
        </el-tabs>
      </div>
      <div class="right">
        <el-input
          v-model="listQuery.keyword"
          style="width: 300px;margin-left: 20px"
          class="filter-item"
          placeholder="搜索你想要的内容"
          @keyup.enter.native="getList"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>

      </div>
    </div>

    <el-table
      :data="list"
      stripe
      style="width: 100%"
    >

      <el-table-column align="center" label="用户ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务名称">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务老师">
        <template slot-scope="scope">
          <span>{{ scope.row.teacherName || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price | showDecimal }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券抵扣">
        <template slot-scope="scope">
          <span>{{ scope.row.subsidy | showDecimal }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务员">
        <template slot-scope="scope">
          <span
            v-if="scope.row.inviteUserId > 0">{{ scope.row.userInviteName }}【{{ scope.row.inviteUserMobile }}】</span>
          <span v-else> -- </span>
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
            <el-popconfirm
              @onConfirm="abort(scope.row.id)"
              title="确定要取消该服务订单，订单金额将返回客户余额？"
              v-if="'init' === scope.row.status.value">
              <el-button type="text" size="mini" style="color: #F65860" slot="reference">取消</el-button>
            </el-popconfirm>
            <span v-else>--</span>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <div class="paginationBox">
      <el-pagination
        background
        :current-page="page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
  import {
    serviceBuys, serviceAbort
  } from '../../../api/financeData'
  import {
    vipAll
  } from '@/api/settings'
  import waves from '@/directive/waves' // 水波纹指令
  import { getToken } from '@/utils/auth'

  export default {
    name: 'BusinessService',
    directives: {
      waves
    },
    data() {
      return {
        activeName: 'first',
        listQuery: {
          limit: 10,
          page: 0,
          token: getToken()
        },
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        adDelParams: {
          targetId: '',
          token: getToken()
        },
        vipData: []
      }
    },
    mounted() {
    },
    methods: {
      // 取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            this.vipData = json.data
            this.getList()
          } else {

          }
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      handleClick(tab, event) {
        this.page = 1
        this.total = 0
        this.listQuery.page = 0
        // console.log(tab.name, event, "tab");
        switch (tab.name) {
          case 'first':
            this.listQuery.afterSaleStatus = 0
            this.listQuery.orderBy = 'id'
            break
          case 'second':
            this.listQuery.afterSaleStatus = 2
            this.listQuery.orderBy = 'afterSale.handleTime'
            break
        }

        this.getList()
      },
      // 列表
      getList() {
        this.listLoading = true
        serviceBuys(this.listQuery).then(json => {
          this.listLoading = false
          if (json.status === 200) {
            this.list = json.data
            this.total = json.total
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      vipString(item) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            // console.log(-item.offset);
            if (-item.offset >= this.vipData[i].value) {
              return this.vipData[i].name
            }
          }
        }
        return '--'
      },
      abort(id) {
        serviceAbort({
          orderId: id
        }).then(json => {
          this.getList()
        })
      }

    }
  }
</script>
<style>
  .businessService .el-tabs__nav {
    margin-left: 0 !important;
  }

  .businessService .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .businessService .el-tabs__content {
    display: none;
  }

  .businessService .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .businessService {
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
