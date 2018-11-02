var ctx = null;
var p1 = null;
var p2 = null;
var pRes = null;
var addMul = 'add';

$(function() {
    ctx = plot1.getContext("2d");
    canvasCross();
    $(".poly-in").bind({
        input: function() {
            p1 = new Poly($(".poly-in")[0].value, undefined);
            p2 = new Poly($(".poly-in")[1].value, undefined);
            if (addMul == 'add') {
                pRes = p1.add(p2);
            } else {
                pRes = p1.mul(p2);
            }
            $("#out").text(pRes.toString());
            canvasClear();
            canvasCross();
            canvasDraw(p1.calculate(-250, 1, 251), "#ff0000");
            canvasDraw(p2.calculate(-250, 1, 251), "#00ff00");
            canvasDraw(pRes.calculate(-250, 1, 251), "#0000ff");
            //canvasDraw(pRes.derivative().calculate(-250, 1, 250), "#ff0000");
            //canvasDraw(pRes.derivative().calculate(-250, 1, 250), "#ff0000");
        }
    });
});

function canvasDraw(arr, color) {
    if (Array.isArray(arr)) {
        ctx.lineWidth = .75;
        if (color != null) {
            ctx.strokeStyle = color;
        } else {
            ctx.strokeStyle = "#000000";
        }
        var step = plot1.width / arr.length;
        ctx.beginPath();
        //ctx.moveTo(0, plot1.height/2 + arr[i]);
        for(var i = 0; i < arr.length; i++) {
            ctx.lineTo((plot1.width - arr.length) / 2 + i, 250-(arr[i])-.5);
        }
        ctx.stroke();
        ctx.closePath();
    }
}

function canvasCross() {
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = .5;
    ctx.moveTo(0, plot1.height/2 - .5);
    ctx.lineTo(plot1.width, plot1.height/2 - .5);
    ctx.moveTo(plot1.width/2 - .5, 0);
    ctx.lineTo(plot1.width/2 - .5, plot1.height);
    ctx.stroke();
    ctx.closePath();
}

function canvasClear() {
    ctx.clearRect(0, 0, plot1.width, plot1.height)
}
