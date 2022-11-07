<template>
    <div class="bi-vue-datatable-wrap">
        <table class="bi-vue-datatable table">
            <slot name="header">
                <thead class="bi-vue-datatable-thead">
                    <tr class="bi-vue-datatable-thead-tr">
                        <bi-vue-data-table-th :dir="dir" @sort="sort" @search="columnSearchText" :column="column" :key="column.name" v-for="column in columns" :current-sort-column="currentSortColumn"></bi-vue-data-table-th>
                    </tr>
                </thead>
            </slot>
            <slot name="body"></slot>
        </table>
    </div>
</template>
<script>
import BiVueDataTableTh from './DataTableTh';
export default {
    data() {
        return {
            currentSortColumn: ''
        };
    },
    components: {
        BiVueDataTableTh
    },
    props: {
        dir: {
            type: String,
            default: ''
        },  
        columns: {
            type: Array,
            default: () => ([]),
            required: true
        },
    },
    methods: {
        sort(column){
            this.currentSortColumn = column.name;
            this.$emit('sort', column.name, column.columnName);
        },
        columnSearchText(search,column){
            this.$emit('search',search,column);
        }
    }
}
</script>