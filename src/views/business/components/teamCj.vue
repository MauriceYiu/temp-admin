<template>
  <div class="teamCj">

    <!--列表 1 -->
    <div class="content">
      <div class="filter-container">
        <div class="top">
          <el-tabs v-model="activeSubName" @tab-click="handleClick">
            <!--<el-tab-pane label="今日排行" name="today">-->
            <!--</el-tab-pane>-->
            <el-tab-pane label="本月排行" name="mounth">
            </el-tab-pane>
            <!--<el-tab-pane label="整体排行" name="whole">-->
            <!--</el-tab-pane>-->
          </el-tabs>
          <el-date-picker
            v-show="activeSubName === 'mounth'"
            cellClassName="cellClassName"
            style="position: absolute;top:10px;left: 93px;border-radius: 0"
            v-model="monthValue"
            type="month"
            @change="changeMonth"
            placeholder="选择月">
          </el-date-picker>
        </div>
      </div>

      <el-table
        :data="list"
        stripe
        style="width: 100%">

        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="部门">
          <template slot-scope="scope">
            <span>{{scope.row.departmentName || "--"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业绩">
          <template slot-scope="scope">
            <span>{{scope.row.recharge | showDecimal}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="客户消费">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.consume | showDecimal}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="注册量">
          <template slot-scope="scope">
            <span>{{scope.row.register}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.time | parseTime('{y}-{m}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排名" class-name="lastTh">
          <template slot-scope="scope">
            <span style="color: #1B9AF7">{{(page-1)*10 + scope.$index + 1 }}</span>
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
</template>

<script>
  import {typeDel, typeEdit, types, vipAll,} from "@/api/settings";
  import {statisticsDepartmentRanking} from '../../../api/business'
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import {parseTime, showDecimal} from "@/utils/index";
  import pagination from '@/components/Pagination/index'

  export default {
    name: "teamCj",
    components: {
      pagination,
    },
    directives: {
      waves,
    },
    data() {
      return {
        monthValue: '',
        activeName: 'first',
        activeSubName: 'today',
        openIndex: 1,
        checkIndex: null,
        checkName: "",
        total: 0,
        page: 1,
        list: [],
        userList: [],
        vipData: [],
        listLoading: false,
        loading: false,
        listQuery: {
          limit: 10,
          page: 0,
          time: 0,
          timeType: 1,
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
      changeMonth() {
        //获取选择月第一天零点零分零秒
        var data = this.monthValue;
        data.setDate(1);
        data.setHours(0);
        data.setSeconds(0);
        data.setMinutes(0);
        console.log(parseTime(data.getTime()), "获取选择月第一天零点零分零秒");
        let time_mounth = parseTime(data.getTime());
        let timestamp_mounth = Date.parse(new Date(time_mounth)) / 1000;
        this.listQuery.timeType = 0;
        this.listQuery.time = timestamp_mounth;
        this.getList();
      },
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            this.vipData = json.data;
            this.getList()
          }
        });
      },
      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        // console.log(this.activeSubName);
        // time  时间，当月开始时间戳，当天开始时间戳，全部时为0
        //timeType  排行周期，默认0为月，1为当天，2为全部
        let start = new Date(new Date(new Date().toLocaleDateString()).getTime());       //如果不是当天换成你想获取0点的时间即可。10.21号1571587200000
        console.log(start, "start");
        let timestamp = Date.parse(new Date(start)) / 1000;
        switch (this.activeSubName) {
          case "today":
            this.listQuery.timeType = 1;
            this.listQuery.time = timestamp;

            break;
          case "mounth":
            //获取本月第一天零点零分零秒
            var data = new Date();
            data.setDate(1);
            data.setHours(0);
            data.setSeconds(0);
            data.setMinutes(0);
            console.log(parseTime(data.getTime()));
            let time_mounth = parseTime(data.getTime());
            let timestamp_mounth = Date.parse(new Date(time_mounth)) / 1000;
            this.listQuery.timeType = 0;
            this.listQuery.time = timestamp_mounth;
            break;
          case "whole":
            this.listQuery.timeType = 2;
            this.listQuery.time = 0;
            break;
        }
        this.getList();
      },
      checkUser(item, index) {
        // console.log(item,"item");
        this.checkIndex = index
        this.checkName = item.extra.trueName
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
      getList(id) {
        statisticsDepartmentRanking(this.listQuery).then(json => {
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },

    },
    mounted() {
      this.activeSubName = "mounth"
    }
  }
</script>
<style>

  .teamCj .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .teamCj .el-tabs__content {
    display: none;
  }

  .teamCj .top .el-tabs__active-bar {
    background: none;
  }

  .teamCj .filter-container .filter-item {
    margin-bottom: 0;
  }

  .teamCj .el-input {
    margin: 0 auto 30px;
  }

  .teamCj .el-table .lastTh .cell {
    color: #1B9AF7;
  }

  /*.teamCj .el-input__inner {*/
  /*!*border-radius: 30px;*!*/
  /*line-height: 34px;*/
  /*height: 34px;*/
  /*margin: 0 auto;*/
  /*}*/

  .teamCj .content .filter-container .el-tabs__nav {
    margin-left: 0;
  }

</style>
<style lang="scss" scoped>
  .teamCj {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
    .content {
      background: #ffffff;
      flex-grow: 1; //铺满盒子剩余空间

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
  }
</style>
