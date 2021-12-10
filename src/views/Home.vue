<template>
    <div id="draw-board">
        <ToolsBox v-model="draw" @save="save" @clear="clearAll" />
        <canvas
            ref="canvasF"
            class="myCanvas"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
        />
        <div id="range-wrap">
            <input v-model="currentLineWidth" type="range" min="1" max="10" title="调整笔刷粗细" />
        </div>
        <div class="color-group">
            <ul class="flex-row">
                <li 
                    v-for="(item, index) in colorList" 
                    :key="index" 
                    @click="currentColor = item, draw = true"
                    class="color-item"
                    :class="currentColor == item ? 'color-item-active' : ''"
                    :style="{background: item}"
                >
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ToolsBox from './components/Tools.vue';

let canvasWidth;
let canvasHeight;

//获取当前屏幕的宽高
function getWindowSize() {
    canvasWidth = document.documentElement.clientWidth - 25;
    canvasHeight =
        document.documentElement.clientHeight -
        document.documentElement.clientHeight / 7;
    if (!canvasWidth) {
        return;
    }
    hengshuping();
}

//判断手机横竖屏状态：
function hengshuping() {
    if (window.orientation === 180 || window.orientation === 0) {
        // alert("竖屏状态！")
        canvasHeight =
            document.documentElement.clientHeight -
            document.documentElement.clientHeight / 7;
    }
    if (window.orientation === 90 || window.orientation === -90) {
        // alert("横屏状态！")
        canvasHeight = document.documentElement.clientHeight - 90;
    }
}

getWindowSize();

export default {
    data() {
        const { id } = this.$route.query
        return {
            imgUrl: '', //保存为图片
            canvasTxt: null,
            startX: 0,
            startY: 0,
            moveY: 0,
            moveX: 0,
            canvas: '',
            detailId: id,
            colorList: ['#c73420', '#6b9de8', 'green', 'black'],
            draw: true, // 画笔 || 橡皮擦模式
            currentLineWidth: 4, // 当前画笔粗细值
            currentColor: 'black'
        };
    },
    components: {
        ToolsBox,
    },
    watch: {
        // 设置颜色
        currentColor(color) {
            this.setColor(color)
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$nextTick(() => {
                let meta = document.createElement('meta');
                meta.content = 'portrait';
                document.getElementsByTagName('head')[0].appendChild(meta);

                this.canvas = this.$refs.canvasF;
                this.canvas.height = canvasHeight;
                this.canvas.width = canvasWidth;
                if (canvasWidth > canvasHeight) {
                    this.canvas.height = canvasHeight - 50;
                } else {
                    this.canvas.height = canvasHeight;
                }
                this.canvasTxt = this.canvas.getContext('2d');
            });
            window.addEventListener('resize', this.renderResize, false);
            
        },
        touchStart(ev) {
            ev.preventDefault();
            let obj = {
                x: ev.targetTouches[0].clientX - this.canvas.offsetLeft,
                y: ev.targetTouches[0].clientY - this.canvas.offsetTop,
            };
            this.startX = obj.x;
            this.startY = obj.y;
            this.canvasTxt.beginPath();
            this.canvasTxt.moveTo(this.startX, this.startY);
            this.canvasTxt.lineTo(obj.x, obj.y);
            this.canvasTxt.stroke();
            this.canvasTxt.closePath();
        },
        //  移动时绘制线条
        touchMove(ev) {
            if (this.draw) {
                this.drawLine(ev)
            } else {
                this.handleEraser(ev)
            }
        },
        //  绘制线条
        drawLine(ev) {
            ev.preventDefault();
            let obj = {
                x: ev.targetTouches[0].clientX - this.canvas.offsetLeft,
                y: ev.targetTouches[0].clientY - this.canvas.offsetTop,
            };
            this.canvasTxt.lineWidth = this.currentLineWidth;
            this.canvasTxt.lineCap = "round";
            this.canvasTxt.lineJoin = "round";

            this.moveY = obj.y;
            this.moveX = obj.x;
            this.canvasTxt.beginPath();
            this.canvasTxt.moveTo(this.startX, this.startY);
            this.canvasTxt.lineTo(obj.x, obj.y);
            this.canvasTxt.stroke();
            this.canvasTxt.closePath();
            this.startY = obj.y;
            this.startX = obj.x;
        },
        //  橡皮擦
        handleEraser(ev) {
            this.canvasTxt.beginPath();
            this.canvasTxt.save();
            this.canvasTxt.globalCompositeOperation = 'destination-out';
            this.canvasTxt.arc(
                ev.targetTouches[0].clientX - this.canvas.offsetLeft,
                ev.targetTouches[0].clientY - this.canvas.offsetTop,
                24, // 橡皮擦半径
                0,
                2 * Math.PI,
            );
            this.canvasTxt.fill();
            this.canvasTxt.restore();
            this.canvasTxt.closePath();
        },
        //  结束
        touchEnd(ev) {
            ev.preventDefault();
            this.canvasTxt.closePath();
        },
        //  清空所有
        clearAll() {
            this.canvasTxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw = true
        },
        //  设置背景色
        setColor(color) {
            this.canvasTxt.fillStyle = color;
            this.canvasTxt.strokeStyle = color;
        },
        //  保存为图片
        save() {
            let imgUrl = this.$refs.canvasF.toDataURL('image/png');
            let saveA = document.createElement("a");
            document.body.appendChild(saveA);
            saveA.href = imgUrl;
            saveA.download = "signature" + (new Date).getTime();
            saveA.target = "_blank";
            saveA.click();
        },
        renderResize() {
            // 判断横竖屏
            getWindowSize();
            this.canvas.width = canvasWidth;
            if (canvasWidth > canvasHeight) {
                this.canvas.height = canvasHeight - 50;
            } else {
                this.canvas.height = canvasHeight;
            }
            this.getMeetingNote();
        },
    },
};
</script>

<style scoped lang="less">
#draw-board {
    text-align: center;
    position: relative;
    .flex-row{
      display: flex;
      align-items: center;
      flex-direction: row;
      width: 100%;
    }
    .myCanvas {
        // border: 1px solid #ccc;
        background: #ededed;
        display: inline-block;
    }

    .canvas-btn {
        font-size: 0;
        width: calc(100% - 20px);
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        position: fixed;
        bottom: 20px;
        .btn {
            flex: 1;
        }

        .btn-press {
            background: #eeeeee;
        }
    }
    .color-group {
        position: fixed;
        right: 4%;
        bottom: 2%;
    }
    .color-group ul {
        list-style: none;
    }
    .color-group ul li {
        width: 30px;
        height: 30px;
        margin: 10px 0;
        margin-right: 20px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 3px solid white;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: 0.3s;
    }
    .color-item-active{
        box-shadow: 0 0 15px #00ccff!important;
    }
    #range-wrap {
        position: fixed;
        bottom: 5%;
        left: 20px;
        width: 30px;
        height: 150px;
        // margin-top: -75px;
    }
    #range-wrap input {
        transform: rotate(-90deg);
        background: #ededed;
        width: 150px;
        height: 20px;
        margin: 0;
        transform-origin: 75px 75px;
        border-radius: 15px;
        -webkit-appearance: none;
        outline: none;
        position: relative;
    }
    #range-wrap input::after {
        display: block;
        content: '';
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-right: 150px solid #333;
        border-left-width: 0;
        position: absolute;
        left: 0;
        top: 5px;
        // border-radius: 15px;
        z-index: 0;
    }
    #range-wrap input[type='range']::-webkit-slider-thumb,
    #range-wrap input[type='range']::-moz-range-thumb {
        -webkit-appearance: none;
    }
    #range-wrap input[type='range']::-webkit-slider-runnable-track,
    #range-wrap input[type='range']::-moz-range-track {
        height: 10px;
        border-radius: 10px;
        box-shadow: none;
    }
    #range-wrap input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 20px;
        width: 20px;
        margin-top: -1px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 8px #333;
        position: relative;
        z-index: 999;
    }
}
</style>

<style lang="css" scoped>
</style>