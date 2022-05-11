<script>
export default {
  watch: {
    '$route.query': {
      deep: true,
      handler() {
        this.getList()
      },
    },
  },
  data() {
    return {
      list: [],
      total: null,
      loading: false,
      params: {},
      serviceName: '',
      functionName: 'getList',
      getOnMounted: true,
      ignoreParams: {},
      defaultPagesize: 10,
    }
  },
  methods: {
    beforeSearch() { },
    afterSearch() { },
    resetSearch() {
      this.$router
        .replace({
          query: {},
        })
        .catch(() => {
          this.getList()
        })
    },
    search() {
      this.$router
        .replace({
          query: { ...this.$route.query, ...this.params, current: 1 },
        })
        .catch(() => {
          this.getList()
        })
    },
    onPageChange(e) {
      this.$router.replace({ query: { ...this.$route.query, current: e } })
    },
    onSizeChange(e) {
      this.$router.replace({
        query: { ...this.$route.query, current: 1, size: e },
      })
    },
    async getList() {
      this.loading = true
      Object.keys(this.params).forEach((key) => {
        if (Reflect.has(this.ignoreParams, key)) {
          if (this.$route.query[key]) {
            this.params[key] = this.$route.query[key]
          } else if (typeof this.ignoreParams[key] === 'boolean') {
            this.params[key] = ''
          } else {
            this.params[key] = this.ignoreParams[key]
          }
        } else if (key === 'current') {
          this.params.current = this.$route.query.current
            ? parseInt(this.$route.query.current)
            : 1
        } else if (key === 'size') {
          this.params.size = this.$route.query.size
            ? parseInt(this.$route.query.size)
            : this.defaultPagesize
        } else {
          this.params[key] = this.$route.query[key] || ''
        }
      })
      this.beforeSearch()
      const { status, data } = await this.$services[this.serviceName][
        this.functionName
      ](this.params)
      if (status === 1) {
        this.list = data.records || []
        this.total = data.total
      }
      this.afterSearch()
      this.loading = false
    },
  },
  mounted() {
    if (this.getOnMounted) {
      this.getList()
    }
  },
}
</script>

<style scoped>
</style>
