<template>
  <div class="permissonSetting">
    <div style="display: flex;flex-direction: row-reverse;margin-bottom: 10px">
      <el-button @click="goDetails" type="primary">添加</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="address" label="角色权限">
        <template slot-scope="scope">
          <span>{{getRoleValue(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="角色详情">
        <template slot-scope="scope">
          <span>{{scope.row.detail}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click='goDetails(scope.row)' class='defaultBtn' type="text">编辑</el-button>
          <el-button @click='goStaff(scope.row)'  class='defaultBtn' type="text">员工管理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { roleCustomerGroups,rolBy,roleChildren } from '@/api/settings.js';
  import { getToken } from '@/utils/auth'
  export default {
    name: "permissonSetting",
    data() {
      return {
        tableData:[],
        id:'',
      };
    },
    methods:{
      //权限列表
      getList(){
        rolBy({"role": "admin"}).then(json => {
          if(json.data.status === 200){
            this.id=json.data.data.id
            roleChildren({"role": "admin",
              "roleParentId": json.data.data.id,
              "token": getToken()}).then(res=>{
              if(res.data.status === 200){
                this.tableData=res.data.data

                let d=[]
                this.tableData.map(r=>{
                  d.push({label:r.name,value:r.id})
                })
                sessionStorage.setItem('roleList',JSON.stringify(d))
              }else{
                this.$message.error(res.data.message);
              }
            })
          }else{
            this.$message.error(json.data.message);
          }
        });
      },
      goDetails(data){
        this.$router.push({name:'editAdmin',params:{pId:this.id,roleId:data&&data.id?data.id:0}});
      },
      goStaff(data){
        this.$router.push({name:'staff',params:{pId:data.id}});
      },
      getRoleValue(data){
        return data.role.text;
      }
    },
    mounted(){
      this.getList();
    }
  };
</script>


<style lang="scss" scoped>
  .permissonSetting {
    .defaultBtn{
      color: #409eff;
    }
  }
</style>
