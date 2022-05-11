<template>
    <div>{{ listData }}</div>
</template>
<script>


export default {
    data() {
        return {
            listData: []
        }
    },
    methods: {
        async getList() {
            const { status, data } = await this.$services.home.getList()
            if (status === 1) {
                this.listData = data.records || []
            }
        },
    },
    mounted() {
        this.getList()
    }
}
</script>
