<template>
    <div id="draw-board">
        <ToolsBox v-model="currentTool" />
        <div class="color-picker-box">
            <div class="font-range">
                <input class="font-range-input" type="range" name="" id="">
            </div>
            <color-picker v-model="currentColor" />
        </div>
        
    </div>
</template>

<script>
import ToolsBox from './components/Tools.vue'
import { Chrome } from 'vue-color'

export default {
    data() {
        return {
            currentTool: '',
            currentColor: { r: 0, g: 0, b: 0 }
        };
    },
    components: {
        ToolsBox, 
        'color-picker': Chrome,
    },
    watch: {
        
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            
        },
    },
};
</script>

<style scoped lang="less">
#draw-board {
    text-align: center;
    position: relative;
    width: 100%;
    /deep/.vc-slider-swatches{
        display: none;
    }
    /deep/.vc-slider{
        width: 100%;
    }
    .color-picker-box{
        width: 85%;
        left: 6vw;
        right: auto;
        position: fixed;
        bottom: 3vw;
        .font-range{
            width: 100%;
        }
        .font-range-input{
            width: 100%;
        }
    }
    .flex-row{
      display: flex;
      align-items: center;
      flex-direction: row;
      width: 100%;
    }
}
</style>

<style lang="css" scoped>
</style>