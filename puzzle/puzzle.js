var l = 0;
var img;
var diff = 9;
var noElements;
var xS;
var yS;
var puzzles = [];
var selected;

var gotFileBool = false;

class Puzzle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.offset = createVector(x, y);
        this.snapped = false;
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    clicked() {
        if (mouseX > this.pos.x && mouseX < this.pos.x + xS && mouseY > this.pos.y && mouseY < this.pos.y + yS && mouseIsPressed && !selected && !this.snapped) {
            selected = this;
            return this;
        }
    }

    snap() {
        if (abs(this.pos.x - this.offset.x) < max(xS * 0.05, 10) && abs(this.pos.y - this.offset.y) < max(yS * 0.05, 10)) {
            this.setPos(this.offset.x, this.offset.y);
            this.snapped = true;
        }
        return this.snapped;
    }

    display() {
        image(img, this.pos.x, this.pos.y, xS, yS, this.offset.x, this.offset.y, xS, yS);
    }

    shuffle() {
        this.setPos(random(img.width - xS), random(img.height - yS));
    }
}

function setup() {
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    cnv.drop(gotFile);
    background(127, 127, 200);
    img = loadImage("flowers.jpg", () => {
        reloadImage();
    });
    console.log('Drag an image file onto the canvas to change/upload a new one.\nType d(<diff>) in console to change difficulty.');
}

function gotFile(file, abc) {
    if (file.type === 'image') {
        img = createImg(file.data).hide();
        setTimeout(() => {
            gotFileBool = true;
            reloadImage();
        }, 10);
    } else {
        console.log('Not an image file!');
    }
}

function reloadImage() {
    noElements = round(sqrt(diff));
    xS = round(img.width / noElements);
    yS = round(img.height / noElements);
    puzzles = [];
    for (let y = 0; y < noElements; y++) {
        for (let x = 0; x < noElements; x++) {
            puzzles.push(new Puzzle(xS * x, yS * y));                
        }
    }
    for (const p of puzzles) {
        p.shuffle();
    }
}

function removePuzzle(p) {
    puzzles = puzzles.filter((e) => {return e != p});
}

function d(df) {
    diff = df;
    reloadImage();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(127, 127, 200);
}

function draw() {
    background(127, 127, 200);

    textAlign(CENTER);
    if (!gotFileBool) {
        text('Drag an image file onto the canvas to change/upload a new one.\nType d(<diff>) in console to change difficulty.', width/2, height/2);
    }

    for (let y = 0; y < noElements; y++) {
        for (let x = 0; x < noElements; x++) {
            //puzzles.push(new Puzzle(xS * x, yS * y));     
            stroke(77, 77, 77);
            line(xS * x, 0, xS * x, img.height);
            line(0, yS * y, img.width, yS * y);
        }
    }

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
        removePuzzle(selected);
        puzzles.push(selected);
    }
}

function mouseReleased() {
    if (selected) {
        if (selected.snap()) {
            removePuzzle(selected);
            puzzles.unshift(selected);
        }
        selected = null;
    }
}