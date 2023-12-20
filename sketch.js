var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var gameover , restart , gameoverImage , restartImage

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameState="play"
var invisibleSky;
var dieSound;
var checkpointSound;
var jumpSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  gameoverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  dieSound=loadSound("die.mp3")
  checkpointSound=loadSound("checkpoint.mp3")
  jumpSound=loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.debug=false
  trex.setCollider("circle",0,0,40)
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  invisibleSky = createSprite(200,50,400,10);
  invisibleSky.visible = false;
  gameOver=createSprite(300,100,10,10)
  gameOver.addImage("gameover",gameoverImage)
  gameOver.scale=1
  restart=createSprite(300,150,10,10)
  restart.addImage("restart",restartImage)
  restart.scale=0.5
  obstaclesGroup=createGroup()
  cloudsGroup=createGroup()
  
  
  score = 0;
}

function draw() {
  background("white");
  text("Score: "+ score, 500,50);
  score = score + Math.round(frameCount/60);

  if(gameState=="play"){
    if(keyDown("space")&& trex.y >= 100) {
      jumpSound.play()
      trex.velocityY = -13;
      console.log("jump")
    
    }

  ground.velocityX=-(4+2*score/100)
    gameOver.visible=false
    restart.visible=false
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    //creating the end game
  if(obstaclesGroup.isTouching(trex)){
    console.log("END")

   gameState="end" 
  }
    //spawn the clouds
  spawnClouds();
  
  //spawn obstacles on the ground
  spawnObstacles();
  }
  else if(gameState=="end"){
    trex.changeImage("collided")
    trex.velocityY=0
    ground.velocityX=0
    score=0
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    gameOver.visible=true
    restart.visible=true
    if(mousePressedOver(restart)){
      console.log("restart")
      resetGame()
    }
  }
  trex.collide(invisibleGround);
  trex.collide(invisibleSky)
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6;

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    obstaclesGroup.add(obstacle)
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 100;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud)
  }
 
  


}

function resetGame(){
  gameState="play";
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running",trex_running)
  gameOver.visible=false;
  restart.visible=false;
}