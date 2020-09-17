<template>
  <div class="newsChild">
    <div class="filter-container">
      <div class="left">
        <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
        <!--<el-tab-pane label="已上传" name="first"></el-tab-pane>-->
        <!--<el-tab-pane label="待审核" name="second"></el-tab-pane>-->
        <!--<el-tab-pane label="审核失败" name="third"></el-tab-pane>-->
        <!--</el-tabs>-->
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
      style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布人" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="级别">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.vip.name}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="价格/优惠价">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.preferPrice === 0 || scope.row.price === 0 ">免费</span>-->
          <!--<span v-else>{{scope.row.price | showDecimal}} / {{ scope.row.preferPrice === -1 ? '无优惠': (scope.row.preferPrice  | showDecimal) }}   </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="收入">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.saleTotal | showDecimal}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <span>{{getTypeName(scope.row.types)}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span>{{scope.row.tags.join("、")}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.enable ? '启用':'禁用'}}</span>
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
            <div class="status" v-if="hasPerm('content:news:enable')">
              <span v-if="scope.row.enable">已启用</span>
              <span v-if="!scope.row.enable">已禁用</span>
              <el-switch
                @change="(value)=>{changeStatus(value,scope.row)}"
                style="display: block"
                v-model="scope.row.enable"
                active-color="#13ce66">
              </el-switch>
            </div>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA"
                       v-if="hasPerm('content:news:delete')">删除
            </el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860"
                       v-if="hasPerm('content:news:edit')">编辑
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
  </div>
</template>

<script>
  import {courseDel, courseEnable, courseList,} from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "newsChild",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        listQuery: {
          checkStatus: "success",
          createUserId: null,
// 是否免费，0所有，1免费，2不免费
          free: 0,
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          // 是否优惠，0所有，1仅优惠，2非优惠
          prefer: 0,
          recommend: 0,
          token: getToken(),
// 收藏类型：book书本课程、news资讯、tech技术课程收藏类型：book书本课程、news资讯、tech技术课程
          type: "news",
          typeId: 0
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
        this.listQuery.page = 0
        // console.log(tab.name, event, "tab");
        switch (tab.name) {
          case "first":
            this.listQuery.checkStatus = "success"
            break;
          case "second":
            this.listQuery.checkStatus = "checking"
            break;
          case "third":
            this.listQuery.checkStatus = "failed"
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
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      changeStatus(value, item) {
        console.log(value);
        this.adEnableParams.targetId = item.id
        this.adEnableParams.yes = value
        courseEnable(this.adEnableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

          }
        })
      },

// 列表
      getList() {
        this.listLoading = true;
        courseList(this.listQuery).then(json => {
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
      //删除分类
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该资讯, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            courseDel(this.adDelParams).then(res => {
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
      getTypeName(types) {
        let arr = []
        types.forEach((item, index) => {
          arr.push(item.name)
        })

        return arr.join("、")
      },
      addTag(data) {
        this.$router.push({
          name: "newsDetail", params: {
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

  .newsChild .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .newsChild .el-tabs__content {
    display: none;
  }

  .newsChild .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .newsChild {
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
