// 查找字段分隔符号
const findBreakPoint = function(text, width, context) {
    let min = 0;
    let max = text.length - 1;
    while (min <= max) {
        let middle = Math.floor((min + max) / 2);
        let middleWidth = context.measureText(text.substr(0, middle)).width;
        let oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
            return middle;
        }
        if (middleWidth < width) {
            min = middle + 1;
        } else {
            max = middle - 1;
        }
    }
    
    return -1;
};
// 字段分行
const breakLinesForCanvas = function(context, text, width, font) {
    let result = [];
    if (font) {
        context.font = font;
    }
    let textArray = text.split('\r\n');
    for (let i = 0; i < textArray.length; i++) {
        let item = textArray[i];
        let breakPoint = 0;
        while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
            result.push(item.substr(0, breakPoint));
            item = item.substr(breakPoint);
        }
        result.push(item);
    }
    return result;
};
// 画矩形
const drawRect = function(ctx,x,y,x1,y1,color){
    ctx.beginPath();
    if(color){
        ctx.fillStyle = color;
    }
    ctx.rect(x,y,x1,y1);
    ctx.fill();
};
// 文字
const drawText = function(ctx,text,x,y,align,color,width,font){
    if(font){
        ctx.font = font;
    }
    ctx.fillStyle = color;
    ctx.setTextAlign(align);
    ctx.fillText(text,x,y,width);
};
// 圆形图片
const drawCircleImage = function(ctx,c_width,img_width,x,y,x1,y1,img_url){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y,c_width,0, 2*Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.clip();
    ctx.drawImage(img_url, x1, y1, img_width,img_width);
    ctx.restore();
};
module.exports = {
    drawRect: drawRect,
    drawText: drawText,
    breakLinesForCanvas: breakLinesForCanvas,
    drawCircleImage: drawCircleImage
};