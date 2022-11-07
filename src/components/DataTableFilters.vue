<template>
    <div class="bi-cust-table-filters">
        <select class="bi-cust-form-control" v-model="tableData.length">
            <option :key="index" :value="records" v-for="(records, index) in perPage">{{records}}</option>
        </select>
        <div class="bi-right-wrap">
            <input name="table-search" class="bi-cust-form-control bi-cust-search filterPlacehorder" v-model="tableData.search" :placeholder="placeholderSearch"/>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tableData: {
            type: Object,
            default: () => ({}),
            required: true,
        },
        perPage: {
            type: Array,
            default: () => ([]),
            required: true,
        },
        placeholderSearch:{
            type: String,
            default: 'Search Table',
        }
    }
}
</script>