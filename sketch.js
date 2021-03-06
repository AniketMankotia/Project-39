var PLAY = 1;
var END = 0;
var gameState = PLAY;

var alien, alien_running, alien_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var backgroundImg;

function preload(){
  alien_running = loadAnimation("a.png","b.png","c.png","d.png","e.png","f.png","g.png","h.png");
  alien_collided = loadAnimation("d.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("enemy1.png");
  obstacle2 = loadImage("enemy2.png");
  obstacle3 = loadImage("enemy3.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  backgroundImg = loadImage("BackImg.jpg");
}

function setup() {
  createCanvas(displayWidth-30,displayHeight-550);

  var message = "This is a message";
 console.log(message)
  
  alien = createSprite(100,160,20,50);
  alien.addAnimation("running", alien_running);
  alien.addAnimation("collided", alien_collided);
  

  alien.scale = 0.5;
  
  ground = createSprite(200,200,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(500,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(500,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  alien.setCollider("circle",0,0,40);
  alien.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  textSize(30);
  fill("yellow");
  text("Score: "+ score, 1000,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& alien.y >= 150) {
        alien.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    alien.velocityY = alien.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(alien)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      alien.changeAnimation("collided", alien_collided);
     
      ground.velocityX = 0;
      alien.velocityY = 0;
      
  if(mousePressedOver(restart)) {
      reset();
    }
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  alien.collide(invisibleGround);
  

  console.count();

  drawSprites();
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  alien.changeAnimation("running", alien_running);
  score=0;
} 


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(1500,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
      }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = alien.depth;
    alien.depth = alien.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

