import DataTable from "./components/DataTable.vue";
import DataTableCell from "./components/DataTableCell.vue";
export default {
    install(Vue){
        Vue.component("bi-data-table",DataTable);
        Vue.component("bi-data-table-cell",DataTableCell);
    }
};
export {DataTable,DataTableCell};