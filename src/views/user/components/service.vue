<template>
  <div class="service">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeNameService" @tab-click="handleClick">
          <el-tab-pane label="待审售后" name="first"></el-tab-pane>
          <el-tab-pane label="已审售后" name="second"></el-tab-pane>
          <!--<el-tab-pane label="回访记录" name="third"></el-tab-pane>-->
        </el-tabs>
      </div>
      <div class="right">
        <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="搜索你想要的内容"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList"
                   v-if="hasPerm('customers:afterSale:list:search')">
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
      <el-table-column align="center" label="提交人">
        <template slot-scope="scope">
          <span>{{scope.row.afterSale.submitStaffName || '--'}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="业务老师">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{scope.row.teacherName || '&#45;&#45;'}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="客户昵称">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员等级" width="80">
        <template slot-scope="scope">
          <span>{{vipString(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务名称">
        <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务订单号">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="activeNameService === 'first' ? '售后提交时间' : '售后处理时间'">
        <template slot-scope="scope">
          <span v-if="activeNameService === 'first'">{{scope.row.afterSale.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span
            v-if="activeNameService === 'second'">{{scope.row.afterSale.handleTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="activeNameService === 'first' ? '售后类型' : '处理状态'">
        <template slot-scope="scope">
          <span v-if="activeNameService === 'first'">{{scope.row.afterSale.type}}</span>
          <span v-if="activeNameService === 'second'">{{scope.row.afterSale.handleType || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="activeNameService === 'first' ? '状态' : '退款金额'" width="80">
        <template slot-scope="scope">
          <span v-if="activeNameService === 'first'">{{scope.row.afterSale.checkStatus.text}}</span>
          <span v-if="activeNameService === 'second'">{{scope.row.afterSale.refund | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理人" v-if="activeNameService === 'second'">
        <template slot-scope="scope">
          <span>{{scope.row.afterSale.handleStaffName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        style="color:#5BC0DF;display: flex"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <div class="action">
            <div class="handle" @click="changeStatus(scope.row)"
                 v-if="'checking'== scope.row.afterSale.checkStatus.value && hasPerm('customers:afterSale:list:handle')">
              处理
            </div>
            <div class="chatBox" :class="{'gray':scope.row.gray}" @click="afterSaleChat(scope.row)"
                 v-if="canChat(scope.row) && hasPerm('customers:afterSale:list:chat')">
              聊天
            </div>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860"
                       v-if="hasPerm('customers:afterSale:list:detail')">查看
            </el-button>
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

    <el-dialog title="售后处理" :visible.sync="dialogFormVisible">
      <el-form :model="statusChangeParams">
        <el-form-item label="处理类型">
          <el-select v-model="statusChangeParams.type" placeholder="请选择处理类型">
            <el-option label="退款" value="1"></el-option>
            <el-option label="重选老师" value="2"></el-option>
            <el-option label="关闭评价" value="3"></el-option>
            <el-option label="默认评价" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款金额" v-if="statusChangeParams.type == 1">
          <el-input v-model="statusChangeParams.moneyFormat" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="售后说明">
          <el-input v-model="statusChangeParams.remark" autocomplete="off" style="width: 80%" type="textarea"
                    :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusChangeSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {serviceBuys} from "../../../api/financeData";
  import {chatAfterSale, serviceAcceptAfterSale} from "../../../api/user";
  import {vipAll} from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "service",
    directives: {
      waves,
    },
    data() {
      return {
        activeNameService: 'first',
        // 售后筛选，0不限，1审核中，2审核通过
        listQuery: {
          limit: 10,
          page: 0,
          afterSaleStatus: 1,
          orderBy: 'afterSale.id',
          token: getToken(),
        },
        total: 0,
        page: 1,
        gray: false,
        list: [],
        vipData: [],
        listLoading: false,
        loading: false,
        dialogFormVisible: false,
        statusChangeParams: {
          orderId: "",
          type: "",
          moneyFormat: null,
          money: 0,
          remark: "",
          token: getToken(),
        }
      };
    },
    methods: {
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
            this.getList()
          }
        });
      },
      vipString(item) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (item.userRecharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        // console.log(tab.name, event, "tab");
        switch (tab.name) {
          case "first":
            this.listQuery.afterSaleStatus = 1
            this.listQuery.orderBy = 'afterSale.id'
            break;
          case "second":
            this.listQuery.afterSaleStatus = 2
            this.listQuery.orderBy = 'afterSale.handleTime'
            break;
          // case "third":
          //   this.listQuery.checkStatus ="failed"
          //   break;
        }

        this.getList()
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
      getTypeName(types) {
        let arr = []
        types.forEach((item, index) => {
          arr.push(item.name)
        })

        return arr.join("、")
      },
      changeStatus(item) {
        this.statusChangeParams.orderId = item.id;
        this.dialogFormVisible = true;
      },
      canChat(item) {
        if ('checking' === item.afterSale.checkStatus.value) {
          if (item.afterSaleChatOpen && item.afterSaleChatOpenStaffId == localStorage.getItem("uid")) {
            return true
          }
          if (!item.afterSaleChatOpen) {
            return true
          }
        }
        return false;
      },
      afterSaleChat(item) {
        chatAfterSale({targetId: item.id, token: getToken()}).then(json => {
          if (json.status === 200) {
            item.gray = true
            let id = localStorage.getItem("uid");
            let token = localStorage.getItem("sdktoken");
            window.open("./chat/im/login.html?id=" + id + "&token=" + token, "imLogin", "", true);
            alert('聊天招呼成功，请切换到聊天窗口查看，请不要重复点击！');
          }
        });
      },
      statusChangeSubmit() {
        this.statusChangeParams.money = this.statusChangeParams.moneyFormat * 100;
        serviceAcceptAfterSale(this.statusChangeParams).then(res => {
          if (res.status === 200) {
            this.$message.success("操作成功！");
            this.dialogFormVisible = false
            this.getList();
          }
        });
      },

// 列表
      getList() {
        this.listLoading = true;
        serviceBuys(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },

      addTag(data) {
        this.$router.push({
          name: "serviceDetail", params: {
            id: data
          }
        })
      },


    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .service .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .service .el-tabs__content {
    display: none;
  }

  .service .filter-container .filter-item {
    margin-bottom: 0;
  }

  .service .el-tabs__nav {
    margin-left: 0 !important;
  }
</style>
<style lang="scss" scoped>
  .service {
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
    }

    img {
      width: 80px;
    }

    .action {
      display: flex;
      justify-content: center;
      align-items: center;
      /*border: 2px solid red;*/
      /*font-size: 10px;*/
      .handle {
        display: flex;
        align-items: center;
        margin-right: 10px;
        background: #f76B72;
        color: white;
        width: 100px;
        height: 20px;
        border-radius: 10px;
        cursor: pointer;
        justify-content: center;

      }

      .chatBox {
        display: flex;
        align-items: center;
        margin-right: 10px;
        background: #1B9AF7;
        color: white;
        width: 100px;
        height: 20px;
        border-radius: 10px;
        cursor: pointer;
        justify-content: center;
      }

      .gray {
        background: #999999;
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
