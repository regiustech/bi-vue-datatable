<template>
    <renderless-pagination :data="data" :limit="limit" :show-disabled="showDisabled" @pagination-change-page="onPaginationChangePage">
        <div slot-scope="{data,from,to,total,perPage,prevPageUrl,nextPageUrl,limit,showDisabled,pageRange,currentPage,previousButtonHandler,nextButtonHandler,pageButtonHandler}">
            <slot :data="data" :pageRange="pageRange" :currentPage="currentPage" :nextButtonHandler="nextButtonHandler" :pageButtonHandler="pageButtonHandler" :previousButtonHandler="previousButtonHandler">
                <div class="bi-pagination-wrap">
                    <div class="bi-showing-text">Showing <span>{{ from }}</span> to <span>{{ to }}</span> of <span>{{ total }}</span> results</div>
                    <ul class="pagination">
                        <li v-if="prevPageUrl || showDisabled" class="page-item pagination-prev-nav" :class="{'disabled': !prevPageUrl}">
                            <button type="button" @click="previousButtonHandler" :tabindex="!prevPageUrl && -1" class="page-link" :disabled="!prevPageUrl">
                                <svg stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                        </li>
                        <template v-if="showNumbers">
                            <li class="page-item pagination-page-nav" :class="{'active': page == currentPage}" v-for="(page,key) in pageRange" :key="key">
                                <button type="button" @click="pageButtonHandler(page)" class="page-link">{{ page }}</button>
                            </li>
                        </template>
                        <li v-if="nextPageUrl || showDisabled" class="page-item pagination-next-nav" :class="{'disabled': !nextPageUrl}">
                            <button type="button" @click="nextButtonHandler" :tabindex="!nextPageUrl && -1" class="page-link" :disabled="!nextPageUrl">                                    
                                <svg stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </slot>
        </div>
    </renderless-pagination>
</template>
<script lang="ts">
    import {Component,Vue,Prop} from 'vue-property-decorator';
    import RenderlessPagination from './RenderlessPagination.vue';
    @Component({
        components: {
            RenderlessPagination
        },
        props: {
            data: {
                type: Object,
                required: true,
                default: () => ({
                    meta: {},
                    data: [],
                    links: {}
                })
            },
            limit: {
                type: Number,
                default: 1
            },
            showDisabled: {
                type: Boolean,
                default: true
            },
            showNumbers: {
                type: Boolean,
                default: false
            },
            hideWhenEmpty: {
                type: Boolean,
                default: true
            },
            translate: {
                type: Object,
                default: () => ({
                    nextButton: 'Next',
                    previousButton: 'Previous'
                })
            }
        }
    })
    export default class Pagination extends Vue{
        private onPaginationChangePage(page: number){
            this.$emit('page-changed',page);
        }
    }
</script>