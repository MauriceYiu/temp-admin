<template>
  <div class="recharge">

    <div class="filter-container">
      <el-select
        class="filter-item"
        style="width: 150px"
        v-model="listQuery.platform"
        placeholder="平台类型"
        @change="getList"
      >
        <el-option
          v-for="item in tagTypeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-plus"
        @click="addTag(0)"
      >添加
      </el-button>
    </div>
    <el-table :data="list" row-key="id" border lazy   style="width: 100%;">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台类型">
        <template slot-scope="scope">
          <span>{{scope.row.platform.value}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值悟空币">
        <template slot-scope="scope">
          <span>{{scope.row.actually | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所需金额">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="赠送金额">
        <template slot-scope="scope">
          <span>{{scope.row.gift | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
         <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.queue}}</span>
        </template>
      </el-table-column>


      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addTag(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delTag(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
            v-model="formParams.platform"
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
        <el-form-item label="悟空币">
          <el-input
            style="width:500px;"
            type="number"
            v-model="formParams.actuallyFormat"
            placeholder="请输入到账悟空币"
          />
        </el-form-item>
        <el-form-item label="赠送悟空币">
          <el-input
            style="width:500px;"
            type="number"
            v-model="formParams.giftFormat"
            placeholder="请输入赠送悟空币"
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
          <el-input type="number" placeholder="数字越大越靠前" v-model="formParams.queue"  style="width:500px;"></el-input>
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
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime,showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "recharge",
    directives: {
      waves,
      elDragDialog
    },
    data() {
      return {
        tableStatus: false,
        activeName: "msg",
        tableKey: 0,
        listQuery: {
          enable: 0,   //是否启用，0代表所有，1代表启用，2代表未启用
          limit: 15,
          page: 0,
          platform: null,
          token: getToken(),
        },
        list: [],
        listLoading: false,
        tagTypeOptions: [
          {
            key: null,
            label: "全部"
          },
          {
            key: "android",
            label: "android"
          },
          {
            key: "ios",
            label: "ios"
          },
        ],
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
        createdTimes: 0,
        fields: [],
        rules: {},
        loading: false,
        dialogTableVisible: false,
        formParams: {
          //添加或编辑
          enable: true,
          gift: null,
          giftFormat: null,
          name: "",
          platform: null,
          price: null,
          priceFormat: null,
          actually: null,
          actuallyFormat: null,
          queue: null,
          rechargeCardId: null,
          token: getToken(),
        },
        rechargeCardDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      beforeUpload() {

      },
      tagTypeChange(value) {
        this.formParams.platform = value;
      },
      Upload(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        // console.log(file.file);
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.logo = result.url
        })

      },

      getCardSetting() {
        // console.log(this.activeName,'ceshi');
        sessionStorage.setItem('activeName', this.activeName)
        switch (this.activeName) {
          case "cardSetting":
            this.$refs.cardSetting.openList();
            break;
          default:
            break;
        }
      },
      load1(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve()
        }, 1000)
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        rechargeCardList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
          } else {

          }
        });
      },
      // tagTypeChange(value) {
      //   console.log(value);
      //   this.formParams.vipId = value;
      //   this.getList();
      // },
      initData() {
        globalRuleGet().then(response => {
          const json = response.data;
          if (json.status) {
            this.rules = json.data.rule;
            this.fields = json.data.params;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },

      //删除分类
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
              if (res.status) {
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
        console.log(data,"data");
        this.dialogTableVisible = true;
        if (data) {
          this.formParams.enable = data.enable;
          this.formParams.giftFormat = data.gift/100;
          this.formParams.priceFormat = data.price/100;
          this.formParams.actuallyFormat = data.actually/100;
          this.formParams.name = data.name;
          this.formParams.platform = data.platform.value;
          this.formParams.queue = data.queue;
          this.formParams.rechargeCardId = data.id;
        }
      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.platform) {
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
            message: "请输入到账悟空币",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.giftFormat) {
          this.$message({
            message: "请输入赠送悟空币",
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
        this.formParams.gift = this.formParams.giftFormat*100;
        this.formParams.price = this.formParams.priceFormat*100;
        this.formParams.actually = this.formParams.actuallyFormat*100;
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
              platform: null,
              price: null,
              priceFormat: null,
              actually: null,
              actuallyFormat: null,
              queue: null,
              rechargeCardId: null,
              token: getToken(),
            }
          } else {

          }

        });
      },
      handleDrag() {
        // this.$refs.select.blur()
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
  .recharge {
    padding: 15px;
    .hiderow {
      visibility: hidden;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .logo{
      width: 60px;
    }

  }
</style>
