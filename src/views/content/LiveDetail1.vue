<template>
  <div class="LiveDetail">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="名称">
        <el-input
          style="width:600px;"
          v-model="formParams.title"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="类型" prop="title">

        <el-select
          class="filter-item"
          style="width: 600px"
          v-model="formParams.liveType"
          placeholder="请选择类型"
          @change="typeChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="价格">
        <el-input
          style="width:600px;"
          type="number"
          v-model="formParams.priceFormat"
          placeholder="请输入价格"
        />
      </el-form-item>
      <el-form-item label="开播时间">

        <el-date-picker
          style="width: 600px"
          v-model="valuePicker"
          type="datetime"
          value-format="timestamp"
          @change="changePicker"
          placeholder="选择开播时间"
          :picker-options="pickerOptions0"
          default-time="12:00:00">
        </el-date-picker>

      </el-form-item>
      <el-form-item label="介绍">
        <el-input
          style="width: 600px"
          v-model="formParams.intro"
          placeholder="请输入直播介绍"
        />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="直播封面">
        <el-upload
          class="avatar-uploader"
          :http-request="UploadCoverImage"
          action=""
          :show-file-list="false">
          <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
  </div>
</template>

<script>

  import {
    liveEdit,
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
    name: "LiveDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        vipOptions: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        typeOptions:[
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
        tableKey: 0,
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        uploadImages: [],
        formParams: {
          liveType: "",
          liveId: 0,
          coverImage: "",
          intro: "",
          price: 0,
          priceFormat: null,
          startTime: 0,
          title: "",
          token: getToken(),
        },
      };
    },
    methods: {
      changePicker() {
        this.formParams.startTime = this.valuePicker / 1000
      },
      typeChange(value){
        this.formParams.typeId = value;
      },
      vipChange(value){
        this.formParams.vipId = value;
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      beforeUpload() {

      },
      UploadCoverImage(file) {
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
          this.formParams.coverImage = result.url
        })
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
      initData() {
        liveDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.liveType = json.data.liveType.value;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.intro = json.data.intro;
            this.formParams.liveId = json.data.id;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.valuePicker = json.data.startTime * 1000
            this.formParams.title = json.data.title;
          } else {

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
        this.formParams.startTime = this.valuePicker/1000

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
  .LiveDetail {
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
