<template>
  <div class="personalCj">
    <div class="leftMain">
      <!--<div class="department" @click="openIndex=2"> + 添加部门</div>-->
      <div class="alldepartment" style="color: #409EFF"> 本月业绩排行前十</div>

      <div class="leftList">
        <div class="list">
          <div class="item" v-if="index<10" v-for="(item,index) in userList"
               :key="index" @click="checkUser(item,index)">
            <span class="num">{{index+1}}</span>
            <div class="imgWrap">
              <img v-if="item.staffAvatar" :src="item.staffAvatar" alt="">
              <img v-else src="../../../assets/dianzan.png" alt="">
            </div>

            <div class="userInfo">
              <div class="left">
                <span class="name">{{item.staffName}}</span>
                <span class="subName">{{item.staffAccount}}</span>
              </div>
              <div class="right">
                {{item.recharge | showDecimal}}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>

    <!--列表 1 -->
    <div class="rightMain">
      <div class="filter-container">
        <div class="top">
          <el-tabs v-model="activeSubName" @tab-click="handleClick">
            <el-tab-pane label="今日排行" name="today">
            </el-tab-pane>
            <!--<el-tab-pane label="本月排行" name="mounth">111-->
            <!--</el-tab-pane>-->

            <el-tab-pane name="mounth">
              <span slot="label">本月排行
                <!--<i style="margin-left: 10px" class="el-icon-date">-->


                <!--</i>-->
              </span>
              我的行程
            </el-tab-pane>

          </el-tabs>
          <el-date-picker
            v-show="activeSubName === 'mounth'"
            cellClassName="cellClassName"
            style="position: absolute;top:30px;left: 503px;"
            v-model="monthValue"
            type="month"
            @change="changeMonth"
            placeholder="选择月">
          </el-date-picker>
        </div>
        <div class="save" @click="cvsExport">导出</div>
      </div>

      <el-table
        :data="list"
        stripe
        style="width: 100%">

        <!--<el-table-column align="center" label="ID" width="80">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.staffId}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.staffName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.staffAccount || "--"}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="部门">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.departmentName || "&#45;&#45;"}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="业绩">
          <template slot-scope="scope">
            <span>{{scope.row.recharge | showDecimal}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册量">
          <template slot-scope="scope">
            <span>{{scope.row.register}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span v-if="activeSubName === 'mounth'">{{scope.row.createTime | parseTime('{y}-{m}')}}</span>
            <span v-if="activeSubName === 'today'">{{scope.row.createTime | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="客户消费">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.consume | showDecimal}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="排名" class-name="lastTh">
          <template slot-scope="scope">
            <!--<span>{{scope.$index + 1 }}</span>-->
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
import {typeDel, typeEdit, types, vipAll,} from "@/api/settings";
import {statisticsRanking} from '@/api/business'
import waves from "@/directive/waves"; // 水波纹指令
import {parseTime, showDecimal} from "@/utils/index";
import {getToken} from '@/utils/auth'
import pagination from '@/components/Pagination/index'

export default {
  name: "personalCj",
  components: {
    pagination,
  },
  directives: {
    waves,
  },
  data() {
    return {
      activeName: 'first',
      activeSubName: 'mounth',
      openIndex: 1,
      checkIndex: null,
      checkName: "",
      total: 0,
      page: 1,
      list: [],
      monthValue: '',
      userList: [],
      vipData: [],
      listLoading: false,
      loading: false,
      listQueryUser: {
        limit: 10,
        page: 0,
        time: 0,
        token: getToken()
      },
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
    cvsExport() {
      let url = "http:" + window.API_BASE_URI + '/api/v1/statistics/ranking/export?token=' + encodeURIComponent(getToken()) + "&timeType=" + this.listQuery.timeType + "&timestamp=" + this.listQuery.time;
      window.open(url, '_blank')
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
    handleClick(tab, event) {
      // this.list =  []
      this.page = 1;
      this.total = 0;
      this.listQuery.page = 0;
      let start = new Date(new Date(new Date().toLocaleDateString()).getTime());       //如果不是当天换成你想获取0点的时间即可。10.21号1571587200000
      let timestamp = Date.parse(new Date(start)) / 1000;
      switch (this.activeSubName) {
        case "today":
          console.log(start, "start");
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
          console.log(parseTime(data.getTime()), "222222");
          this.listQuery.timeType = 0;
          this.listQuery.time = parseInt(data.getTime() / 1000);
          break;
      }
      this.getList();
    },
    checkUser(item, index) {
      // // console.log(item,"item");
      // this.checkIndex = index
      // this.checkName = item.extra.trueName
      // this.getList(item.id)
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
      this.getList()
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
      statisticsRanking(this.listQuery).then(json => {
        if (json.status === 200) {
          // this.userList = json.data;
          this.list = json.data;
          this.total = json.total
        }
      })
    },
    getMounthTen() {
      //获取本月第一天零点零分零秒
      var data = new Date();
      data.setDate(1);
      data.setHours(0);
      data.setSeconds(0);
      data.setMinutes(0);
      console.log(parseTime(data.getTime()));
      this.listQuery.timeType = 0;
      this.listQuery.time = parseInt(data.getTime() / 1000);

      statisticsRanking(this.listQuery).then(json => {
        if (json.status === 200) {
          this.userList = json.data;
        }
      })
    },

  },
  mounted() {
    this.getMounthTen();
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

  .rightMain .top .el-tabs__active-bar {
    background: none;
  }

  .rightMain .filter-container .filter-item {
    margin-bottom: 0;
  }

  .leftMain .el-input {
    margin: 0 auto 30px;
  }

  .leftMain .el-input__inner {
    border-radius: 30px;
    line-height: 34px;
    height: 34px;
    margin: 0 auto;
  }

  .ranking .rightMain .el-tabs__nav {
    margin-left: 0;
  }

  .personalCj .el-table .lastTh .cell {
    color: #1B9AF7;
  }
</style>
<style lang="scss" scoped>
  .personalCj {
    display: flex;
    background: rgba(245, 246, 250, 0.61);
    margin: 20px;
    min-height: calc(100vh - 140px);

    .leftMain {
      width: 280px;
      margin-right: 20px;
      background: #ffffff;

      .alldepartment {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border-bottom: 1px solid #f2f2f2;
      }

      .el-tree {
        background: #ffffff;
      }

      .leftList {
        padding: 0 20px;

        .list {
          .item {
            /*border: 1px solid red;*/
            height: 60px;
            border-left: 3px solid #ffffff;
            display: flex;
            align-items: center;
            /*cursor: pointer;*/
            .num {
              color: #686868;
              font-size: 14px;
            }

            .imgWrap {
              width: 34px;
              height: 34px;
              border-radius: 50%;
              margin-left: 10px;
              margin-right: 10px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;

              }
            }

            .userInfo {
              display: flex;
              flex-grow: 1;
              justify-content: space-between;

              .left {
                display: flex;
                flex-direction: column;

                .name {
                  font-size: 14px;
                  color: #101010;
                  margin-bottom: 6px;
                }

                .subName {
                  font-size: 12px;
                  color: #999999;
                }
              }

              .right {
                font-size: 17px;
                font-weight: bold;
                display: flex;
                justify-content: flex-end;
                align-items: center;
              }
            }

          }

          .activeItem {
            border-left: 3px solid #5BC0DF;
          }
        }
      }
    }

    .rightMain {
      background: #ffffff;
      flex-grow: 1; //铺满盒子剩余空间
      .filter-container {
        height: 60px;
        display: flex;
        justify-content: space-between;
        background: white;
        padding: 0 20px;
        border-bottom: 1px solid #f2f2f2;
        align-items: center;

        .save {
          color: #F65860;
          cursor: pointer;
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
  }

</style>
