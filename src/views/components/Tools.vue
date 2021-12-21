<!-- 画板工具库-->
<template>
    <div class="white-board-tools">
        <div class="tool-box">
            <div 
                class="tool-box-item" 
                :class="currentTool === item.type ? 'tool-box-item-acitve' : ''"
                v-for="(item, index) in toolsList" 
                :key="index"
                @click="currentTool = item.type"
            >
                <div v-if="['line'].includes(item.type)" class="tool-line">/</div>
                <i v-else :class="item.icon"></i>
            </div>
            <div class="tool-box-item">
                <i class="fa fa-undo"></i>
                <!-- <p>撤销</p> -->
            </div>
            <div class="tool-box-item">
                <i class="fa fa-trash-o"></i>
                <!-- <p>清空</p> -->
            </div>
            <div class="tool-box-item">
                <i class="fa fa-picture-o"></i>
                <!-- <p>保存</p> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: null
        }
    },
    data() {
        return {
            toolsList: [
                { type: 'pencil', icon: 'fa fa-pencil' },
                { type: 'line', icon: 'tool-line' },
                { type: 'brush', icon: 'fa fa-paint-brush' },
                { type: 'eraser', icon: 'fa fa-eraser' }
            ]
        };
    },
    computed: {
        currentTool: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    mounted() {
        
    },
    methods: {
        
    },
};
</script>

<style scoped lang="less">
.white-board-tools {
    .tool-box {
        width: 100%;
        display: flex;
        .tool-box-item{
            flex: 1;
            box-sizing: border-box;
            padding: 2.5vw 2vw;
            border-right: 1px solid #ededed;
            border-bottom: 1px solid #ededed;
            i{
                font-size: 1.1em;
            }
            p{
                font-size: 0.8em;
                margin-top: 0.5vw;
            }
        }
        .tool-line{
            font-weight: 700;
        }
        .tool-box-item-acitve{
            background-color: rgba(0, 0, 0, .5);
            color: rgba(255, 255, 255, 1);
        }
    }
}
</style>
