<template>
  <div class="PKlistTeam">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="未判定" name="first"></el-tab-pane>
          <el-tab-pane label="已判定" name="second"></el-tab-pane>
        </el-tabs>
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

      <el-table-column align="center" label="PK项目">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PK判定">
        <template slot-scope="scope">
          <span>{{scope.row.rule}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PK筹码">
        <template slot-scope="scope">
          <span>{{scope.row.reward}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PK甲方">
        <template slot-scope="scope">
          <span>{{scope.row.fromName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PK乙方">
        <template slot-scope="scope">
          <span>{{scope.row.toName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.winnerId === 0 ? '进行中':'已结束'}}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="activeName === 'first'"
        style="color:#5BC0DF;"
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="action">
            <div class="judge" @click="openDialog(scope.row)" v-if="hasPerm('business:pk:assign')">
              判定
            </div>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('business:pk:delete')">删除</el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860" v-if="hasPerm('business:pk:edit')">编辑</el-button>

          </div>

        </template>
      </el-table-column>

      <el-table-column
        v-if="activeName === 'second'"
        style="color:#5BC0DF;"
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="action">
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('business:pk:delete')">删除</el-button>
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

    <el-dialog title="PK判定" :visible.sync="dialogFormVisible">
      <el-form :model="pkWinParams">
        <el-form-item label="胜方" :label-width="formLabelWidth">
          <el-select
            class="filter-item"
            style="width:50%"
            v-model="pkWinParams.winnerId"
            placeholder="请选择胜方"
          >
            <el-option
              v-for="item in winnerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

        </el-form-item>


        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            style="width:70%"
            placeholder="输入内容"
            v-model="pkWinParams.content"
            rows="4"
            type='textarea'>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tagSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {
    list,
  } from "../../../api/user";
  import {
    pkList,
    pkDel,
    pkWin,
  } from "../../../api/business";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "PKlistTeam",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        total: 0,
        dialogFormVisible: false,
        page: 1,
        list: [],
        winnerOptions: [],
        delParams: {
          targetId: "",
          token: getToken(),
        },
        pkWinParams: {
          pkId: null,
          winnerId: null,
          token: getToken(),
        },
        formLabelWidth: "80px",
        listQuery: {
          limit: 10,
          winner: 2,   //是否判定，0为所有，1为已判定，2为未判定")
          page: 0,
          type: "team",
          token: getToken(),
        }

      };
    },
    methods: {
      addTag(data) {
        this.$router.push({
          name: "pkDetail", params: {
            id: data.id,
            type:"team"
          }
        })
      },
      openDialog(data) {
        this.dialogFormVisible  = true;
        this.pkWinParams.pkId =data.id;
        this.winnerOptions = [
          {
            id:data.fromId,
            name:data.fromName,
          },{
            id:data.toId,
            name:data.toName,
          },
        ]
      },
      //删除分类
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该PK, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            pkDel(this.delParams).then(res => {
              if (res.status) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.delParams.targetId = "";
          });
      },
      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        // console.log(tab.name, event, "tab");
        switch (tab.name) {
          case "first":
            this.listQuery.winner = 2;
            break;
          case "second":
            this.listQuery.winner = 1;
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
        pkList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      tagSubmitForm() {
        if (!this.pkWinParams.winnerId) {
          this.$message({
            message: "请选择胜方",
            type: "error"
          });
          return false;
        }

        pkWin(this.pkWinParams).then(res => {
          if (res.status) {
            this.$message.success(this.pkWinParams.winnerId + "胜出，已判定列表可查看！");
            this.dialogFormVisible = false
            this.getList();
          } else {
            this.$message.error(res.message);
          }
        });
      },
    },
    mounted() {

    }
  };
</script>
<style>

  .PKlistTeam .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .PKlistTeam .el-tabs__content {
    display: none;
  }

  .PKlistTeam .filter-container .filter-item {
    margin-bottom: 0;
  }

  .PKlistTeam .el-tabs__nav-wrap::after {
    background: none;
  }

  .PKlistTeam .filter-container .left .el-tabs__nav {
    margin-left: 0;
  }
</style>
<style lang="scss" scoped>
  .PKlistTeam {
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
      .judge {
        display: flex;
        align-items: center;
        margin-right: 20px;
        background: #1B9AF7;
        color: white;
        padding: 2px 15px;
        border-radius: 20px;
        cursor: pointer;
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
