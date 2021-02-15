/*
In my game, there is a tank(player) 
which is releasing bullets when the space key is pressed and 
from left-hand side some tanks are spawning which are releasing bullets 
and when the opponent bullet touches the player then the 
player’s life will deduct. And the player has 4 lives and when the life become 0 
the game will end and if the score is greater than 6000 
then the next level button will appear but if the score is less than 6000 then a restart button will appear. 
And in the next level the speed of spawning of tank and bullet 
will become high and if the score is less than 16000
then we will come back to first level and if the score is greater than 16000 then you will win this game
*/
var opponentGroup,bulletGroup; 
var live;
var playerLive=4;
var gameState="play";
var score=0;
var nextlevel;
var reset;
function preload()
{
bg=loadImage("bg.jpg")
playerimg=loadImage("player.png")
opponentimg=loadImage("opponent.png")
destroyimg=loadImage("destroy.png")
playerBulletImg=loadImage("playerbullet.png")
oppbulletimg=loadImage("opponentbullet.png")
liveimg=loadImage("lives.png")
nextlevelimg=loadImage("nextLevel.png")
resetimg=loadImage("reset.jpg")
gameOver=loadImage("win.jpg")
}

function setup() {
	createCanvas(1200,700);

	player=createSprite(1100,350,50,50)
	player.addImage(playerimg)
	player.scale=0.4;

	live1=createSprite(960,650,30,30)
	live1.addImage(liveimg)
	live1.scale=0.3;

	live2=createSprite(1030,650,30,30)
	live2.addImage(liveimg)
	live2.scale=0.3;

	live3=createSprite(1100,650,30,30)
	live3.addImage(liveimg)
	live3.scale=0.3;

	live4=createSprite(1170,650,30,30)
	live4.addImage(liveimg)
	live4.scale=0.3;

	nextlevel=createSprite(600,400,30,30)
	nextlevel.addImage(nextlevelimg);
	nextlevel.visible=false;

	reset=createSprite(600,580,80,50)
	reset.addImage(resetimg);
	reset.visible=false;
	reset.scale=0.3;

	GameOver=createSprite(600,400,30,30)
	GameOver.addImage(gameOver);
	GameOver.visible=false;

	opponentGroup=new Group();
	bulletGroup=new Group();
	opponentBulletGroup=new Group();
}


function draw() {
 background(bg)

 if(keyDown(UP_ARROW)){
	 player.y=player.y-10;
 }
 if(keyDown(DOWN_ARROW)){
	player.y=player.y+10;
}

if(keyWentDown("space")){
	releaseBullets();
}

if(player.y>680){
	player.y=680;
}
if(player.y<20){
	player.y=20;
}

for(var i=0;i<opponentGroup.length;i++){
	if(opponentGroup.get(i).isTouching(bulletGroup)){
		opponentGroup.get(i).addImage(destroyimg);
		opponentGroup.get(i).velocityX=0;
	}
}

for(var i=0;i<opponentBulletGroup.length;i++){
	if(opponentBulletGroup.get(i).isTouching(player)){
	playerLive--;
	switch(playerLive){
		case 0 : live1.visible=false;
		live2.visible=false;
		live3.visible=false;
		live4.visible=false;
		break;
		case 1 : live2.visible=false;
		live3.visible=false;
		live4.visible=false;
		break;
		case 2: live3.visible=false;
		live4.visible=false;
		break;
		case 3:live4.visible=false;
		break;
		default:break
	}
	opponentBulletGroup.get(i).destroy();
	}
}

console.log(playerLive);

if(opponentBulletGroup.isTouching(bulletGroup)){
	bulletGroup.destroyEach();
	opponentBulletGroup.destroyEach();

	}

if(bulletGroup.isTouching(opponentGroup)){
score=score+100;
bulletGroup.destroyEach();
}

if(playerLive===0 && gameState==="play"){
	gameState="end";
}

if(gameState==="play"||gameState==="restart"||gameState==="level2"){
	spawnTank();
	releaseOpponentBullets();
	score=score+Math.round(getFrameRate()/60)
	}

if(gameState==="end"){
background(0);
player.visible=false;
//opponentGroup.setVelocityXEach(0);
opponentBulletGroup.destroyEach();
opponentGroup.destroyEach();

if(score>=6000){
	nextlevel.visible=true;
}if(score<6000){
	reset.visible=true;
}

if(mousePressedOver(reset)){
	restart();
}
if(mousePressedOver(nextlevel)){
	NextLevel();
}
}

if(score>=15000 && gameState==="level2"){
	GameOver.visible=true;
	gameState="over";
}

if(gameState==="over"){
	background(0)
	player.destroy();
	opponentBulletGroup.destroyEach();
	opponentGroup.destroyEach();
	bulletGroup.destroyEach();
	live1.destroy();
	live2.destroy();
	live3.destroy();
	live4.destroy();
}

if(score<=15000 && playerLive===0 && gameState==="level2"){
	reset.visible=true;
	gameState="play"
}

textSize(30)
strokeWeight(3)
text("Your Score is: "+score,850,70)

console.log(gameState);

if(gameState==="play"){
textSize(30)
strokeWeight(3)
fill("green")
text("You are on Level 1  ",250,650)
textSize(20)
strokeWeight(3)
fill("blue")
text("Desroy the tank to get 100 points ! (Score 6000 points to go to NEXT LEVEL)",100,70)
}
if(gameState==="level2"){
	textSize(30)
	strokeWeight(3)
	fill("green")
	text("You are on Level 2  ",250,650)
	textSize(20)
	strokeWeight(3)
	fill("blue")
	text("Desroy the tank to get 100 points ! (Score 15000 points to WIN)",100,70)
	}
 drawSprites();

}


function spawnTank(){
	if(gameState==="level2"){
		var count=140;
	}else{
		var count=210
	}
	if(frameCount%count===0){
	var opponent=createSprite(50,random(50,650),20,20)
	opponent.addImage(opponentimg)
	if(gameState==="level2"){
		opponent.velocityX=5;
	}else{
		opponent.velocityX=3;
	}
	opponent.scale=0.5;
	opponent.lifetime=300;
	
	opponentGroup.add(opponent);
	}
}

function releaseBullets(){
	if(gameState==="play"||gameState==="restart"||gameState==="level2"){
	var bullet=createSprite(player.x,player.y,20,5)
	bullet.addImage(playerBulletImg)
	bullet.velocityX=-6;
	bullet.scale=0.3;
	bullet.setCollider("rectangle",0,0,20,10)
	bullet.lifetime=200;

	bulletGroup.add(bullet);
	}
}

function releaseOpponentBullets(){

	if(gameState==="level2"){
		var count2=100;
	}else{
		count2=260;
	}
		for(var i=0;i<opponentGroup.length;i++){
			if(frameCount%count2===0){
				var oppbullet=createSprite(opponentGroup.get(i).x,opponentGroup.get(i).y,20,10)
				oppbullet.addImage(oppbulletimg);
				oppbullet.velocityX=9;
				oppbullet.scale=0.2;
				oppbullet.setCollider("rectangle",0,0,20,10)
				
				opponentBulletGroup.add(oppbullet)
			}
		}
}

function restart(){
	//change
	gameState="play"
	nextlevel.visible=false;
	reset.visible=false;
	score=0;
	live1.visible=true;
	live2.visible=true;
	live3.visible=true;
	live4.visible=true;
	player.visible=true;
	playerLive=4;
}


function NextLevel(){
	gameState="level2"
	nextlevel.visible=false;
	reset.visible=false;
	score=0;
	live1.visible=true;
	live2.visible=true;
	//change
	live3.visible=true;
	live4.visible=true;
	player.visible=true;
	playerLive=4;
}