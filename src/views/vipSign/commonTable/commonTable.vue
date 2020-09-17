<template>
  <div class="common-table">
      <slot name="tableTop"/>
      <slot name="tableBottom"/>
      <slot name="otherTmp"/>
  </div>
</template>

<script>
export default {
    name:"commonTable"
}
</script>

<style lang="scss" scoped>
@import "./commonTable.scss";
</style>