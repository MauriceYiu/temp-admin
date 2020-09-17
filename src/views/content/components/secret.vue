<template>
  <div class="secret">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="往期直播" name="first"></el-tab-pane>
          <el-tab-pane label="预备开播" name="second"></el-tab-pane>
          <el-tab-pane label="正在直播" name="third"></el-tab-pane>
          <!--<el-tab-pane label="待审核" name="fourth"></el-tab-pane>-->
        </el-tabs>
      </div>
      <div class="right">
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
      v-if="'first' === activeName"
      style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播人" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.liveType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入场价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收入" >
        <template slot-scope="scope">
          <span>{{(scope.row.price * scope.row.buyUser) | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付费人数">
        <template slot-scope="scope">
          <span>{{scope.row.buyUser}}</span>
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
            <el-button type="text" size="mini" @click="viewTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('content:live:detail')">查看</el-button>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('content:live:delete')">删除</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="list"
      stripe
      v-if="'second' === activeName"
      style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播人" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.liveType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入场价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约人数">
        <template slot-scope="scope">
          <span>{{scope.row.joinUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="'ok' === scope.row.status.value">
           开启
          </span>
          <span v-if="'pause' === scope.row.status.value">
           关闭
          </span>
          <!--<span>-->
            <!--<el-button type="success" size="mini" @click="dating(scope.row,false)"-->
                       <!--v-if="'ok' === scope.row.status.value">-->
              <!--关闭-->
            <!--</el-button>-->
            <!--<el-button type="success" size="mini" @click="dating(scope.row,true)"-->
                       <!--v-if="'pause' === scope.row.status.value">-->
              <!--开启-->
            <!--</el-button>-->
          <!--</span>-->
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
            <div class="status" v-if="hasPerm('content:live:enable')">
              <span v-if="'pause' === scope.row.status.value">关闭</span>
              <span v-if="'ok' === scope.row.status.value">开启</span>
              <el-switch
                @change="(value)=>{dating(scope.row,value)}"
                style="display: block"
                v-model="scope.row.enable"
                active-color="#13ce66">
              </el-switch>
            </div>
            <el-button type="text" size="mini" @click="viewTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('content:live:detail')">查看</el-button>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('content:live:delete')">删除</el-button>
            <!--<el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860"-->
                       <!--v-if="'first' !== activeName && hasPerm('content:live:edit')">编辑-->
            <!--</el-button>-->
            <!--<el-button type="success" size="mini" @click="start(scope.row)"-->
                       <!--v-if="'ok' === scope.row.status.value || 'pause' === scope.row.status.value">-->
              <!--设置为开始-->
            <!--</el-button>-->
            <!--<el-button type="success" size="mini" @click="live(scope.row)" v-if="'ing' === scope.row.status.value">-->
              <!--进入直播面板-->
            <!--</el-button>-->
            <!--<el-button type="success" size="mini" @click="finished(scope.row)" v-if="'ing' === scope.row.status.value">-->
              <!--设置为结束-->
            <!--</el-button>-->
          </div>

        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="list"
      stripe
      v-if="'third' === activeName"
      style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播人" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.liveType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入场价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="观看人数">
        <template slot-scope="scope">
          <span>{{scope.row.buyUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{  scope.row.status.text }}</span>
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
            <el-button type="text" size="mini" @click="viewTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('content:live:detail')">查看</el-button>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('content:live:delete')">删除</el-button>
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
</template>

<script>
  import {liveDating, liveDel, liveFinished, liveList, liveStart} from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "secret",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        listQuery: {
          endTime: 0,
          keyword: "",
          limit: 10,
          liveType: "secret",
          page: 0,
          startTime: 0,
//直播状态：cancel已取消，init审核中，failed审核失败，pause暂停中，ok审核通过待开播，ing直播中，finished直播完成
          statuses: ["finished"],
          teacherId: 0,
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
        adEnableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        }
      };
    },
    methods: {

      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        // console.log(tab.name, event, "tab");
        switch (tab.name) {
          case "first":
            this.listQuery.statuses = ["finished"]
            break;
          case "second":
            this.listQuery.statuses = ["pause", "ok"]
            break;
          case "third":
            this.listQuery.statuses = ["ing"]
            break;
          case "fourth":
            this.listQuery.statuses = ["init"]
            break;
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
        this.getList()
      },
// 列表
      getList() {
        this.listLoading = true;
        liveList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            json.data.forEach((item,index)=>{
              item.enable =  'ok' === item.status.value
            })
            this.list = json.data;
            this.total = json.total
          } else {

          }
        })
      },
      viewTag(data){
        this.$router.push({
          name: "viewDetail", params: {
            id: data
          }
        })
      },
      //删除分类
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该直播, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            liveDel(this.adDelParams).then(res => {
              // console.log(res,"res");
              if (res.status) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.adDelParams.targetId = "";
          });
      },

      addTag(data) {
        this.$router.push({
          name: "LiveDetail", params: {
            id: data
          }
        })
      },
      dating(live, bool) {
        console.log(bool,"bool");
        liveDating({
          yes: bool,
          targetId: live.id,
          token: getToken()
        }).then(res => {
          if (res.status === 200) {
            this.getList();
          } else {
            // this.$message.error(res.message);
          }
        });
      },
      start(live) {
        liveStart({
          targetId: live.id,
          token: getToken()
        }).then(res => {
          if (res.status === 200) {
            this.$message.success("请前往正在直播开始您的直播！");
            this.getList();
          } else {
            // this.$message.error(res.message);
          }
        });
      },
      finished(live) {
        liveFinished({
          targetId: live.id,
          token: getToken()
        }).then(res => {
          if (res.status === 200) {
            this.getList();
          } else {
            this.$message.error(res.message);
          }
        });
      },
      live(live) {
        console.log(live, "live");
        let id = live.sinaChannel.chatRoomId;
        let pushUrl = encodeURIComponent(live.sinaChannel.pushUrl);
        window.open("./chat/im/chatroom/room.html?id=" + id + "&publishUrl=" + pushUrl, "livePublish", "", true);
      },
    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .secret .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .secret .el-tabs__nav-scroll .el-tabs__nav {
    margin-left: 0;
  }

  .secret .el-tabs__content {
    display: none;
  }

  .secret .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .secret {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
    .filter-container {

      display: flex;
      justify-content: space-between;
      background: white;
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
    }
    img {
      width: 80px;
    }
    .el-table {
      min-height: calc(100vh - 260px);

    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
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
</style>
