<template>
  <div class="attachment">
    <viewer :images="[attachment.url]" v-if="attachment.type && 'image' === attachment.type.value">
      <img :src="attachment.url"/>
    </viewer>
    <audio  :src="attachment.url" v-else-if="attachment.type && 'audio' === attachment.type.value" controls preload="auto"></audio>
    <video  style="width: 260px" :src="attachment.url" v-else-if="attachment.type && 'video' === attachment.type.value" controls preload="auto"></video>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props: [
      "attachment"
    ],
    methods: {},
    mounted() {
      // console.log(this.attachment);
    }
  }
</script>
<style lang="scss" scoped>
  .attachment {
    img, audio, video {
      width: 100%;
      max-height:100%;
    }
    img{
      width: 120px;
      height: 120px;
    }
  }
</style>
