<template>
  <div>
    <p>欢迎搭建一个nuxt项目！</p>
    <el-button @click="skipTo">点击跳转</el-button>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  methods: {
    skipTo() { this.$router.push("/discovery") },
  }
}
</script>
