<template>
  <div>
    <el-upload
      action="https://sincer.icbc.nervenets.com/api/v1/file/upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      name="userfile"
      :show-file-list="showFilelist"
    >
      <i class="el-icon-plus" v-if="showFilelist"></i>
        <img style="margin-top: -1px;margin-left:-1px;width: 150px;height: 150px;border-radius: 6px" v-if="dialogImageUrl&&!showFilelist"  :src="dialogImageUrl" class="avatar">
        <i v-if="!dialogImageUrl&&!showFilelist" class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImg',
  props: {
    showFilelist: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Object,
      default: []
    },
    dialogImageUrl: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      // dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList=fileList
      let data=[]
      fileList.map(r=>{
        data.push(r.url)
      })
      this.$emit('cover',data)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res){
      if(this.showFilelist){
        this.fileList.push({url:res.data})
      }else{
        this.dialogImageUrl=res.data
      }
      this.$emit('setImg',res.data)
     console.log(this.fileList,123)
      // this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return  isLt2M;
    }
  },created() {
    console.log(this.fileList,999)
  }
}
</script>
