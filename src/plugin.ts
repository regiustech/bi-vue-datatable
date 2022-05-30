import DataTable from "./components/DataTable.vue";
import {TailablePagination} from 'tailable-pagination';
import DataTableCell from "./components/DataTableCell.vue";

export default {
    install(Vue) {
        Vue.component("bi-data-table", DataTable);
        Vue.component("bi-data-table-cell", DataTableCell);
        Vue.component("tailable-pagination", TailablePagination);
    },
};

export { DataTable, DataTableCell };
