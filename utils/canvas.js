// 查找字段分隔符号
const findBreakPoint = function(text, width, context) {
	let min = 0;
	let max = text.length - 1;
	while (min <= max) {
		let middle = Math.floor((min + max) / 2);
		let middleWidth = context.measureText(text.substr(0, middle)).width;
		let oneCharWiderThanMiddleWidth = context.measureText(
			text.substr(0, middle + 1)
		).width;
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
	let textArray = text.split("\r\n");
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
const drawRect = function(ctx, x, y, width, height, color) {
	ctx.beginPath();
	if (color) {
		ctx.fillStyle = color;
	}
	ctx.rect(x, y, width, height);
	ctx.fill();
};
// 文字
const drawText = function(ctx, text, x, y, align, color, width, fontSize) {
	if (fontSize) {
        ctx.setFontSize(fontSize);
	}
	ctx.fillStyle = color;
	ctx.setTextAlign(align);
	ctx.fillText(text, x, y, width);
};
//纵向排版文字
/**
 *
 * @param {Object} ctx
 * @param {String} text
 * @param {String} x
 * @param {Number} y
 * @param {String} align
 * @param {*} color
 * @param {Number} width
 * @param {Number} fontSize 字体大小
 */
const drawTextVertical = function(ctx, text, x, y, align, color, fontSize) {
    if (fontSize) {
        ctx.setFontSize(fontSize);
    }
	ctx.fillStyle = color;
	ctx.setTextAlign(align);
    var arrText = text.split("");
    var arrWidth = arrText.map(function (letter) {
        // return 26;
        const metrics = ctx.measureText(letter);
        const width = metrics.width;
        return width+20;
      });
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	// 开始逐字绘制
	arrText.forEach(function(letter, index) {
		// 确定下一个字符的纵坐标位置
		var letterWidth = arrWidth[index];
		// 是否需要旋转判断
		var code = letter.charCodeAt(0);
		if (code <= 256) {
			ctx.translate(x, y);
			// 英文字符，旋转90°
			ctx.rotate((90 * Math.PI) / 180);
			ctx.translate(-x, -y);
		} else if (index > 0 && text.charCodeAt(index - 1) < 256) {
			// y修正
			y = y + arrWidth[index - 1] / 2;
		}
		ctx.fillText(letter, x, y);
		// 旋转坐标系还原成初始态
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		// 确定下一个字符的纵坐标位置
		var letterWidth = arrWidth[index];
		y = y + letterWidth;
	});
};
// 圆形图片
/**
 *
 * @param {*} ctx
 * @param {半径} c_width
 * @param {图片宽度} img_width
 * @param {圆心横坐标} x
 * @param {圆心纵坐标} y
 * @param {左上方横坐标} x1
 * @param {左上方纵坐标} y1
 * @param {图片地址} img_url
 */
const drawCircleImage = function(
	ctx,
	c_width,
	img_width,
	x,
	y,
	x1,
	y1,
	img_url
) {
	ctx.save();
	ctx.beginPath();
	// 画圆
	ctx.arc(x, y, c_width, 0, 2 * Math.PI);
	ctx.fillStyle = "#fff";
	ctx.fill();
	ctx.clip();
	ctx.drawImage(img_url, x1, y1, img_width, img_width);
	ctx.restore();
};
module.exports = {
	drawRect: drawRect,
	drawText: drawText,
	drawTextVertical: drawTextVertical,
	breakLinesForCanvas: breakLinesForCanvas,
	drawCircleImage: drawCircleImage
};
