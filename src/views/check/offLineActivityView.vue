<template>
  <!--活动名称、预约价格(悟空币)、活动时间(时间段)、-->
  <!--封面、活动简介、活动讲师(讲师如下三个参数：姓名、头像、讲师标签)、活动详情(富文本编辑框)、举办单位(图片)-->
  <div class="offLineActivityView">
    <el-form class="form-container" ref="postForm" label-width="154px">

      <el-form-item label="活动名称">
        <span>{{formParams.title}}</span>
      </el-form-item>
      <el-form-item label="预约价格(悟空币)">
        <span>{{formParams.priceFormat}}</span>
      </el-form-item>
      <el-form-item label="活动时间">
        <span>{{formParams.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> 至
        <span> {{formParams.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>

      </el-form-item>
      <el-form-item label="预约时间">
        <span>{{formParams.datingStartTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> 至
        <span> {{formParams.datingEndTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </el-form-item>
      <el-form-item label="活动地址">
        <span>{{formParams.address}}</span>
      </el-form-item>
      <el-form-item label="活动简介">
        <span>{{formParams.intro}}</span>
      </el-form-item>
      <el-form-item label="总预约人数">
        <span>{{formParams.totalUser}}</span>
      </el-form-item>
      <!--封面、活动简介、-->
      <el-form-item style="margin-bottom: 40px;" prop="title" label="活动封面">
        <img class="coverImage" v-if="formParams.coverImage" :src="formParams.coverImage">
      </el-form-item>
      <!--活动详情(富文本编辑框)、举办单位(图片)&ndash;&gt;-->
      <el-form-item label="活动详情">
        <div class="content">
          <p style="margin: 0" v-html="formParams.content"></p>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="举办单位">
        <div class="carousel">
          <div class="imgWrap" v-for="(item,index) in uploadImages" :key="index">
            <img :src="item.url" alt="">
          </div>
        </div>
      </el-form-item>
      <el-form-item label="主讲人">
        <span>{{formParams.teacherName}}</span>
      </el-form-item>
      <!--活动讲师(讲师如下三个参数：姓名、头像、讲师标签)、-->
      <el-form-item label="活动讲师">
        <div class="teachersBox" v-for="(item,i) in formParams.teachers" :key="i">
          <div class="item">
            <el-form-item label="姓名" width="100px">
              <span>{{item.name}}</span>
            </el-form-item>

            <el-form-item prop="title" label="头像">
              <img :src="item.avatar" alt="">
            </el-form-item>

            <el-form-item label="标签">
              <span>{{item.tagsText}}</span>
            </el-form-item>
          </div>
        </div>


      </el-form-item>
      <el-form-item v-if="status ==='checking'">
        <el-button  @click="refuse">拒绝</el-button>
        <el-button type="success" @click="passCheck">通过</el-button>
      </el-form-item>
      <el-form-item  v-if="status ==='failed'">
        <span style="color: red">审核失败！</span>
      </el-form-item>
      <el-form-item v-if="status ==='success'">
        <span style="color: green">审核成功！</span>
      </el-form-item>
    </el-form>
</div>
</template>

<script>

  import {
    activityCheck,
    activityDetail,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import qqmap from "@/components/qqmap/index";
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "offLineActivityView",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1,
      qqmap
    },
    data() {
      return {
        dialogMapVisible: false,
        pickerValue: '',
        pickerValueDating: '',
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
        ],
        total: 0,
        page: 1,
        status: "",
        tableKey: 0,
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        uploadImages: [],
        checkParams:{
          changeTo: null,
          targetId: 0,
          reason: "",
          token: getToken(),
        },
        formParams: {
          address: "",
          activityId: 0,
          city: "",
          companies: [],
          content: "",
          coverImage: "",
          datingEndTime: 0,
          datingStartTime: 0,
          endTime: 0,
          intro: "",
          latitude: 0,
          longitude: 0,
          price: 0,
          priceFormat: null,
          province: "",
          remark: "",
          startTime: 0,
          teacherName: "",
          teachers: [
            {
              avatar: "",
              name: "",
              tagsText: "",
              tags: [],
            }
          ],
          title: "",
          token: getToken(),
          totalUser: null
        },
      };
    },
    methods: {
      addAddress() {
        this.dialogMapVisible = true;
      },
      showMap() {
        this.dialogMapVisible = !this.dialogMapVisible
      },
      setLoaction(data) {
        if (data) {
          console.log(data,"11111111");
          this.formParams.address = data.address
          this.formParams.city = "成都"
          this.formParams.province="四川"
          this.formParams.latitude = data.lat
          this.formParams.longitude = data.lng
          // let areaIdObj = cityUtil.getProvinceCityAreaId(
          //   data.addObj.province,
          //   data.addObj.city,
          //   data.addObj.district
          // )
          // this.formParams.areaId = areaIdObj.aId;
          this.dialogMapVisible = false
        } else {
          this.$message.error('请选择地址')
        }
      },
      addOption(option, arr) {
        arr.push({
          value: ""
        });
      },
      delOption(option, arr) {
        arr.splice(option, 1)
      },
      //选定活动日期
      changePicker() {
        if (this.pickerValue) {
          this.formParams.startTime = this.pickerValue[0] / 1000;
          this.formParams.endTime = this.pickerValue[1] / 1000;
        } else {
          this.formParams.endTime = ''
          this.formParams.endTime = ''
        }
      },//选定预约日期
      changePickerDating() {
        if (this.pickerValueDating) {
          this.formParams.datingStartTime = this.pickerValueDating[0] / 1000;
          this.formParams.datingEndTime = this.pickerValueDating[1] / 1000;
        } else {
          this.formParams.datingStartTime = ''
          this.formParams.datingEndTime = ''
        }
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
      UploadAvatar(file, i) {
        console.log(i);
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
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.teachers[i].avatar = result.url
          this.$forceUpdate()
        })
      },
      initData() {
        activityDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.status = json.data.checkStatus.value;
            this.formParams.address = json.data.address;
            this.formParams.activityId = json.data.id;
            this.formParams.city = json.data.city;
            this.uploadImages = [];
            json.data.companies.forEach((image, index) => {
              this.uploadImages.push({
                name: index,
                url: image
              });
            });

            this.formParams.content = json.data.content;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.datingEndTime = json.data.datingEndTime;
            this.formParams.datingStartTime = json.data.datingStartTime;
            this.formParams.endTime = json.data.endTime;
            this.formParams.startTime = json.data.startTime;
            this.formParams.intro = json.data.intro;
            this.formParams.latitude = json.data.latitude;
            this.formParams.longitude = json.data.longitude;
            this.formParams.priceFormat = json.data.price/100;
            this.formParams.province = json.data.province;
            this.formParams.remark = json.data.remark;
            this.formParams.teacherName = json.data.teacherName;
            this.formParams.title = json.data.title;
            this.formParams.teachers = json.data.teachers;
            this.formParams.totalUser = json.data.totalUser;
            json.data.teachers.forEach((item,index)=>{
              item.tagsText = item.tags.join("、")
            })
            this.pickerValue = [json.data.startTime * 1000,json.data.endTime * 1000]
            this.pickerValueDating = [json.data.datingStartTime * 1000,json.data.datingEndTime * 1000]
            this.formParams.title = json.data.title;
          }
        });
      },
      //拒绝审核
      refuse() {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s|\S]{1,}$/,
          inputErrorMessage: '理由不能为空'
        }).then(({value}) => {
          this.checkParams.changeTo = "failed"
          this.checkParams.targetId = this.formParams.activityId
          this.checkParams.reason = value;
          activityCheck(this.checkParams).then(json => {
            if (json.status ===200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });
              this.$router.push({name:"offLineCheck"})
            } else
              this.$message({message: json.message})
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
        this.checkParams.targetId = this.formParams.activityId
        this.checkParams.changeTo = "success"
        activityCheck(this.checkParams).then(json => {
          if (json.status ===200) {
            this.$message.success('审核通过！')
            this.$router.push({name:"offLineCheck"})
          }
        })
      },

    },
    mounted() {
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
  .content p{
    margin: 0;
  }
</style>
<style lang="scss" scoped>
  .offLineActivityView {
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
    .teachersBox {
      display: flex;
      .item{
        width: 80%;
        border-bottom: 1px solid rgba(230, 230, 230, 0.48);
      }
    }
    .carousel{
      display: flex;
      .imgWrap{
        width: 200px;
        margin-right: 20px;
        img{
          width: 100%;
        }
      }
    }

  }
</style>
