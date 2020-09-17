<template>
  <div class="courseView">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="上传者">
        <span>{{uploader}}</span>
      </el-form-item>
      <el-form-item label="课程名称">
        <span>{{formParams.title}}</span>
      </el-form-item>
      <el-form-item label="课程分类" prop="title">
        <span>{{getClassification(formParams.typeId)}}</span>
      </el-form-item>
      <el-form-item label="课程级别">
        <span>{{formParams.vipName}}</span>
      </el-form-item>
      <el-form-item label="课程价格">
        <span>{{formParams.priceFormat}}</span>
      </el-form-item>
      <el-form-item label="课程标签">
        <span>{{tags}}</span>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="课程封面">
        <img class="coverImage" v-if="formParams.coverImage" :src="formParams.coverImage">
      </el-form-item>

      <!--<el-form-item style="margin-bottom: 40px;" prop="title" label="轮播图">-->
        <!--<div class="carousel">-->
          <!--<div class="imgWrap" v-for="(item,index) in uploadImages" :key="index">-->
            <!--<img :src="item.url" alt="">-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-form-item>-->

      <el-form-item label="视频链接">
        <el-input
          v-model="formParams.videoUrl"
          placeholder="请输入视频链接"
        />
      </el-form-item>
      <el-form-item label="课程说明">
        <span>{{formParams.intro}}</span>
      </el-form-item>
      <el-form-item label="课程详情">
        <div class="content">
          <p v-html="formParams.content"></p>
        </div>

      </el-form-item>
      <el-form-item label="是否推荐">
        <span>{{formParams.recommend?"是":"否"}}</span>
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
    courseCheck,
    courseDetail,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "courseView",
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
        uploader:"",
        typeOptions:types.course,
        tags: '',
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
          content: "",
          videoUrl: "",
          courseId: 0,
          coverImage: "",
          images: [],
          intro: "",
          price: 0,
          priceFormat: null,
          tags: [],
          title: "",
          token: getToken(),
          recommend: true,
          typeId: null,
          vipId: null,
          vipName: ""
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
      getClassification(typeId){
        if(types[typeId]){
          return types[typeId].name;
        }
      },
      initData() {
        courseDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            // this.uploadImages = [];
            // json.data.images.forEach((image, index) => {
            //   this.uploadImages.push({
            //     name: index,
            //     url: image
            //   });
            // });
            this.status = json.data.checkStatus.value;
            this.uploader = json.creator.name;
            console.log(this.status,"11111");
            this.formParams.courseId = json.data.id;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.intro = json.data.intro;
            this.formParams.videoUrl = json.data.videoUrl;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.formParams.tags = json.data.tags;
            this.tags = json.data.tags.join("、")
            this.formParams.title = json.data.title;
            this.formParams.recommend = json.data.recommend;
            this.formParams.typeId = json.data.typeId;
            this.formParams.vipId = json.data.vip.id;
            this.formParams.vipName = json.data.vip.name;
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
          this.checkParams.targetId = this.formParams.courseId
          this.checkParams.reason = value;
          courseCheck(this.checkParams).then(json => {
            if (json.status ===200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });
              this.$router.push({name:"courseCheck"})
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
        this.checkParams.targetId = this.formParams.courseId
        this.checkParams.changeTo = "success"
        courseCheck(this.checkParams).then(json => {
          if (json.status ===200) {
            this.$message.success('审核通过！')
            this.$router.push({name:"courseCheck"})
          }
        })
      },

    },
    mounted() {
      // console.log(this.$route.params.id);
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
  .courseView {
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

    .coverImage {
      width: 100px;
    }
    .carousel{
      display: flex;
      .imgWrap{
        margin-right: 20px;
      }
    }
    .content{
      p{
        margin: 0;
      }
    }

  }
</style>
