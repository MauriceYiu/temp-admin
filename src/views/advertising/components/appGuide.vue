<template>
  <div class="appGuide">

    <el-table
      :data="list"
      stripe
      style="width: 100%">

      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.queue}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="ID">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="跳转类型">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.redirectType.text}}</span><br>-->
          <!--<span>{{scope.row.url}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picture" alt="">
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击量">
        <template slot-scope="scope">
          <span>{{scope.row.click}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
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
            <div class="status" v-if="hasPerm('ad:guide:appGuide:enable')">
              <span v-if="scope.row.enable">已启用</span>
              <span v-if="!scope.row.enable">已禁用</span>
              <el-switch
                @change="(value)=>{changeStatus(value,scope.row)}"
                style="display: block"
                v-model="scope.row.enable"
                active-color="#13ce66">
              </el-switch>
            </div>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('ad:guide:appGuide:delete')">删除</el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('ad:guide:appGuide:edit')">编辑</el-button>

          </div>

        </template>
      </el-table-column>
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
</template>

<script>

  import {
    adList,
    adEnable,
    adDel,
  } from "../../../api/ad";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "appGuide",
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          adType: "appGuide",
          enable: 0,
          // unionId: 0
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
      changeStatus(value,item){
        console.log(value);
        this.adEnableParams.targetId = item.id
        this.adEnableParams.yes = value
        adEnable(this.adEnableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },

// 列表
      getList() {
        this.listLoading = true;
        adList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      //删除分类
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该广告, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            adDel(this.adDelParams).then(res => {
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
          name: "appGuideDetail", params: {
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
  .appGuide {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;

    .filter-container {
      display: flex;
      justify-content: space-between;
      /*margin-bottom: 20px;*/
    }
    img {
      width: 80px;
      height: 80px;
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
    .el-table{
      min-height: calc(100vh - 200px);

    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }

  }
</style>
