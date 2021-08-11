/*
Project start: July-27-2021
Project end: Aug-10-2021
This code is really bad, it was written with no intent of upkeep or quality
It was just an idea I coded for fun
*/

//p5's random is extremely slow compared to Math.random
function mRandom (min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

function shuffleArray (array){
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function copyArray (arrayToBeCopied){
  return [
    arrayToBeCopied[0],
    arrayToBeCopied[1],
    arrayToBeCopied[2]
  ];
}

function checkEqual (array1, array2){
  if(
    array1[0] == array2[0] 
    && array1[1] == array2[1] 
    && array1[2] == array2[2] 
  ){
    return true;
  } else {
    return false;
  }
}

function makeGray (input) {
  isGrayEnabled = false

  if (isGrayEnabled){
    return input
  }

  if (input.levels !== undefined){ // checks for arrays applied into p5 color()
    input = input.levels;
  }

  let avgColor = (input[0] + input[1] + input[2]) / 3;
  if (avgColor > 255) {
    avgColor = 255
  }
  let colorGrayed = [avgColor, avgColor, avgColor];
  return colorGrayed;
}

let overLapRange = [3,8]
class PixelBlock{
  constructor (pixelDimensionScaler, position, colorVariance, dominantColor){
    this.pixelDimensionScaler = pixelDimensionScaler;
    this.position = position;
    this.colorVarianceMax = colorVariance;
    // console.log("this startingColor: ", startingColor.levels);

    this.overLap = 4;
    this.dimensions = [
      windowWidth / this.pixelDimensionScaler[0],
      windowHeight / this.pixelDimensionScaler[1]
    ];

    this.domColor = copyArray(dominantColor.levels);
    this.prevDomColor = copyArray(this.domColor);
    this.color = copyArray(this.domColor);
    this.colorGoal = [0,0,0];

    this.borderFadeCountGoal = 0; // say our gaol is to reach the fade in 10 frames
    this.borderFadeCurrent = 0; // then this will say which frame we are currently on

    this.colorMode = "GOAL";
    // Tells if this block is approaching the goal or the dom color


    this.setDomColor = function (domColor, overLap){
      this.prevDomColor = copyArray(this.domColor);
      this.domColor = copyArray(domColor.levels);
      this.overLap = overLap
    }

    this.resetGoal = function() {
      // console.log("|Reset goal to dom|") //#####################################
      this.colorMode = "DOM"
      this.colorGoal = copyArray(this.domColor);
    }

    this.setGoal = function() {
      // console.log("|set goal|" ) //#############################################
      this.colorMode = "GOAL"

      this.totalColorChange = mRandom(1,this.colorVarianceMax); // it would be cool to use some 
      // graph math to curve the total color change. Like have most be 0 - 5 and
      // then have some drastically rarer ones pick 5 - 10
      // total RGB vals changed spread across all three colors
      // console.log("totalColorChange: ", this.totalColorChange);

      //rgb val budget this color will raise or lower by
      this.colorChange = [0,0,0] 

      // There seems to be some bias towards the first color so this solves that
      // randomizing which color will be first
      // console.log("randomColor: ", this.randomColor);
      this.randomColor = [0,1,2]
      this.randomColor.sort(function (a, b) { return 0.5 - Math.random() })


      this.colorChange[this.randomColor[0]] = mRandom(0, this.totalColorChange);
      this.totalColorChange -= this.colorChange[this.randomColor[0]];
      this.colorChange[this.randomColor[1]] = mRandom(0, this.totalColorChange);
      this.totalColorChange -= this.colorChange[this.randomColor[1]];
      this.colorChange[this.randomColor[2]] = this.totalColorChange
      
      for(let i = 0; i < 3; i++){
        this.posOrNeg = Math.round(Math.random()) * 2 - 1
        this.colorGoal[i] = this.color[i] + this.posOrNeg * this.colorChange[i];
      }
      // print("colorGoal: ", this.colorGoal);
    } // set goal func


    this.update = function() {
      // console.log("|Update|") //################################################
      if (checkEqual(this.color, this.domColor)){
        // console.log("Color has reached goal")
        if (this.colorMode = "DOM"){ // color has reached dom color and
          this.setGoal();            // will search for new custom color
        }
      }

      // TO DO set color change according do distance from current color to goal
      // the further a color is the faster it is, min speed of 1
      for (let i = 0; i < 3; i++) {
        if (this.color[i] < this.colorGoal[i]){
          this.color[i] += mRandom(0,2)
        } else if (this.color[i] > this.colorGoal[i]){
          this.color[i] -= mRandom(0,2)
        }
      }

      // Checks if color has reached goal if so return to dominant color resetGoal()
      if (checkEqual(this.color, this.colorGoal)){
        // console.log("Color has reached goal")
        if (this.colorMode = "GOAL"){ // color has reached custom color and will
          this.resetGoal();           // return to dom
        }
      }

      //Checks if color has surpassed limits if so reset color goal
      for (let i = 0; i < this.color.length; i++){
        if (this.color[i] > 255){ // color has passed limit
          // console.log("Color passed 255")
          this.color[i] = 255 - 1
          this.resetGoal();
        } else if (this.color[i] < 0){ // color has passed limit
          // console.log("Color passed 100")
          this.color[i] = 0 + 1
          this.resetGoal();
        }
      } // color update for loop

      // console.log("domColor", this.domColor); //##########################
      // console.log("colorGoal  ", this.colorGoal); //############################
      // console.log("color      ", this.color); //################################
    } // color update func

    this.show = function() {
      this.update();
      // console.log("|Show|") //##################################################
      // fill(makeGray(this.color));
      // stroke(makeGray(this.domColor));

      // fill(makeGray(this.color));
      // stroke(makeGray(this.domColor));

      // let overLap = 1 // deep fried 
      // let overLap = 3 // smooth but still with  a lot of variance
      // let overLap = 6 // its been very gradual but this one still has some slight variance
      // let overLap = 7 // starting to get blocky
      // let overLap = 9 // blockier but I'm starting to like it, it would make a nice backdrop
      // let overLap = 10 // at some points unnoticeable
      
      //this.overLap = "foo" // to set fixed overlap
      fill([...this.color, 255/(this.overLap/2)]); 
      stroke(this.domColor);
      // console.log("this.color: ", this.color)
      rect(
        this.position[0] * this.dimensions[0],
        this.position[1] * this.dimensions[1], 
        this.dimensions[0] * this.overLap, // this is dumb fix later
        this.dimensions[1] * this.overLap
      );
      // console.log("show")
    } // show func
  } //constructor
}

let brightnessMin = 100 
function setArrayDomColor(){
  newDomColor = [
    mRandom(0, 360), //  HUE  don't change this
    mRandom(40, 90), //  Saturation
    mRandom(90, 100), //  Brightness
  ];

  colorMode(HSB);
  newDomColor = color(newDomColor);
  colorMode(RGB); //most of the old code uses RGB so I don't want to mess with anything

  let overLap = mRandom(overLapRange[0], overLapRange[1]);
  console.log("overLap", overLap);

  // sends new dom color to all blocks
  for (let block of pixelBlocksArray){
    block.setDomColor(color(newDomColor), overLap);
    block.setGoal();
  }
  // console.log("Set new dom color"); //###########################################
  // console.log(newDomColor);
  // console.log("")
}

function hotFix(){ // TO DO separate setArrayDomColor from color generation
  newDomColor = [
    mRandom(0, 360), //  HUE  don't change this
    mRandom(40, 90), //  Saturation
    mRandom(90, 100), //  Brightness
  ];
  
  colorMode(HSB);
  newDomColor = color(newDomColor);
  colorMode(RGB);
  return newDomColor;
}

let pixelBlocksArray = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(color("#F7C59F"));

  let pixelDimensionScaler = [];
  let startingColor;

  if (confirm("Custom inputs? Cancel for recommended")){
     pixelDimensionScaler = [
      prompt("Pixel Width scale, default 1"),
      prompt("Pixel Height scale, default 100")
     ];
    startingColor = color(prompt("Hex color code"));
    brightnessMin = prompt("Brightness min color value 0-255")
    overLapRange = [
      prompt("Smoothness range min, default 3"),
      prompt("Smoothness range max, default 10")
     ];
    colorVariance = prompt("Color variance max, default 90")
  } else {
    startingColor = color(hotFix());
    colorVariance = 90; // ---=={########################################}==---

    if (windowWidth > windowHeight){
      pixelDimensionScaler = [1,100];
      strokeWeight(1);
    } else {
      pixelDimensionScaler = [1,100];
      strokeWeight(0.50);
    }
  }// pDScaler[0] = x  then pD[0] = cD / pDScaler
  console.log("global startingColor: ", startingColor.levels);
  // background(makeGray(startingColor));
  // strokeWeight(0.75);
  // stroke(makeGray(startingColor));

  background(startingColor);
  stroke(startingColor);

  console.log("pixelDimensionScaler: ", pixelDimensionScaler)
  console.log(
    "pixelDimensions: ",
    [
      windowWidth / pixelDimensionScaler[0],
      windowHeight / pixelDimensionScaler[1]
    ]
  );

  this.pixelCount = pixelDimensionScaler[0] * pixelDimensionScaler[1];
  console.log("pixelCount: ", pixelCount);

  // pixelBlocksArray.push(new PixelBlock([2,2], [0,0], startingColor));
  // pixelBlocksArray[0].setGoal();
  for (let x = 0; x < pixelDimensionScaler[0]; x++){ //creates an array of blocks
    for (let y = 0; y < pixelDimensionScaler[1]; y++){
      pixelBlocksArray.push(
        new PixelBlock(pixelDimensionScaler, [x,y], colorVariance, startingColor)
      );
      pixelBlocksArray[x + y].setGoal();
    }
  }
  console.log("");
}

function keyPressed() {
  if (keyCode === 32) { //space bar
    setArrayDomColor();
    frameCount = 0
  }
}
function touchStarted() {
  if (frameCount > 20){
    setArrayDomColor();
    frameCount = 0
  }
}

let frameCount = 0;
let secondsGoal = 15;

function draw() {
  frameRate(30);
  frameCount += 1;

  if (frameCount >= (30 * secondsGoal)){
    console.log("Frame count", frameCount);
    console.log("Sec count", frameCount / 30);
    frameCount = 0;
    secondsGoal = mRandom(10,15);//(2,7) // (5,15)
    setArrayDomColor();
  }
  // if (1 == mRandom(1, 20 * 30)){ // have it so that a new dom cannot be selected until
  //   setArrayDomColor(); // most of the blocks have reached the prev dom
  // }

  // console.log(pixelBlocksArray);
  for (block of pixelBlocksArray){
    block.show();
    // console.log(block);
  }
  // console.log("pixelBlocksArray:", pixelBlocksArray);
  // console.log("#############################");
  // console.log(""); //###########################################################
  // background(color(255,204,0));
}
