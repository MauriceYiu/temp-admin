<template>
  <div class="businessProductChild">

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

      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="封面图">-->
      <!--<template slot-scope="scope">-->
      <!--<div class="imbox">-->
      <!--<div class="imgWrap">-->
      <!--<img class="coverImage" :src="scope.row.coverImage" alt="">-->
      <!--</div>-->
      <!--</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="服务内容">
        <template slot-scope="scope">
          <span class="intro">{{ scope.row.intro}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分成比例">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="销量">
        <template slot-scope="scope">
          <span>{{ scope.row.sale}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.enable ? '启用':'禁用'}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="排序">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.queue}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
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
                v-if="hasPerm('business:service:enable')"
                v-model="scope.row.enable"
                active-color="#13ce66">
              </el-switch>
            </div>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('business:service:delete')">删除</el-button>
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

  import {
    serviceList,
    serviceDel,
    serviceEdit,
    serviceEnable,
  } from "../../../api/business";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "businessProductChild",
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
          limit: 10,
          page: 0,
          keyword: "",
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
          targetId: "",
          yes: true,
          token: getToken(),
        },
        serviceDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        serviceEnable(this.enableParams).then(json => {
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
        sessionStorage.setItem('settingVip', this.listQuery.page)
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
        serviceList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
            console.log(this.list, this.total);
          }
        });
      },

      //删除分类
      delTag(data) {
        this.serviceDelParams.targetId = data.id;
        this.$confirm("此操作将删除该业务, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            serviceDel(this.serviceDelParams).then(res => {
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
            this.serviceDelParams.targetId = "";
          });
      },
      addTag(id) {
        this.$router.push({
          name: "businessDetail", params: {
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

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }
</style>
<style lang="scss" scoped>
  .businessProductChild {
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
    .intro{
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
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
