<template>
  <div class="liveCheck">
    <div class="filter-container">
      <el-select
        class="filter-item"
        style="width: 150px"
        v-model="listQuery.status"
        placeholder="状态"
        @change="getList()"
      >
        <el-option
          v-for="item in tagTypeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
    </div>
    <el-table :data="list" row-key="id" border style="width: 100%;">
      <!--<el-table-column align="center" label="ID">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{scope.row.id}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="发布者">
        <template slot-scope="scope">
          <span class="link-type" @click="goDetails(scope.row.teacherId)">{{scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播间名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.liveType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="观看人数">
        <template slot-scope="scope">
          <span class="link-type" @click="goDetails(scope.row.id)">{{scope.row.joinUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status.text}}</span>
          <span class="red" v-if="scope.row.status.value==='failed'">{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="view(scope.row.id)">查看</el-button>
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

  import {
    liveList,
    courseEdit,
    liveDel,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime,showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "liveCheck",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: "msg",
        tagTypeOptions: [
          {
            key: null,
            label: "全部"
          },{
            key: "init",
            label: "审核中"
          },
          {
            key: "failed",
            label: "审核失败"
          },
          {
            key: "ok",
            label: "审核通过待开播"
          },
          {
            key: "ing",
            label: "直播中"
          },
          {
            key: "pause",
            label: "暂停中"
          },
          {
            key: "finished",
            label: "直播完成"
          }
        ],
        listQuery: {
          endTime: 0,
          startTime: 0,
          status: null,  //直播状态：init审核中，failed审核失败，ok审核通过待开播，ing直播中，pause暂停中，finished直播完成
          keyword: "",
          limit: 10,
          page: 0,
          typeId: 0
        },
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        liveDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      view(data) {
        this.$router.push({
          name: "liveView", params: {
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
      load1(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve()
        }, 1000)
      },
      load(tree, treeNode, resolve) {
        console.log(11111, tree, treeNode, resolve)
        this.listLoading = true;
        this.secondParams.parentId = tree.id;
        liveList(this.secondParams).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            resolve(json.data)
            // console.log(2, json.data);
          }
        });
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        liveList(this.listQuery).then(json => {
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
    },
    mounted() {
      this.getList();
    }
  };
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style lang="scss" scoped>
  .liveCheck {
    padding: 15px;
    .filter-container {
      display: flex;
      justify-content: space-between;
      /*margin-bottom: 20px;*/
    }
    .hiderow {
      visibility: hidden;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .logo {
      width: 60px;
    }
    .red{
      color: red;
    }

  }
</style>
