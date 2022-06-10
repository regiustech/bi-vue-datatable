<template>
    <th
        scope="col"
        :key="column.name"
        :class="headerClasses(column)"
        class="bi-vue-datatable-th"
        :style="'width: ' + column.width + '%'">
        <div class="bi-vue-short-wrap" @click="column.orderable  ? sort(column) : null">
            <div style="display:inline-block;padding-right:10px" v-if="column.orderable">
                <div
                    class="filter-asc"
                    style="
                        width: 0;
                        height: 0;
                        margin-bottom: 1px;
                        border-bottom: 5px solid #ccc;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;"
                    :class="{'active-filter-asc': column.orderable && column.name == currentSortColumn && dir == 'asc' }"
                    :style="{borderBottom: column.orderable && column.name == currentSortColumn && dir == 'asc' ? '5px solid #a3a3a3' : '5px solid #ccc' }">
                </div>
                <div
                    class="filter-desc"
                    style="
                        width: 0;
                        height: 0;
                        margin-top: 1px;
                        border-top: 5px solid #ccc;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;"
                    :class="{'active-filter-desc': column.orderable && column.name == currentSortColumn && dir == 'desc' }"
                    :style="{borderTop: column.orderable && column.name == currentSortColumn && dir == 'desc' ? '5px solid #a3a3a3' : '5px solid #ccc' }">
                </div>
            </div>
            <span v-html="`${column.label}`"></span>
        </div>
        <div class="bi-vue-datatable-search" v-if="column.searchable" style="margin-top:5px;">
            <input type="text" class="bi-vue-search" :name="getName(column.name)" @input="getSearchText(column.name)" style="border:1px solid #ddd;padding:7px 15px;height:35px;border-radius:5px;width:100%;max-width:150px;">
            <button type="button" :class="getClassName(column.name)" @click="clearSearch(column.name)" v-show="showCloseBtn(column.name)"><svg width="20" height="20" viewBox="0 0 43 43"><rect x="11.5154" y="9.69751" width="30" height="3.42857" transform="rotate(45 11.5154 9.69751)"></rect> <rect x="33.335" y="12.1218" width="30" height="4.28571" transform="rotate(135 33.335 12.1218)"></rect></svg></button>
        </div>
    </th>
</template>
<script>
import MergeClasses from "../functions/MergeClasses";
import OrderDirValidator from "../validators/data-table-order-dir";
export default {
    data() {
        return {
            currentSort: ''
        };
    },
    props: {
        column: {
            type: Object,
            default: () => ({}),
            required: true,
        },
        classes: {
            type: Object,
            default: () => ({}),
        },
        currentSortColumn: {
            type: String,
            default: '',
        },
        dir: {
            type: String,
            validator: OrderDirValidator
        }
    },
    methods: {
        getName(column){
            return 'search_'+column;
        },
        getClassName(column){
            return 'btn search_'+column;
        },
        headerClasses(column) {
            return MergeClasses(
                typeof column.columnClasses === "object" && column.columnClasses["!override"] ? {} : this.classes,
                {"table-header-sorting": column.orderable},
                column.columnClasses || {}, 
                (column.columnClasses || {}).th || {}
            );
        },
        sort(column) {
            this.setCurrentColumnSort(column.name);
            this.$emit('sort',column);
        },
        setCurrentColumnSort(columnName) {
            this.currentSort = columnName;
        },
        getSearchText(column){
            var search = ((document.getElementsByName('search_'+column) && document.getElementsByName('search_'+column).length) ? document.getElementsByName('search_'+column)[0].value : '');
            this.showCBtn(column);
            this.$emit('search',search,column);
        },
        clearSearch(column){
            if(document.getElementsByName('search_'+column) && document.getElementsByName('search_'+column).length){
                document.getElementsByName('search_'+column)[0].value = '';
            }
            if(document.getElementsByClassName('search_'+column) && document.getElementsByClassName('search_'+column).length){
                document.getElementsByClassName('search_'+column)[0].style.display = 'none';
            }
            this.$emit('search','',column);
        },
        showCloseBtn(column){
            if(document.getElementsByName('search_'+column) && document.getElementsByName('search_'+column).length && document.getElementsByName('search_'+column)[0].value){
                return true;
            }
            return false;
        },
        showCBtn(column){
            if(document.getElementsByClassName('search_'+column) && document.getElementsByClassName('search_'+column).length){
                document.getElementsByClassName('search_'+column)[0].style.display = 'block';
            }
        }
    },
}
</script>