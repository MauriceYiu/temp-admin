<template>
  <div class="demo">
    <header style="width:100%;height:60px;background:#555;color:red;">头部</header>
    <div style="display: flex;">
      <el-menu style="width:150px;" unique-opened @select="select">
        <el-menu-item v-for="item in menu" :index="item.name" :key="item.name">{{item.name}}</el-menu-item>
      </el-menu>
      <el-menu style="width:150px;" router background-color="#f3f4f6" unique-opened @select="select2">
        <el-submenu v-for="item in second" :index="item.name" :key="item.name">
          <template slot="title">{{item.name}}</template>
          <el-menu-item v-for="itemSub in item.children" :index="itemSub.url"
                        :key="itemSub.url">{{itemSub.name}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
  export default {
    name: "demo",
    data() {
      return {
        menu: [
          {
            name: '权限管理',
            children: [
              {
                name: '系统管理', children: [
                  {name: '操作员管理', url: '/a'},
                  {name: '角色管理', url: '/b'},
                ]
              },
              {
                name: '资源中心', children: [
                  {name: '接入应用', url: '/c'},
                  {name: '权限资源管理', url: '/d'},
                ]
              },
            ]
          },
          {
            name: '身份管理',
            children: [
              {
                name: '字典信息管理', children: [
                  {name: '分区管理', url: 'Zone'},
                  {name: '客户信息管理', url: '/e'},
                  {name: '客户分组管理', url: '/f'},

                  {name: '区域管理', url: '/g'},
                  {name: '部门管理', url: '/h'},
                  {name: '身份类别', url: '/i'},
                  {name: '学生字典信息', url: '/j'},
                  {name: '员工字典信息', url: '/k'},
                ]
              },
              {
                name: '商户中心', children: [
                  {name: '商户管理', url: '/l'},
                  {name: '商户部门管理', url: '/m'}
                ]
              },
              {
                name: '成员管理', children: [
                  {name: '学生基本信息', url: '/n'},
                  {name: '员工基本信息', url: '/o'},
                  {name: '其他人员信息', url: '/p'},
                  {name: '导入员工亲属', url: '/q'},
                ]
              },
              {
                name: '照片信息管理', children: [
                  {name: '批量照片上传', url: '/r'},
                ]
              },
              {
                name: '信息批量导入', children: [
                  {name: '批量人员信息', url: '/s'},
                  {name: '人员信息追加', url: '/t'},
                ]
              },
              {
                name: '卡样信息管理', children: [
                  {name: '卡样信息设计', url: '/u'},
                  {name: '卡样身份对应', url: '/v'},
                  {name: '卡片信息打印', url: '/w'},
                ]
              },
            ]
          },
          {
            name: '卡片管理',
            children: [
              {
                name: '卡片管理', children: [
                  {name: '卡片管理', url: '/x'}
                ]
              }
            ]
          },
        ],
        second:[],
      }
    },
    methods: {
      select(name) {
        for (let item of this.menu) {
          if (name === item.name) {
            this.second = item.children;
            break;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
