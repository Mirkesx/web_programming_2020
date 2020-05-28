function setup() { 
  createCanvas(400, 400);
  background(220);
  colorMode(HSB)
  } 

function draw() { 
 	c = map(mouseX,0,width,0,360)
  strokeWeight(0);

	for (var x = 0;x<width;x = x + 1){
    fill(x/360 * 360, 100, 100);
  	rect(x, height - 30, 30,30)
  	}

  strokeWeight(2);
  if(mouseIsPressed){
  	//stroke(c,75,100)
   line(mouseX,mouseY,pmouseX,pmouseY) 
  	}
  
}

function mousePressed(){ // different function (not in the continuous draw loop) with a condition of pressing the mouse
    // each time the mouse is pressed over these coordinates (the random rect), then the rect color will change color
	if((mouseX > 0) && (mouseX < width) && (mouseY > height - 30) && (mouseY < height)){
      stroke(c,75,100)
		}
}