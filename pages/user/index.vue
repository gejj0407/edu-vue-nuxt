<template>
    <div>
        <div>{{ list }}</div>
        <nuxt />
    </div>
</template>
<script>

import pagination from '@/plugins/mixins/pagination'
export default {
    head() {
        return {
            title: '个人中心',
        }
    },
    // middleware: ['account'],
    mixins: [pagination],
    data() {
        return {
            params: {
                current: 1,
                size: 10,
            },
            serviceName: 'home',
            functionName: 'getList',
        }
    }
}
</script>
