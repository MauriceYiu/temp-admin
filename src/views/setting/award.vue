<template>
  <div class="vip">
      <el-form class="form-container" ref="postForm" label-width="120px">
        <el-form-item label="直播分成">
          <el-input
            style="width:300px;"
            type="number"
            v-model="formParams.name"
            placeholder="直播分成"
          />
          <span class="text">%</span>
        </el-form-item>
        <el-form-item label="业务员分成" prop="title">
          <el-input
            style="width:300px;"
            type="number"
            v-model="formParams.value"
            placeholder="业务员分成"
          />
          <span class="text">%</span>
        </el-form-item>

        <el-form-item>
          <el-button
            v-loading="loading"
            style="margin-left: 10px;"
            type="success"
            @click="submitForm"
          >提交
          </el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>

  import {
    vipAll,
    vipDel,
    vipEdit,
    vipDetail,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'


  export default {
    name: "vip",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        total: 0,
        page: 1,
        tableStatus: false,
        activeName: "msg",
        value: "",
        tableKey: 0,
        listQuery: {
          limit: 10,
          page: 0,
          parentId: 0,
          type: "course"
        },
        secondParams: {
          limit: 10,
          page: 0,
          parentId: 0,
          type: "course"
        },
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        uploadImages: [],
        formParams: {
          name: "",
          images: [],
          token: getToken(),
          value: "",
          vipId: 0
        },
        vipDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
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
      load(tree, treeNode, resolve) {
        // console.log(11111, tree, treeNode, resolve)
        this.listLoading = true;
        this.secondParams.parentId = tree.id;
        vipAll(this.secondParams).then(response => {
          this.listLoading = false;
          const json = response.data;
          if (json.status) {
            resolve(json.data)
            // console.log(2, json.data);
          } else {

          }
        });
        // console.log(tree, treeNode);
      },
      //列表
      getList() {
        this.listLoading = true;
        vipAll().then(json => {
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
        this.vipDelParams.targetId = data.id;
        this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            vipDel(this.vipDelParams).then(res => {
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
            this.vipDelParams.targetId = "";
          });
      },

      //添加二级分类
      addSecondTag(data) {
        this.formParams.parentId = data.id;
        this.dialogTableVisible = true;
      },
      addTag(data) {
        this.dialogTableVisible = true;
        if (data) {
          this.formParams.name = data.name;
          this.uploadImages = [];
          data.images.forEach((image, index) => {
            this.uploadImages.push({
              name: index,
              url: image
            });
          });
          this.value = data.value / 100
          this.formParams.value = data.value;
          this.formParams.vipId = data.id;
        }
      },
      submitForm() {
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

        if (this.uploadImages.length === 0) {
          this.$message({
            message: "至少上传一张VIP等级描述图片",
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
        vipEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
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
          }else {

          }

        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      if (sessionStorage.getItem('settingVip') > -1) {
        this.listQuery.page = sessionStorage.getItem('componentCardSetting')
        this.page = parseInt(this.listQuery.page) + 1
      }
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

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }
</style>
<style lang="scss" scoped>
  .vip {
    padding: 15px;
    .filter-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
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
    .paginationBox {
      text-align: right;
      margin-top: 60px;
    }

    .imbox {
      display: flex;
      justify-content: center;
      .imgWrap {
        margin-right: 6px;
        img {
          width: 60px;
        }
      }
      .imgWrap:last-child {
        margin-right: 0;
      }
    }

  }
</style>
