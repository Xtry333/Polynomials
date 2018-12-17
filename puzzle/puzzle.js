var l = 0;
var img;
var diff = 140;
var noElements;
var xS;
var yS;
var puzzles = [];
var selected;
class Puzzle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.offset = createVector(x, y);
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    clicked() {
        if (mouseX > this.pos.x && mouseX < this.pos.x + xS && mouseY > this.pos.y && mouseY < this.pos.y + yS && mouseIsPressed && !selected) {
            selected = this;
            return this;
        }
    }

    snap() {
        if (abs(this.pos.x - this.offset.x) < 10 && abs(this.pos.y - this.offset.y) < 10) {
            this.setPos(this.offset.x, this.offset.y);
        }
    }

    display() {
        image(img, this.pos.x, this.pos.y, xS, yS, this.offset.x, this.offset.y, xS, yS);
    }
}

function setup() {
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    background(127, 127, 200);
    img = loadImage("flowers.jpg", () => {
        noElements = round(sqrt(diff));
        xS = round(img.width / noElements);
        yS = round(img.height / noElements);
        for (let y = 0; y < noElements; y++) {
            for (let x = 0; x < noElements; x++) {
                puzzles.push(new Puzzle(xS * x, yS * y));                
            }
        }
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(127, 127, 200);
}

function draw() {
    background(127, 127, 200);

    //#region Guidelines
    stroke(0);
    line(5, 15, width - 5, 15);
    line(5, 10, 5, 20);
    line(width - 5, 10, width - 5, 20);

    line(15, 5, 15, height - 5);
    line(10, 5, 20, 5);
    line(10, height - 5, 20, height - 5);
    noStroke();
    fill(0);
    textAlign(CENTER);
    text(width, width / 2, 30);
    textAlign(LEFT);
    text(height, 30, height / 2);
    //#endregion 

    puzzles.forEach(e => {
        if (selected) {
            selected.setPos(mouseX - xS/2, mouseY - yS/2);
        }
        e.display();
    });
}

function mousePressed() {
    for (let i = puzzles.length - 1; i >= 0; i--) {
        if (puzzles[i].clicked()) {
            break;
        }
    }
    if (selected) {
        //console.log(selected);
        puzzles.filter(() => {selected});
        puzzles.push(selected);
    }
}

function mouseReleased() {
    if (selected) {
        selected.snap();
        selected = null;
    }
}