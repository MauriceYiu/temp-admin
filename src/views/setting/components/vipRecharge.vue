<template>
  <div class="vipRecharge">
    <!--<div class="head">-->
    <!--<div class="back">-->
    <!--帮助文档-->
    <!--<div class="line"></div>-->
    <!--</div>-->
    <!--<div class="save" @click="addTag(0)">新建</div>-->
    <!--</div>-->
    <div class="content">
      <div class="client">
        <div class="filter-container">
          <div class="left">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="安卓" name="android"></el-tab-pane>
              <el-tab-pane label="IOS" name="ios"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="right">
            <span @click="addTag(0)" v-if="hasPerm('settings:members:recharges:add')">添加</span>
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
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="充值币">
            <template slot-scope="scope">
              <span>{{scope.row.actually | showDecimal}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="赠送币">
            <template slot-scope="scope">
              <span>{{scope.row.gift | showDecimal}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="付费金额">
            <template slot-scope="scope">
              <span>{{scope.row.price | showDecimal}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.enable ? '启用':'禁用'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <div class="action">
                <!--<div class="status">-->
                <!--<span v-if="scope.row.enable">启用</span>-->
                <!--<span v-if="!scope.row.enable">禁用</span>-->
                <!--<el-switch-->
                <!--@change="(value)=>{changeStatus(value,scope.row)}"-->
                <!--style="display: block"-->
                <!--v-model="scope.row.enable"-->
                <!--active-color="#13ce66">-->
                <!--</el-switch>-->
                <!--</div>-->
                <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('settings:members:recharges:delete')">删除</el-button>
                <el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860" v-if="hasPerm('settings:members:recharges:edit')">编辑</el-button>

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

    <el-dialog
      v-el-drag-dialog
      @dragDialog="handleDrag"
      title="添加或编辑"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <el-form class="form-container" ref="postForm" label-width="120px">

        <el-form-item label="选择平台" prop="title">
          <el-select
            class="filter-item"
            style="width:500px;"
            v-model="formParams.applicablePlatform"
            placeholder="请选择"
            @change="tagTypeChange"
          >
            <el-option
              v-for="item in formOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            style="width:500px;"
            v-model="formParams.name"
            placeholder="请输入充值卡名称"
          />
        </el-form-item>
        <el-form-item label="充值币">
          <el-input
            style="width:500px;"
            type="number"
            v-model="formParams.actuallyFormat"
            placeholder="请输入到账币"
          />
        </el-form-item>
        <el-form-item label="赠送币">
          <el-input
            style="width:500px;"
            type="number"
            v-model="formParams.giftFormat"
            placeholder="请输入赠送币"
          />
        </el-form-item>

        <el-form-item label="花费金额">
          <el-input
            style="width:500px;"
            type="number"
            v-model="formParams.priceFormat"
            placeholder="请输入花费金额(元)"
          />
        </el-form-item>
        <el-form-item label="顺序">
          <el-input type="number" placeholder="数字越大越靠前" v-model="formParams.queue" style="width:500px;"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-checkbox v-model="formParams.enable"></el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            style="margin-left: 10px;"
            type="success"
            @click="tagSubmitForm"
          >保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import {
    rechargeCardList,
    rechargeCardEdit,
    rechargeCardDel,
  } from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "vipRecharge",
    directives: {
      waves,
      elDragDialog,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        activeName: 'android',
        formOptions: [
          {
            key: "android",
            label: "安卓"
          },
          {
            key: "ios",
            label: "IOS"
          },
        ],
        dialogTableVisible: false,
        rechargeCardDelParams: {
          targetId: 0,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        listQuery: {
          enable: 0,   //是否启用，0代表所有，1代表启用，2代表未启用
          limit: 15,
          page: 0,
          applicablePlatform: "android",
          token: getToken(),
        },
        formParams: {
          //添加或编辑
          enable: true,
          gift: null,
          giftFormat: null,
          name: "",
          applicablePlatform: null,
          price: null,
          priceFormat: null,
          actually: null,
          actuallyFormat: null,
          queue: null,
          rechargeCardId: null,
          token: getToken(),
        },

      };
    },
    methods: {
      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        // console.log(tab.name, event, "tab");
        switch (tab.name) {
          case "android":
            this.listQuery.applicablePlatform = "android"
            break;
          case "ios":
            this.listQuery.applicablePlatform = "ios"
            break;
        }

        this.getList()
      },
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        courseEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

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
      tagTypeChange(value) {
        this.formParams.applicablePlatform = value;
      },
      delTag(data) {
        this.rechargeCardDelParams.targetId = data.id;
        this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            rechargeCardDel(this.rechargeCardDelParams).then(res => {
              // console.log(res,"res");
              if (res.status === 200) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.rechargeCardDelParams.targetId = "";
          });
      },
      addTag(data) {
        this.dialogTableVisible = true;
        if (data) {
          this.formParams.enable = data.enable;
          this.formParams.giftFormat = data.gift / 100;
          this.formParams.priceFormat = data.price / 100;
          this.formParams.actuallyFormat = data.actually / 100;
          this.formParams.name = data.name;
          this.formParams.applicablePlatform = data.platform.value;
          this.formParams.queue = data.queue;
          this.formParams.rechargeCardId = data.id;
        }else {
          this.formParams ={
            //添加或编辑
            enable: true,
            gift: null,
            giftFormat: null,
            name: "",
            applicablePlatform: null,
            price: null,
            priceFormat: null,
            actually: null,
            actuallyFormat: null,
            queue: null,
            rechargeCardId: null,
            token: getToken(),
          }
        }
      },
      handleDrag() {
        // this.$refs.select.blur()
      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.applicablePlatform) {
          this.$message({
            message: "请选择平台类型",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.name) {
          this.$message({
            message: "请输入充值卡名称",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.actuallyFormat) {
          this.$message({
            message: "请输入到账币",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入花费金额",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.gift = this.formParams.giftFormat * 100;
        this.formParams.price = this.formParams.priceFormat * 100;
        this.formParams.actually = this.formParams.actuallyFormat * 100;
        rechargeCardEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
            this.dialogTableVisible = false;
            this.getList();
            this.formParams = {
              enable: true,
              gift: null,
              giftFormat: null,
              name: "",
              applicablePlatform: null,
              price: null,
              priceFormat: null,
              actually: null,
              actuallyFormat: null,
              queue: null,
              rechargeCardId: null,
              token: getToken(),
            }
          } else {
            this.$message({
              message: json.message,
              type: json.status === 200 ? "success" : "error"
            });
          }

        });
      },
      //列表
      getList() {
        this.listLoading = true;
        rechargeCardList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        });
      },

    },
    mounted() {
      // this.getList()
    }
  };
</script>
<style>

  .vipRecharge .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .vipRecharge .el-tabs__content {
    display: none;
  }

  .vipRecharge .filter-container .filter-item {
    margin-bottom: 0;
  }
  .vipRecharge  .filter-container .el-tabs__nav{
    margin-left: 0;
  }
</style>
<style lang="scss" scoped>
  .vipRecharge {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding:0 20px;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
      .right {
        font-size: 14px;
        color: #F65860;
        cursor: pointer;
        /*padding-right: 59px;*/
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
    .el-table{
      min-height: calc(100vh - 260px);

    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }

  }
</style>
