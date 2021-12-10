<!-- 画板工具库-->
<template>
    <div class="white-board-tools">
        <div class="tool-box">
            <van-grid clickable :column-num="4">
                <van-grid-item :class="draw ? 'icon-active' : '' " @click="draw = true" >
                    <van-icon name="edit" size="1.4rem" />
                    <span class="grid-text">画笔</span>
                </van-grid-item>
                <van-grid-item :class="!draw ? 'icon-active' : '' " @click="draw = false" >
                    <van-icon name="bulb-o" size="1.4rem" />
                    <span class="grid-text">橡皮擦</span>
                </van-grid-item>
                <van-grid-item @click="$emit('clear')">
                    <van-icon name="delete-o" size="1.4rem" />
                    <span class="grid-text">清空</span>
                </van-grid-item>
                <van-grid-item @click="$emit('save')">
                    <van-icon name="photo-o" size="1.4rem" />
                    <span class="grid-text">保存</span>
                </van-grid-item>
            </van-grid>
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
            
        };
    },
    computed: {
        draw: { // true 为画笔  false 为橡皮擦
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
        test() {
            this.draw = !this.draw
            console.log(111)
        }
    },
};
</script>

<style scoped lang="less">
.white-board-tools {
    width: 100%;
    margin-bottom: 10px;
    /deep/.van-grid-item {
        .van-grid-item__content{
            padding:15px 10px;
            
        }
    }
    .grid-text{
        margin-top:1vw;
        font-size: 14px;
    }
    .icon-active{
        color: #c73420;
    }
    .tool-box {
        width: 100%;
    }
}
</style>
