<template>
    <div :class="getClasses.container">
        <slot :url="url" name="filters" :per-page="perPage" :table-data="tableData" :meta="tableData.meta" :links="tableData.links" :table-filters="tableProps" :loadDiffrentPage="loadDiffrentPage">
            <bi-vue-data-table-filters :per-page="perPage" :framework="framework" :table-data="tableProps" :placeholder-search="translate.placeholderSearch"></bi-vue-data-table-filters>
        </slot>
        <bi-vue-table @sort="sortBy" @search="columnSearchText" :sortKey="sortKey" :columns="columns" :dir="tableProps.dir" :sortOrders="sortOrders" :table-classes="getClasses.table" :table-head-classes="getClasses['th']" :table-header-classes="getClasses['t-head']" :table-row-classes="getClasses['t-head-tr']" :table-container-classes="getClasses['table-container']">
            <template slot="header" v-if="headerSlot">
                <slot name="header" :table-props="tableProps"></slot>
            </template>
            <template slot="body" v-if="bodySlot">
                <slot name="body" :data="tableData.data"></slot>
            </template>
            <template slot="body" v-else>
                <tbody v-if="columns" :class="getClasses['t-body']" class="bi-vue-datatable-tbody">
                    <tr v-if="(!tableData || !tableData.data || !tableData.data.length)">
                        <td :colspan="columns.length">No record found.</td>
                    </tr>
                    <template v-else v-for="(item,rowIndex) in tableData.data" :key="item.id">
                        <tr :key="item.id" :class="getClasses['t-body-tr']" @click="$emit('row-clicked',item)" class="bi-vue-datatable-tbody-tr bi-vue-datatable-tbody-tr-main">
                            <td :key="column.name" class="bi-vue-datatable-td" :class="bodyCellClasses(column)" v-for="(column,columnIndex) in columns">
                                <bi-vue-data-table-cell :row="rowIndex" :column="columnIndex" :value="item" :transform="column.transform" :name="column.name" :meta="column.meta" :event="column.event" :classes="column.classes" :handler="column.handler" :comp="column.component"></bi-vue-data-table-cell>
                            </td>
                        </tr>
                        <template v-if="item.childrens && item.childrens.length">
                            <tr :key="'children-'+item.id" :class="'bi-vue-datatable-tbody-tr children-'+item.id" v-show="tableProps.filters.showChildren == item.id">
                                <td :colspan="columns.length">
                                    <table class="bi-vue-datatable table mb-0" style="box-shadow:0 1px 3px 1px rgb(60 64 67 / 15%);border-radius:10px !important;">
                                        <thead class="bi-vue-datatable-thead">
                                            <tr class="bi-vue-datatable-thead-tr">
                                                <bi-vue-data-table-th :column="childColumn" :key="childColumn.name" v-for="childColumn in childColumns"></bi-vue-data-table-th>
                                            </tr>
                                        </thead>
                                        <tbody class="bi-vue-datatable-tbody">
                                            <tr :key="children.id" v-for="(children,childRowIndex) in item.childrens" class="bi-vue-datatable-tbody-tr bi-vue-datatable-tbody-tr-child">
                                                <td :key="childColumn.name" class="bi-vue-datatable-td" v-for="(childColumn,childColumnIndex) in childColumns">
                                                    <bi-vue-data-table-cell :row="childRowIndex" :column="childColumnIndex" :value="children" :transform="childColumn.transform" :name="childColumn.name" :meta="childColumn.meta" :event="childColumn.event" :classes="childColumn.classes" :handler="childColumn.handler" :comp="childColumn.component"></bi-vue-data-table-cell>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </template>
                        <template v-if="eChildData && item.childrens && !item.childrens.length">
                            <tr :key="'children-'+item.id" :class="'bi-vue-datatable-tbody-tr children-'+item.id" v-show="tableProps.filters.showChildren == item.id">
                                <td :colspan="columns.length">No images found for this Tag Number</td>
                            </tr>
                        </template>
                    </template>
                </tbody>
                <slot name="footer" :table-props="tableProps"></slot>
            </template>
        </bi-vue-table>
        <slot :page="page" name="pagination" :meta="tableData.meta" :links="tableData.links" :loadDiffrentPage="loadDiffrentPage">
            <tailable-pagination v-if="(tableData && tableData.data && tableData.data.length)" :data="tableData" :showNumbers="true" :framework="framework" :translate="translate" :size="pagination.size" :limit="pagination.limit" @page-changed="paginationChangePage"></tailable-pagination>
        </slot>
    </div>
</template>
<script>
import axios from 'axios';
import VueTable from './Table';
import DataTableCell from './DataTableCell';
import UrlFilters from '../mixins/UrlFilters';
import DataTableFilters from './DataTableFilters';
import TailwindTableTheme from "../themes/Tailwind";
import MergeClasses from "../functions/MergeClasses";
import BootstrapTableTheme from "../themes/Bootstrap";
import ThemeValidator from "../validators/data-table-theme";
import OrderDirValidator from "../validators/data-table-order-dir";
import FrameworkValidator from "../validators/data-table-framework";
import BiVueDataTableTh from './DataTableTh';
export default {
    components: {
        'bi-vue-table': VueTable,
        'bi-vue-data-table-cell': DataTableCell,
        'bi-vue-data-table-filters': DataTableFilters,
        BiVueDataTableTh,
    },
    data(){
        return {
            debounceGetData: () => {},
            tableData: {},
            sortKey: 'id',
            sortOrders: {},
            draw: 0,
            page: 1,
            searchs: [],
            pageLength: this.perPage[0],
            tableProps: {
                search: '',
                dir: this.orderDir,
                column: this.orderBy,
                filters: this.filters,
                length: this.perPage[0],
            }
        };
    },
    created() {
        if(this.addFiltersToUrl){
            this.checkParameters(this.tableProps);
        }else if(this.url){
            this.getData(this.url,this.getRequestPayload);
        }
        const debounce = require('lodash.debounce');
        this.debounceGetData = debounce(this.getData,this.debounceDelay ? this.debounceDelay : 0);
    },
    mounted() {
        this.columns.forEach((column) => {
           this.sortOrders[column.name] = -1;
        });
    },
    mixins: [UrlFilters],
    watch: {
        url: {
            handler: function(newUrl) {
                this.updateCurrentPage(newUrl);
                this.debounceGetData(newUrl);
            }
        },
        tableProps: {
            handler: function(){
                if(this.tableProps.search){
                    this.page = 1;
                }
                if(this.tableProps.length != this.pageLength){
                    this.pageLength = this.tableProps.length;
                    this.page = 1;
                }
                if(this.url){
                    this.debounceGetData();
                }else{
                    let props = this.tableProps;
                    props.page = this.page;
                    this.$emit("on-table-props-changed", props);
                }
            },
            deep: true
        },
        data: {
            handler: function(data){
                this.tableData = data;
            }
        }
    },
    methods: {
        async getData(url = this.url,options = this.getRequestPayload){
            this.$emit("loading");
            let baseUrl = url.split("?")[0];
            let response = await axios.get(baseUrl,options).catch(errors => {
                console.log(errors);
            });
            if(response){
                if(this.checkTableDraw(response.data.payload.draw)){
                    this.draw++;
                    this.tableData = response.data;
                    if(this.addFiltersToUrl){
                        this.updateParameters(this.tableProps);
                    }
                    this.$emit("finished-loading");
                }
            }
        },
        addRecord(data){
            this.tableData.data.push(data);
        },
        sortBy(key, columnName = null){
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1;
            this.tableProps.column = columnName ? columnName : key;
            this.tableProps.dir = this.sortOrders[key] === 1 ? 'desc' : 'asc';
        },
        columnSearchText(search,column){
            this.searchs[column] = search;
            var txt = '';
            for(var key in this.searchs){
                var value = this.searchs[key];
                if(value){
                    txt += `${key}=${value}|`;
                }
            }
            if(txt){
                txt = txt.slice(0,-1);
            }
            this.tableProps[column] = search;
            this.tableProps.search = txt;
            this.tableProps.page = 1;
        },
        getIndex(array,key,value){
            return array.findIndex(i => i[key] == value);
        },
        incrementDraw(){
            this.draw++;
        },
        checkTableDraw(draw) {
            return this.draw == draw;
        },
        updateCurrentPage(url) {
            const params = (new URL(url)).searchParams;
            const page = params.get('page');
            if(page){
                this.page = page;
            }
        },
        loadDiffrentPage(page){
            this.page = page;
            this.getData();
        },
        paginationChangePage(page){
            this.page = page;
            if(Object.keys(this.data) && Object.keys(this.data).length){
                let props = this.tableProps;
                props.page = this.page;
                this.$emit("on-table-props-changed",props);
            }else{
                this.getData();
            }
        },
        bodyCellClasses(column){
            return MergeClasses(
                typeof column.columnClasses === "object" && column.columnClasses["!override"] ? {} : this.getClasses.td,
                column.columnClasses || {}, (column.columnClasses || {}).td || {}
            );
        }
    },
    computed: {
        bodySlot(){
            if(this.$scopedSlots){
                return this.$scopedSlots.body;
            }
            return null;
        },
        headerSlot(){
            if(this.$scopedSlots){
                return this.$scopedSlots.header;
            }
            return null;
        },
        getRequestPayload(){
            let payload = Object.assign({},this.tableProps);
            delete payload.filters;
            payload = Object.assign(payload,this.tableProps.filters);
            payload = Object.assign(payload,this.tableProps.filters);
            payload.draw = this.draw;
            payload.page = this.page;
            payload.showChildren = null;
            return {
                params: payload,
                headers: this.headers,
            };
        },
        getClasses(){
            const defaults = require("lodash.defaultsdeep");
            if(this.framework === "tailwind"){
                return defaults(this.classes,(window.BiVueDatatable || {}).classes || {},TailwindTableTheme); 
            }
            let bootstrapTheme = BootstrapTableTheme;
            if(this.theme === "dark"){
                bootstrapTheme.table["table-dark"] = true;
            }
            return defaults(this.classes, (window.BiVueDatatable || {}).classes || {}, bootstrapTheme); 
        }
    },
    props: {
        columns: {
            type: Array,
            default: () => ([]),
            required: true
        },
        childColumns: {
            type: Array,
            default: () => ([]),
            required: false
        },
        eChildData: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: ""
        },
        orderBy: {
            type: String,
            default: 'id'
        },
        data: {
            type: Object,
            default: () => ({})
        },
        filters: {
            type: Object,
            default: () => ({})
        },
        addFiltersToUrl: {
            type: Boolean,
            default: false
        },
        debounceDelay: {
            type: Number,
            default: 0
        },
        pagination: {
            type: Object,
            default: () => ({limit: 1,align: 'right'})
        },
        perPage: {
            type: Array,
            default: () => (['10','25','50'])
        },
        orderDir: {
            type: String,
            default: "asc",
            validator: OrderDirValidator
        },
        framework: {
            type: String,
            default: "bootstrap",
            validator: FrameworkValidator
        },
        theme: {
            type: String,
            default: "light",
            validator: ThemeValidator
        },
        classes: {
            type: Object,
            default: () => ({})
        },
        headers: {
            type: Object,
            default: () => ({})
        },
        translate: {
            type: Object,
            default: () => Object.assign({}, {
                nextButton: 'Next',
                previousButton: 'Previous',
                placeholderSearch: 'Search Table',
            },(window.BiVueDatatable || {}).translate || {})
        }
    }
}
</script>