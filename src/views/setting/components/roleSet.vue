<template>
  <div class="roleSet">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeNameRoleSet" @tab-click="handleClick">
          <el-tab-pane label="职员" name="salesman"></el-tab-pane>
          <el-tab-pane label="管理员" name="admin"></el-tab-pane>
          <el-tab-pane label="官方账号" name="official"></el-tab-pane>
          <el-tab-pane label="老师" name="teacher"></el-tab-pane>
          <el-tab-pane label="客服人员" name="cs"></el-tab-pane>
          <el-tab-pane label="售后人员" name="afterSale"></el-tab-pane>
          <el-tab-pane label="运营人员" name="operation"></el-tab-pane>
          <el-tab-pane label="行政专员" name="administrative"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="搜索你想要的内容"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>

      </div>
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
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.extra.roleName || scope.row.extra.trueName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <span>{{scope.row.departmentName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.role.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作状态">
        <template slot-scope="scope">
          <div class="status">
            <span v-if="scope.row.available">正常</span>
            <span v-if="!scope.row.available">暂停</span>
            <el-switch
              @change="(value)=>{changeStatus(value,scope.row)}"
              style="display: block"
              v-model="scope.row.available"
              active-color="#13ce66">
            </el-switch>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        style="color:#5BC0DF;"
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="action">
            <!--<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>-->
            <el-button type="text" size="mini" @click="view(scope.row)" style="color: #409EFF"
                       v-if="hasPerm('settings:roles:roles:detail')">查看
            </el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860"
                       v-if="hasPerm('settings:roles:roles:edit')">编辑
            </el-button>

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
  </div>
</template>

<script>
  import { list, userAvailable } from '../../../api/user'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime, showDecimal } from '@/utils'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'roleSet',
    directives: {
      waves
    },
    data() {
      return {
        activeNameRoleSet: 'first',
        listQuery: {
          app: 'staff',
          role: 'salesman',
          enable: 0,
          jobLeave: 1,
          keyword: '',
          limit: 10,
          page: 0
        },
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        adDelParams: {
          targetId: '',
          token: getToken()
        },
        adEnableParams: {
          targetId: '',
          yes: true,
          token: getToken()
        }
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameRoleSet)
        this.page = 1
        this.total = 0
        this.listQuery.page = 0
        this.listQuery.role = this.activeNameRoleSet
        sessionStorage.setItem('activeNameRoleSet', this.activeNameRoleSet)
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      getTypeName(types) {
        let arr = []
        types.forEach((item, index) => {
          arr.push(item.name)
        })

        return arr.join('、')
      },
      changeStatus(value, item) {
        console.log(value)
        this.adEnableParams.targetId = item.id
        this.adEnableParams.yes = value
        userAvailable(this.adEnableParams).then(json => {
          if (json.status === 200) {
            console.log(json)
            // item.enable = !item.enable
          } else {

          }
        })
      },

// 列表
      getList() {
        if (sessionStorage.getItem('activeNameRoleSet')) {
          this.activeNameRoleSet = sessionStorage.getItem('activeNameRoleSet')
        } else {
          this.activeNameRoleSet = 'salesman'
        }
        this.listLoading = true
        this.listQuery.role = this.activeNameRoleSet
        list(this.listQuery).then(json => {
          this.listLoading = false
          if (json.status === 200) {
            this.list = json.data
            this.total = json.total
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      //删除分类
      delTag(data) {
        this.adDelParams.targetId = data.id
        this.$confirm('此操作将删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            courseDel(this.adDelParams).then(res => {
              // console.log(res,"res");
              if (res.status) {
                this.$message.success('删除成功！')
                this.getList()
              } else {
                this.$message.error(res.message)
              }
            })
          })
          .catch(() => {
            this.adDelParams.targetId = ''
          })
      },

      addTag(data) {
        this.$router.push({
          name: 'roleDetail', params: {
            id: data
          }
        })
      },
      view(data) {
        // console.log(data.role.value,"role");
        if (data.role.value === 'salesman' || data.role.value === 'teacher' || data.role.value === 'cs') {
          this.$router.push({
            name: 'roleView', query: {
              id: data.id,
              role: data.role.value
            }
          })
        } else {
          this.$router.push({
            name: 'roleView2', params: {
              id: data.id
            }
          })
        }
      }

    },
    mounted() {

    }
  }
</script>
<style>

  .roleSet .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .roleSet .el-tabs__content {
    display: none;
  }

  .roleSet .filter-container .filter-item {
    margin-bottom: 0;
  }

  .roleSet .filter-container .left .el-tabs__nav {
    margin-left: 0;
  }
</style>
<style lang="scss" scoped>
  .roleSet {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;

    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 0 20px;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
    }

    img {
      width: 80px;
    }

    .action {
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        margin-right: 6px;
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
