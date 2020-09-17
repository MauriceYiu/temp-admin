<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar || '../../assets/img/head.png'" class="user-avatar">
          <span>{{name}}({{roleName}})</span>
          <i class="el-icon-arrow-down"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a @click="dialogFormVisible=true">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divid>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--<el-button @click="toChatView()" class="chat" type="primary" size="small" icon="el-icon-chat-dot-square" circle></el-button>-->
    <el-button class="chat" type="text" size="small">
      <svg-icon icon-class="live" @click="openLiveDialog" style="font-size: 16px" v-if="hasPerm('chat:live')"/>
      <svg-icon icon-class="chat" @click="toChatView()" style="font-size: 16px;margin-left: 30px"
                v-if="hasPerm('chat:room')"/>
    </el-button>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :modal-append-to-body='false'>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="旧密码" label-width="100px" prop="old">
          <el-input v-model="form.old" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="100px" prop="new">
          <el-input v-model="form.new" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="100px" prop="twonew">
          <el-input v-model="form.twonew" type="password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="我的直播列表" :visible.sync="liveDialog" :modal-append-to-body='false'>
      <el-table
        :data="list"
        stripe
        style="width: 100%">

        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.liveType.text}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="价格">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.price | showDecimal}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="开播时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="预约/观看">
          <template slot-scope="scope">
            <span>{{scope.row.joinUser}}/{{scope.row.buyUser}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="打赏/金额">
          <template slot-scope="scope">
            <span>{{scope.row.rewardUser}}/{{scope.row.rewardMoney | showDecimal}}</span>
          </template>
        </el-table-column>

        <!--<el-table-column align="center" label="预约状态">-->
        <!--<template slot-scope="scope">-->
        <!--<span>-->
        <!--<el-button type="success" size="mini" @click="dating(scope.row,false)"-->
        <!--v-if="'ok' === scope.row.status.value">-->
        <!--暂停预约-->
        <!--</el-button>-->
        <!--<el-button type="success" size="mini" @click="dating(scope.row,true)"-->
        <!--v-if="'pause' === scope.row.status.value">-->
        <!--开启预约-->
        <!--</el-button>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column
          style="color:#5BC0DF;"
          align="center"
          label="直播操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="action">
              <el-button type="success" size="mini" @click="copy(scope.row,$event)">
                复制推流地址
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          style="color:#5BC0DF;"
          align="center"
          label="直播聊天室"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="action">
              <el-button type="success" size="mini" @click="start(scope.row)">
                直播聊天室
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          style="color:#5BC0DF;"
          align="center"
          label="结束操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="action">
              <el-button type="warning" size="mini" @click="finished(scope.row)"
                         v-if="'ing' === scope.row.status.value">
                标记结束
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


  </div>
</template>

<script>
  import {liveFinished, liveList, liveStart} from "../../api/content";
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import {changePwd} from '@/api/user'
  import {getToken} from '../../utils/auth'
  import clip from '@/utils/clipboard'

  export default {
    data() {
      const validateTwonew = (rule, value, callback) => {
        if (value != this.form.new) {
          callback(new Error('与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
        listQuery: {
          endTime: 0,
          keyword: "",
          limit: 10,
          page: 0,
          startTime: 0,
//直播状态：cancel已取消，init审核中，failed审核失败，pause暂停中，ok审核通过待开播，ing直播中，finished直播完成
          statuses: ["ok", "ing"],
          teacherId: localStorage.getItem("uid"),
          token: getToken(),
        },
        list: [],
        dialogFormVisible: false,
        liveDialog: false,
        loading: false,
        name: "",
        roleName: "",
        avatar: require("../../assets/img/head.png"),
        form: {
          old: '',
          new: '',
          twonew: ''
        },
        rules: {
          old: [{required: true, message: '请输入旧密码', trigger: 'blur'},
            {min: 6, max: 20, message: '请输入6到20位的旧密码 ', trigger: 'blur'}],
          new: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, max: 20, message: '请输入6到20位的旧密码 ', trigger: 'blur'}
          ],
          twonew: [
            {required: true, trigger: 'blur', validator: validateTwonew},
          ],
        }
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        // 'avatar'
      ])
    },
    methods: {
      // 列表
      getList() {
        this.listLoading = true;
        liveList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        })
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            changePwd({
              "newPwd": this.form.new,
              "newPwd2": this.form.twonew,
              "oldPwd": this.form.old,
              "token": getToken()
            }).then(res => {
              this.$message.success('修改密码成功,请重新登录')
              this.dialogFormVisible = false
              this.logout()
            }).finally(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
      copy(live, event) {
        liveStart({
          targetId: live.id,
          token: getToken()
        }).then(res => {
          if (res.status) {
            this.$message.success("请前往OBS软件设置推流地址开始您的直播！");
            clip(live.sinaChannel.pushUrl, event)
          } else {
            this.$message.error(res.message);
          }
        });
      },
      start(live) {
        liveStart({
          targetId: live.id,
          token: getToken()
        }).then(res => {
          if (res.status) {
            this.$message.success("请前往正在直播开始您的直播！");
            this.live(live);
          } else {
            this.$message.error(res.message);
          }
        });
      },
      finished(live) {
        this.$confirm("此操作将结束该直播, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          liveFinished({
            targetId: live.id,
            token: getToken()
          }).then(res => {
            if (res.status) {
              this.getList();
            } else {
              this.$message.error(res.message);
            }
          });
        })
      },
      live(live) {
        console.log(live, "live");
        let id = live.sinaChannel.chatRoomId;
        let pushUrl = encodeURIComponent(live.sinaChannel.pushUrl);
        window.open("./chat/im/chatroom/room.html?id=" + id + "&publishUrl=" + pushUrl, "livePublish", "", true);
      },
      openLiveDialog() {
        this.liveDialog = true;
        this.getList()
      },
      toChatView() {
        let id = localStorage.getItem("uid");
        let token = localStorage.getItem("sdktoken");
        window.open("./chat/im/login.html?id=" + id + "&token=" + token, "imLogin", "", true);
      }
    },
    mounted() {
      this.name = localStorage.getItem("name");
      this.avatar = localStorage.getItem("avatar");
      this.roleName = localStorage.getItem("roleName");
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 60px;
    overflow: hidden;
    position: relative;
    /*background: #304156;*/
    background: #181A28;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      /*display: none;*/
      line-height: 56px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .chat {
      float: right;
      margin-top: 10px;
      margin-right: 33px;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 60px;
      /*border: 2px solid red;*/
      /*width: 250px;*/
      color: white;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        /*color: #5a5e66;*/
        color: #ffffff;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;
        width: 100%;
        color: white;

        .avatar-wrapper {
          /*border: 1px solid red;*/
          cursor: pointer;
          /*margin-top: 10px;*/
          position: relative;
          display: flex;
          align-items: center;

          .user-avatar {
            margin-right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }

          span {
            margin-right: 14px;
          }
        }

        .name-wrapper {
          position: absolute;
          top: 0;
          left: 44px;
          color: white;

          .svg-container {
            width: 30px;
            height: 30px;
            color: white;
            position: absolute;
            top: 0;
            right: -46px;
          }
        }
      }

    }
  }
</style>
