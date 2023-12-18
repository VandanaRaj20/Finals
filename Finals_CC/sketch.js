//FINALS!! For the finals I created two fun scenarios, each for FaceMesh and hand pose

let video;
let faceMesh;
let handpose;
let sound;

//an array to identify the landmarks from pre-trained ML model
let predictions = [];
let ripples = [];
let t = 0;
let selectedScenario = '';

function preload() {
  sound = loadSound('Water-Blup-2FarDistance-www.FesliyanStudios.com.mp3');
}

function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10);
  background(0);

  video = createCapture(VIDEO);
  video.size(width, height);

  // FaceMesh setup
  faceMesh = ml5.facemesh(video, modelReady);
  faceMesh.on('predict', gotFace);

  // HandPose setup
  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', gotHandPoses);

  // Hiding the video element so that the video does not take away the attention
  video.hide();

  // I created the buttons, users can choose the scenario they want
  let faceMeshButton = createButton('Face Mesh Scenario');
  styleButton(faceMeshButton);
  faceMeshButton.position(10, 10);
  faceMeshButton.mousePressed(() => {
    selectedScenario = 'faceMesh';
    background(0);
  });

  let handposeButton = createButton('Hand Pose Scenario');
  styleButton(handposeButton);
  handposeButton.position(200, 10);
  handposeButton.mousePressed(() => {
    selectedScenario = 'handpose';
    background(0);
  });
}

function styleButton(button) {
  button.style('background-color', 'black');
  button.style('border', 'none');
  button.style('color', '#66ff6e');
  button.style('padding', '10px 20px');
  button.style('text-align', 'center');
  button.style('text-decoration', 'none');
  button.style('display', 'inline-block');
  button.style('font-size', '16px');
  button.style('margin', '4px 20px');
  button.style('cursor', 'pointer');
  button.style('border-radius', '4px');
  button.style('border','2px solid #66ff6e' );
  
   // Hover effect when I hover over the button
  button.mouseOver(() => {
    button.style('background-color', '#66ff6e'); // Change background color on hover
    button.style('color', '#000000'); // Change border color on hover
  });

  // Reseting back to the original styles on mouse out
  button.mouseOut(() => {
    button.style('background-color', '#000000');
    button.style('color', '#66ff6e');
    button.style('border-color', '#66ff6e');
  });
}


function modelReady() {
  console.log('Model is ready!');
}


//FACE MESH SCENARIO
function gotFace(faces) {
  if (selectedScenario === 'faceMesh') {
    background(0);

    if (faces.length > 0) {
      let face = faces[0].scaledMesh;

      // Drawing circles at each face landmark
      noFill();
      stroke('#66ff6e');
      strokeWeight(2);
      for (let i = 0; i < face.length; i++) {
        
        //identitying the landmark that will be used as center of circle to be drawn
        let x = face[i][0];
        let y = face[i][1];
        ellipse(x, y, 10, 10); // drawing a circle at each landmark
      }
    }
  }
}


//HANDPOSE SCENARIO
function gotHandPoses(results) {
  if (selectedScenario === 'handpose') {
    background(0);

    predictions = results;

    // Creating a ripple at the hand position based on landmarks
    for (let i = 0; i < predictions.length; i++) {
      const [x, y] = predictions[i].landmarks[0];
      ripples.push(new Ripple(x, y));
      
      // Trigger the sound effect when a ripple is created
    sound.play();
    }

    
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].display();
      if (ripples[i].isFinished()) {
        ripples.splice(i, 1);
      }
    }
  }
}

//Creating a separate class for the ripples, it will start to fade when it is expanded to a certain distance, just like water ripples
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 100;
    this.alpha = 255;
    t = t + 0.01;
  }

    //here, i increase the size of the ripple while decreasing its opacity as size increases
  update() {
    this.radius += 5;
    this.alpha -= 5;
  }

  //giving properties of the ripple
  display() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
