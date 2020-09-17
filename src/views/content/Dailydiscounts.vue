<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="用户头像">
        <template slot-scope="scope">
          <img style="height: 50px" :src="scope.row.avatar" class="avatar">
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="name" align="center"/>
      <el-table-column label="手机号" prop="mobile" align="center"/>
      <el-table-column label="身份证号" prop="idCard" align="center"/>

      <el-table-column label="是否开通诚意金账户"  align="center">
        <template slot-scope="scope">
          {{ scope.row.enable?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="缴纳诚意金楼盘数量"  align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="goToUsb">{{1}}</a>
        </template>
      </el-table-column>
    </el-table>
    <pagination @fetchData="fetchData" :total="total"/>
  </div>
</template>

<script>
import { list } from '@/api/user'
import { getToken } from '@/utils/auth'
import pagination from '@/components/Pagination/index'
export default {
  components:{
    pagination
  },
  data() {
    return {
      total:0,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData({limit:10,page:0})
  },
  methods: {
    goToUsb(){
      this.$router.push({name:'tableUsb'})
    },
    fetchData(data) {
      this.listLoading = true
      list({limit:data.limit,page:data.page,token:getToken()}).then(res => {
        this.total=res.total
        this.list = res.data
      }).finally(()=>{
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
