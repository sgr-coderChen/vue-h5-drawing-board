<template>
    <div
        id="draw-board"
        @click.stop="(showColorPicker = false), (showLineWidthRange = false)"
    >
        <ToolBox
            class="tool-box-container"
            v-model="currentTool"
            @undo="undo"
            @reset="reset"
            @save="save"
            @select-color="showColorPicker = !showColorPicker"
            @select-line-width="showLineWidthRange = !showLineWidthRange"
        />
        <canvas ref="drawingBoard" class="draw-board-container" />
        <div v-show="showColorPicker" class="color-picker-box">
            <ColorPicker v-model="currentColor" />
        </div>
        <div v-show="showLineWidthRange" class="font-range">
            <input
                v-model="penAttibutes.width"
                class="font-range-input"
                type="range"
            />
        </div>
    </div>
</template>

<script>
import ToolBox from "./components/Tools.vue";
import ColorPicker from "./components/ColorPicker.vue";

export default {
    data() {
        return {
            currentTool: "pencil", // 工具类型
            currentColor: "#000000",
            showColorPicker: false,
            showLineWidthRange: false,
            painting: false, // 是否正在绘制
            canvas: null,
            ctx: null,
            //  笔触属性
            penAttibutes: {
                width: 12,
                lineCap: "round",
                lineJoin: "round",
                strokeStyle: "#000",
                fillStyle: "#000",
                globalCompositeOperation: "source-over",
                globalAlpha: 1,
            },
            points: [], // 滑动时收集的点
            beginPoint: null, // 起点
            canvasHistory: [], // 划线操作的所有历史数据
            step: 0, // 画笔抬起的步数，清空时，步数也清空
        };
    },
    components: {
        ToolBox,
        ColorPicker,
    },
    watch: {
        currentTool(newVal) {
            switch (newVal) {
                //  铅笔，直线
                case "line":
                case "pencil":
                    this.penAttibutes.lineCap = "round";
                    this.penAttibutes.globalCompositeOperation = "source-over";
                    this.penAttibutes.strokeStyle = this.currentColor;
                    break;
                //  橡皮擦
                case "eraser":
                    this.penAttibutes.lineCap = "round";
                    this.penAttibutes.globalCompositeOperation = "destination-out";
                    this.penAttibutes.strokeStyle = this.colorRgb(this.currentColor, 1);
                    break;
                //  荧光笔（刷子）
                case "brush":
                    this.penAttibutes.lineCap = "butt";
                    this.penAttibutes.strokeStyle = this.colorRgb(this.currentColor, 0.4);
                    this.penAttibutes.globalCompositeOperation = "source-over";
                    break;
                default:
                    this.penAttibutes.globalCompositeOperation = "source-over";
                    break;
            }
        },
        currentColor(newVal) {
            if (this.currentTool === "brush") {
                this.penAttibutes.strokeStyle = this.colorRgb(newVal, 0.4);
            } else {
                this.penAttibutes.strokeStyle = newVal;
                this.penAttibutes.fillStyle = newVal;
            }
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.canvas = this.$refs.drawingBoard;
            this.ctx = this.$refs.drawingBoard.getContext("2d");
            this.autoSetSize();
            this.saveToHistory();
            //  同时兼容移动和pc端
            if (this.canvas.ontouchstart !== undefined) {
                this.canvas.ontouchstart = this.down;
                this.canvas.ontouchmove = this.move;
                this.canvas.ontouchend = this.up;
            } else {
                this.canvas.onmousedown = this.down;
                this.canvas.onmousemove = this.move;
                this.canvas.onmouseup = this.up;
                this.canvas.onmouseout = this.up;
            }
        },
        //  按下
        down(ev) {
            ev = ev.touches ? ev.touches[0] : ev;
            this.painting = true;
            const { x, y } = this.getPos(ev);
            this.points.push({ x, y });
            this.beginPoint = { x, y };
            this.ctx.save();
        },
        //  移动
        move(ev) {
            ev = ev.touches ? ev.touches[0] : ev;
            const { x, y } = this.getPos(ev);
            if (!this.painting) return;
            this.points.push({ x, y });
            if (this.currentTool === "line") {
                this.drawPointLine(this.beginPoint, { x, y });
            } else {
                if (this.points.length > 3) {
                    const lastTwoPoints = this.points.slice(-2);
                    const controlPoint = lastTwoPoints[0];
                    const endPoint = {
                        x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                        y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
                    };
                    this.drawLine(this.beginPoint, controlPoint, endPoint);
                    this.beginPoint = endPoint;
                }
            }
        },
        //  抬起
        up() {
            if (!this.painting) return;
            const { x, y } = this.points[this.points.length - 1];
            this.points.push({ x, y });
            if (this.currentTool === "line") {
                this.drawPointLine(this.beginPoint, { x, y });
            } else {
                if (this.points.length > 3) {
                    const lastTwoPoints = this.points.slice(-2);
                    const controlPoint = lastTwoPoints[0];
                    const endPoint = lastTwoPoints[1];
                    this.drawLine(this.beginPoint, controlPoint, endPoint);
                }
            }
            this.ctx.restore();
            this.saveToHistory();
            this.beginPoint = null;
            this.painting = false;
            this.points = [];
        },
        //  画直线
        drawPointLine(beginPoint, endPoint) {
            this.ctx.putImageData(this.canvasHistory[this.step - 1], 0, 0); // 将图像数据放回画布 不然直线会散开
            this.ctx.lineWidth = this.penAttibutes.width;
            this.ctx.lineCap = this.penAttibutes.lineCap;
            this.ctx.strokeStyle = this.penAttibutes.strokeStyle;
            this.ctx.fillStyle = this.penAttibutes.fillStyle;
            this.ctx.globalCompositeOperation = this.penAttibutes.globalCompositeOperation;
            this.ctx.globalAlpha = this.penAttibutes.globalAlpha;
            this.ctx.beginPath();
            this.ctx.moveTo(beginPoint.x, beginPoint.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            this.ctx.stroke();
        },
        //  撤回上一步
        undo() {
            if (this.step > 1) {
                this.ctx.putImageData(
                    this.canvasHistory[--this.step - 1],
                    0,
                    0
                );
            } else {
                console.log("这是最后一张");
            }
        },
        //  清空所有
        reset() {
            this.ctx.putImageData(this.canvasHistory[0], 0, 0);
            this.step = 1;
            this.canvasHistory.length = this.step;
        },
        //  保存为图片
        save() {
            let imgUrl = this.canvas.toDataURL("image/png");
            let saveA = document.createElement("a");
            document.body.appendChild(saveA);
            saveA.href = imgUrl;
            saveA.download = "signature" + new Date().getTime();
            saveA.target = "_blank";
            saveA.click();
        },
        //  绘画
        drawLine(beginPoint, controlPoint, endPoint) {
            this.ctx.lineWidth = this.penAttibutes.width;
            this.ctx.lineCap = this.penAttibutes.lineCap;
            this.ctx.lineJoin = this.penAttibutes.lineJoin;
            this.ctx.strokeStyle = this.penAttibutes.strokeStyle;
            this.ctx.fillStyle = this.penAttibutes.fillStyle;
            this.ctx.globalCompositeOperation = this.penAttibutes.globalCompositeOperation;
            this.ctx.globalAlpha = this.penAttibutes.globalAlpha;
            this.ctx.beginPath();
            this.ctx.moveTo(beginPoint.x, beginPoint.y);
            this.ctx.quadraticCurveTo(
                controlPoint.x,
                controlPoint.y,
                endPoint.x,
                endPoint.y
            );
            this.ctx.stroke();
        },
        //  获取当前坐标点
        getPos(ev) {
            return {
                x: ev.clientX,
                y: ev.clientY,
            };
        },
        //  自动设置宽高
        canvasSetSize() {
            let pageWidth = document.documentElement.clientWidth;
            let pageHeight = document.documentElement.clientHeight;
            this.canvas.width = pageWidth;
            this.canvas.height = pageHeight;
        },
        //   监听窗口变化
        autoSetSize() {
            this.canvasSetSize();
            window.onresize = function () {
                this.canvasSetSize();
            };
        },
        //  保存到历史
        saveToHistory() {
            if (this.step === this.canvasHistory.length) {
                let nowImage = this.ctx.getImageData(
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );
                this.canvasHistory.push(nowImage);
                this.step++;
            } else {
                this.canvasHistory.length = this.step; // 截断数组
            }
        },
        //  颜色16转rgba
        colorRgb(str, opacity) {
            let sColor = str.toLowerCase();
            if (sColor) {
                if (sColor.length === 4) {
                    let sColorNew = "#";
                    for (let i = 1; i < 4; i += 1) {
                        sColorNew += sColor
                            .slice(i, i + 1)
                            .concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                let sColorChange = [];
                for (let i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
            } else {
                return sColor;
            }
        },
    },
};
</script>

<style scoped lang="css">
#draw-board {
    text-align: center;
    position: relative;
    overflow: hidden;
    width: 100%;
}
#draw-board .color-picker-box {
    right: 5vw;
    position: fixed;
    top: 22vw;
}
#draw-board .font-range {
    right: 5vw;
    position: fixed;
    top: 14vw;
}
#draw-board .font-range-input {
    width: 100%;
}
#draw-board .tool-box-container {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #fff;
}
#draw-board .flex-row {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
}
#draw-board .draw-board-container {
    background-color: #fff;
}
</style>