<template>
  <div id="chatMsg">
    <p v-if="msg.type === 0">{{msg.body.msg}}</p>
    <viewer :images="[msg.body.url]" v-if="msg.type === 1">
      <img :src="msg.body.url"/>
    </viewer>
    <audio :src="msg.body.url" v-if="msg.type === 2"
           controls preload="auto"></audio>
    <video :src="msg.body.url" v-if="msg.type === 3"
           controls width="400" height="300" preload="auto"></video>
    <p v-if="msg.type === 5">{{msg.body.title}}</p>
    <a v-if="msg.type === 6" :href="msg.body.url">{{msg.body.name}}</a>
    <p v-if="msg.type === 10">{{msg.body.msg}}</p>
    <div v-if="msg.type === 100">
      <p>{{msg.body.title}}{{redirectTypeText(msg.body.redirectType)}}</p>
      <img :src="msg.body.image"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "chat-msg",
    props: ['msg'],
    methods: {
      redirectTypeText(redirectType) {
        switch (redirectType) {
          case 'url':
            return '（链接）';
          case 'tool':
            return '（辅助工具）';
          case 'guide':
            return '（智能攻略）';
          case 'course':
          case 'news':
          case 'tech':
            return '（课程）';
          case 'live':
            return '（直播）';
          case 'activity':
            return '（线下活动）';
          default:
            break;
        }
      }
    },
    mounted() {
      console.log(this.msg);
    }
  }
</script>

<style lang="scss" scoped>
  #chatMsg {
    color: #666666;
    img {
      max-width: 100px;
    }
  }
</style>
