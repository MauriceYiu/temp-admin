<template>
  <div class="customerService">

    <div class="filter-container">
      <div class="left">
        全部
      </div>
      <!--<div class="right">-->
      <!--<el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"-->
      <!--placeholder="搜索你想要的内容"-->
      <!--v-model="listQuery.keyword">-->
      <!--</el-input>-->
      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
      <!--搜索-->
      <!--</el-button>-->

      <!--</div>-->
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
      <el-table-column align="center" label="客服名称">
        <template slot-scope="scope">
          <span>{{scope.row.extra.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头衔">
        <template slot-scope="scope">
          <span>{{scope.row.extra.roleTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="简介">
        <template slot-scope="scope">
          <span>{{ scope.row.extra.roleIntro}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.extra.trueName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.gender.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务人数" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.service}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
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
            <div class="status">
              <span v-if="scope.row.enable">启用</span>
              <span v-if="!scope.row.enable">禁用</span>
              <el-switch
                @change="(value)=>{changeStatus(value,scope.row)}"
                style="display: block"
                v-model="scope.row.enable"
                active-color="#13ce66">
              </el-switch>
            </div>
            <!--<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>-->
            <el-button type="text" size="mini" @click="view(scope.row.id)" style="color: #F65860">查看</el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">编辑</el-button>
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
    <!--<pagination @fetchData="fetchData" :total="total"/>-->

    <el-dialog
      v-el-drag-dialog
      @dragDialog="handleDrag"
      title="添加或编辑分类"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="VIP级数">
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            placeholder="请输入VIP级数"
          />
        </el-form-item>
        <el-form-item label="累计充值悟空币" prop="title">
          <el-input
            style="width:600px;"
            type="number"
            v-model="formParams.value"
            placeholder="请输入累计输入悟空币"
          />
        </el-form-item>
        <el-form-item label="内容">
          <Tinymce1 id="Tinymce1" v-model="formParams.intro" :height="300"/>
        </el-form-item>
        <!--<el-form-item style="margin-bottom: 40px;" prop="title" label="VIP等级描述图片">-->
        <!--<el-upload-->
        <!--:http-request="Upload"-->
        <!--action=""-->
        <!--list-type="picture-card"-->
        <!--:file-list="uploadImages"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:on-remove="handleRemove">-->
        <!--<i class="el-icon-plus"></i>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
        <el-form-item label="课程所有人都可购买" prop="enable">
          <el-checkbox v-model="formParams.anyoneBuy"></el-checkbox>
        </el-form-item>

        <el-form-item label="课程高于此级别的免费" prop="enable">
          <el-checkbox v-model="formParams.freeForGreater"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            v-loading="loading"
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

  import {list, userEnable,} from "../../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "customerService",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogTableVisible: false,
        total: 0,
        page: 1,
        tableKey: 0,
        listQuery: {
          app: "staff",
          limit: 10,
          page: 0,
          role: "cs",
          token: getToken(),
        },
        list: [],
        listLoading: false,
        loading: false,
        formParams: {
          name: "",
          images: [],
          token: getToken(),
          value: "",
          intro: "",
          anyoneBuy: true,
          freeForGreater: true,
          vipId: 0
        },
        enableParams: {
          targetUserId: "",
          enable: true,
          token: getToken(),
        },
        delParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      changeStatus(value, item) {
        this.enableParams.targetUserId = item.id
        this.enableParams.enable = value
        userEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          }
        })
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
      beforeUpload() {

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
          this.uploadImages.push({
            name: file.file.name,
            url: result.url
          });
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
      //列表
      getList() {
        this.listLoading = true;
        list(this.listQuery).then(json => {
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
        });
      },

      //删除分类
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该技术老师, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            serviceDel(this.delParams).then(res => {
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
            this.delParams.targetId = "";
          });
      },
      addTag(id) {
        this.$router.push({
          name: "customerServiceDetail", params: {
            id: id
          }
        })
      },
      view(id) {
        this.$router.push({
          name: "viewcustomerService", params: {
            id: id
          }
        })
      },
      tagSubmitForm() {
        // console.log(this.formParams);
        // console.log(this.uploadImages);
        if (!this.formParams.name) {
          this.$message({
            message: "请输入vip名称",
            type: "error"
          });
          return false;
        }

        if (!this.value) {
          this.$message({
            message: "VIP等级达到金额",
            type: "error"
          });
          return false;
        }

        if (this.uploadImages.intro) {
          this.$message({
            message: "请输入权益说明",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.value = this.value * 100
        this.uploadImages.forEach((image, index) => {
          this.formParams.images.push(image.url)
        })
        // console.log(this.formParams.images,"this.formParams.images");
        serviceEdit(this.formParams).then(json => {
          // const json = response.data;
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.getList();
            this.formParams.name = "";
            this.formParams.images = [];
            this.formParams.value = "";
            this.value = "";
            this.formParams.vipId = "";
            this.formParams.anyoneBuy = true;
            this.formParams.freeForGreater = true;
          }


        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      // this.getList();\
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

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }
</style>
<style lang="scss" scoped>
  .customerService {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
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
