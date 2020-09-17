<template>
  <div class="liveView">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="上传者">
        <span>{{uploader}}</span>
      </el-form-item>
      <el-form-item label="名称">
        <span>{{formParams.title}}</span>
      </el-form-item>
      <el-form-item label="类型" prop="title">
        <span>{{formParams.liveTypeText}}</span>
      </el-form-item>

      <el-form-item label="价格">
        <span>{{formParams.priceFormat}}</span>
      </el-form-item>
      <el-form-item label="开播时间">
        <span>{{valuePicker | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </el-form-item>
      <el-form-item label="介绍">
        <span>{{formParams.intro}}</span>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="直播封面">
        <img class="coverImage" v-if="formParams.coverImage" :src="formParams.coverImage">
      </el-form-item>
      <el-form-item v-if="status ==='init'">
        <el-button  @click="refuse">拒绝</el-button>
        <el-button type="success" @click="passCheck">通过</el-button>
      </el-form-item>
      <el-form-item  v-if="status ==='failed'">
        <span style="color: red">审核失败！</span>
      </el-form-item>
      <el-form-item v-if="status ==='ok'">
        <span style="color: green">审核通过待开播！</span>
      </el-form-item>
      <el-form-item v-if="status ==='ing'">
        <span style="color: green">直播中！</span>
      </el-form-item>
      <el-form-item v-if="status ==='pause'">
        <span style="color: green">暂停中！</span>
      </el-form-item>
      <el-form-item v-if="status ==='finished'">
        <span style="color: green">直播完成！</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {
    liveCheck,
    liveDetail,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "liveView",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        status:"",
        vipOptions: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        typeOptions: [
          {
            key: "pub",
            label: "公开"
          },
          {
            key: "secret",
            label: "密训"
          },
          {
            key: "dating",
            label: "邀约"
          },
        ],
        valuePicker: '',
        dialogVisible: false,
        total: 0,
        page: 1,
        tableStatus: false,
        activeName: "msg",
        value: "",
        uploader: "",
        tableKey: 0,
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        uploadImages: [],
        formParams: {
          liveType: "",
          liveTypeText: "",
          liveId: 0,
          coverImage: "",
          intro: "",
          price: 0,
          priceFormat: null,
          startTime: 0,
          title: "",
          token: getToken(),
        },
        checkParams:{
          changeTo: null,
          targetId: 0,
          reason: "",
          token: getToken(),
        },
      };
    },
    methods: {
      //拒绝审核
      refuse() {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s|\S]{1,}$/,
          inputErrorMessage: '理由不能为空'
        }).then(({value}) => {
          this.checkParams.changeTo = "failed"
          this.checkParams.targetId = this.formParams.liveId
          this.checkParams.reason = value;
          liveCheck(this.checkParams).then(json => {
            if (json.status ===200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });
              this.$router.push({name:"liveCheck"})
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },
      //通过审核
      passCheck() {
        this.checkParams.targetId = this.formParams.liveId
        this.checkParams.changeTo = "success"
        liveCheck(this.checkParams).then(json => {
          if (json.status ===200) {
            this.$message.success('审核通过！')
            this.$router.push({name:"liveCheck"})
          } else
            this.$message({message: json.message})
        })
      },
      typeChange(value) {
        this.formParams.typeId = value;
      },
      vipChange(value) {
        this.formParams.vipId = value;
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      initData() {
        liveDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.status = json.data.status.value;
            this.uploader = json.teacher.name;
            this.formParams.liveType = json.data.liveType.value;
            this.formParams.liveTypeText = json.data.liveType.text;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.intro = json.data.intro;
            this.formParams.liveId = json.data.id;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.valuePicker = json.data.startTime * 1000
            this.formParams.title = json.data.title;
          }
        });


      },
      tagSubmitForm() {
        if (!this.formParams.title) {
          this.$message({
            message: "请输入直播名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.liveType) {
          this.$message({
            message: "请选择类型",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入价格",
            type: "error"
          });
          return false;
        }
        console.log(this.valuePicker);
        if (!this.valuePicker) {
          this.$message.error('选择开播时间！')
          return
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "请输入直播介绍",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.coverImage) {
          this.$message({
            message: "请上传直播封面",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.price = this.formParams.priceFormat * 100
        liveEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "Live"
            })
            this.formParams = {
              liveType: "",
              liveId: 0,
              coverImage: "",
              intro: "",
              price: 0,
              priceFormat: null,
              startTime: 0,
              title: "",
              token: getToken(),
            }

          }else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
          // const json = response.data;

        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
    }
  };
</script>
<style>
  .el-form-item__label{
    padding-right: 30px;
  }
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
  .liveView {
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
      /*margin-top: 60px;*/
    }

    .coverImage {
      width: 140px;
    }


  }
</style>
