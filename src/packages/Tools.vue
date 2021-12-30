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
                <i :class="item.icon"></i>
            </div>
            <div class="tool-box-item" @click.stop="$emit('select-color')">
                <i class="iconfont icon-diaoseban"></i>
            </div>
            <div class="tool-box-item" @click.stop="$emit('select-line-width')">
                <i class="iconfont icon-bicuxi"></i>
            </div>
            <div class="tool-box-item" @click.stop="$emit('undo')">
                <i class="iconfont icon-chexiao"></i>
            </div>
            <div class="tool-box-item" @click.stop="$emit('reset')">
                <i class="iconfont icon-shanchu"></i>
            </div>
            <div class="tool-box-item" @click.stop="$emit('save')">
                <i class="iconfont icon-xiazai"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Tools',
    props: {
        value: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            toolsList: [
                { type: 'pencil', icon: 'iconfont icon-pencil-full' },
                { type: 'line', icon: 'iconfont icon-xianduan' },
                { type: 'brush', icon: 'iconfont icon-yingguangbi' },
                { type: 'eraser', icon: 'iconfont icon-eraser' }
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

<style lang="css" scoped>
.white-board-tools .tool-box {
    width: 100%;
    display: flex;
}
.white-board-tools .tool-box-item{
    flex: 1;
    box-sizing: border-box;
    padding: 2.5vw 2vw;
    border-right: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
}
.white-board-tools .no-right-border{
    border-right: none;
}
.white-board-tools .tool-box-item i {
    font-size: 1.2em;
}
.white-board-tools .tool-box-item p {
    font-size: 0.8em;
    margin-top: 0.5vw;
}
.white-board-tools .tool-line{
    font-weight: 700;
}
.white-board-tools .tool-box-item-acitve{
    background-color: rgba(0, 0, 0, .5);
    color: rgba(255, 255, 255, 1);
}
</style>
