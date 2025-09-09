let maxAttempts = 6;
let index = 0;
let cellIndex = 0;
let wordSize = 8;
let PADDING = 5;
let CELLSIZE = 0;
let currentWord;
let Font;
let Lib;
let Grid;
function setup(){
    createCanvas(400, 400);
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(25);
    Lib=loadStrings("lib.txt");
    currentWord=setWord().toUpperCase();
    wordSize=currentWord.length;
    CELLSIZE=(width / wordSize) - 25;
    Grid=createGrid();
}

function createGrid(){
    let tempGrid = processing2jsNewNDimArray([maxAttempts, wordSize]);
    for(let i = 0;i < maxAttempts;i++) {
        tempGrid[i]=createRow(i);
    }
    return tempGrid;
}

function createRow(Index){
    let tempRow = new Array(wordSize);
    for(let i = 0;i < wordSize;i++) {
        let xOffset = width / 2 - (wordSize * (CELLSIZE + PADDING)) / 2 - CELLSIZE / 2;
        let yOffset = height / 2 - (maxAttempts * (CELLSIZE + PADDING)) / 2 - CELLSIZE / 2;
        let x = (i + 1) * (CELLSIZE + PADDING) + xOffset;
        let y = (Index + 1) * (CELLSIZE + PADDING) + yOffset;
        let c = new Cell(x, y, CELLSIZE, i + 1);
        c.rowIndex=Index;
        tempRow[i]=c;
    }
    return tempRow;
}

function checkWord(Word){
    for (let P2JSi = 0; P2JSi < Lib.length; P2JSi++){
        let Root = Lib[P2JSi];
        let Ending = Root.split("-", 0);
        let EndingList = loadStrings(Ending[1]);
        for (let P2JSi = 0; P2JSi < EndingList.length; P2JSi++){
            let end = EndingList[P2JSi];
            if(Word.equals((Ending[0] + end).toUpperCase())) {
                return true;
            }
        }
    }
    return false;
}

function setWord(){
    let RandomRoot = int(random(0, Lib.length - 1));
    let Root = Lib[RandomRoot];
    let Ending = Root.split("-");
    let EndingList = loadStrings(Ending[1]);
    let RandomEnding = int(random(0, EndingList.length - 1));
    return Ending[0] + EndingList[RandomEnding];
}

function combinedWord(ind){
    let Word = "";
    for(let i = 0;i < wordSize;i++) {
        Word+=Grid[ind][i].Letter;
    }
    return Word;
}

function keyPressed(){
    let k = str(key).toUpperCase().charAt(0);
    cellIndex=constrain(cellIndex, 0, wordSize);
    if(keyCode == 10 && cellIndex >= wordSize) {
        if(checkWord(combinedWord(index))) {
            index+=1;
            cellIndex=0;
        }
    }
    if(keyCode == 8 && cellIndex > 0) {
        cellIndex-=1;
        Grid[index][cellIndex].Letter=' ';
    }
    if(cellIndex >= wordSize) return;
    if(k >= 65 && k <= 90) {
        Grid[index][cellIndex].Letter=k;
        cellIndex+=1;
    }
}

function draw(){
    background(205);
    for(let i = 0;i < Grid.length;i++) {
        for(let i2 = 0;i2 < wordSize;i2++) Grid[i][i2].drawCell();
    }
}

class Cell{
    constructor(X, Y, Size, Index){
        this.CORRECT_COLOR = color(50, 255, 50);
        this.NEAR_COLOR = color(230, 255, 50);
        this.Letter = ' ';
        this.rowIndex = 0;
        this.x=X;
        this.y=Y;
        this.s=Size;
        this.lindex=Index;
    }

    drawCell(){
        let Height = textAscent() / 2;
        fill(0);
        if(index > this.rowIndex) {
            if(currentWord.charAt(this.lindex - 1) == this.Letter) fill(this.CORRECT_COLOR);
    else if(currentWord.contains(str(this.Letter))) {
                let letterCount = 0;
                let inputCount = 0;
                for(let i = 0;i < this.lindex - 1;i++) {
                    if(currentWord.charAt(i) == this.Letter) letterCount++;
                    if(combinedWord(this.rowIndex).charAt(i) == this.Letter) inputCount++;
                }
                if(inputCount < letterCount) fill(this.NEAR_COLOR);
    else noFill();
            }
    else noFill();
        }
        rect(this.x, this.y, this.s, this.s);
        fill(255);
        text(this.Letter, this.x, this.y + Height);
    }

}


function processing2jsNewNDimArray(dimensions) {
    if (dimensions.length > 0) {
        let dim = dimensions[0];
        let rest = dimensions.slice(1);
        let newArray = new Array();
        for (var i = 0; i < dim; i++) {
            newArray[i] = processing2jsNewNDimArray(rest);
        }
        return newArray;
     } else {
        return undefined;
     }
 }
