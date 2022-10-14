<script>
    export default{
        props: {
            comp: {},
            transform: {},
            row: {
                type: Number,
                default: 0
            },
            column: {
                type: Number,
                default: 0
            },
            meta: {
                type: Object,
                default: () => ({})
            },
            name: {
                type: String,
                default: ''
            },
            event: {
                type: String,
                default: 'click'
            },
            handler: {
                type: Function,
                default: () => {}
            },
            value: {
                type: Object,
                default: () => ({})
            },
            classes: {
                type: [Object, String],
                default: () => ({})
            }
        },
        computed: {
            getValueByDotNotation(){
                let columnData;
                let handle = this.name.split(".");
                if(handle.length > 1){
                    columnData = this.value;
                    handle.forEach(item => {
                        columnData = columnData[item];
                    });
                }else{
                    columnData = this.value[this.name];
                }
                return columnData;
            }
        },
        render(createElement){
            if(this.comp){
                let props = {
                    name: this.name,
                    data: this.value,
                    meta: this.meta
                };
                props[this.event] = this.handler;
                return createElement(this.comp,{
                    props,
                    attrs: {
                        classes: this.classes
                    },
                });
            }
            if(this.transform){
                return createElement('span',{
                    domProps:{
                        innerHTML: this.transform({
                            data: this.value,
                            name: this.name,
                            row: this.row,
                            column: this.column,
                            meta: this.meta
                        })
                    }
                });
            }
            return createElement('span',{domProps:{innerHTML: this.getValueByDotNotation}});
        }
    }
</script>