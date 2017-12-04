
var wave = 1;
var heartsUnlocked = 1;
var timeLeft = 600 + (wave-1) * (120);
var enemiesLeft = 5 * wave * (heartsUnlocked / 2);
var rate = parseInt(timeLeft / enemiesLeft);

var hearts = 1;
var speed = 5;
var bulletSpeed = 15;
var enemySpeed = 2.75;

var invFrames = 0;
var breakFrames = 240;
var shootingFrames = 0;

var shotgun = 0;
var speedUp = 0;

var tut1 = true;
var tut2 = false;
var tut3 = false;
var tut4 = false;

var gameMode = false;
var endMode = false;
var pause = false;
var oneFrame = false;

var p;
var gun;
var bullets = [];
var enemies = [];
var pickups = [];

var pImage;
var gunImage;
var bulletImage;
var heartImage;
var zombieImage;
var backImage;
var soundOnImage;
var soundOffImage;
var pHeartImage;
var pShotgunImage;
var pSpeedImage;
var pNukeImage;

var pickupSound;
var shootSound;
var hurtSound;
var hitSound;
var deathSound;
var musicSound;
var nukeSound;
var soundOn = true;

var ee1 = false;
var ee2 = false;
var ee3 = false;
var ee4 = false;
var ee5 = false;
var ee6 = false;
var c = 0;

function preload() {
  pImage = loadImage("assets/player.png");
  gunImage = loadImage("assets/gun.png");
  bulletImage = loadImage("assets/bullet.png");
  heartImage = loadImage("assets/bigHeart.png");
  pHeartImage = loadImage("assets/heartPickup.png");
  pShotgunImage = loadImage("assets/shotgunPickup.png");
  pSpeedImage = loadImage("assets/speedPickup.png");
  pNukeImage = loadImage("assets/nukePickup.png");
  zombieImage = loadImage("assets/zombie.png");
  backImage = loadImage("assets/background.png");
  soundOnImage = loadImage("assets/soundOn.png");
  soundOffImage = loadImage("assets/soundOff.png");

  pickupSound = loadSound('assets/pickupSound.wav');
  pickupSound.setVolume(.25);
  shootSound = loadSound('assets/shootSound.wav');
  shootSound.setVolume(.1);
  hurtSound = loadSound('assets/hurtSound.wav');
  hurtSound.setVolume(.25);
  hitSound = loadSound('assets/hitSound.wav');
  hitSound.setVolume(.15);
  deathSound = loadSound('assets/deathSound.wav');
  deathSound.setVolume(.3);
  musicSound = loadSound('assets/music.wav');
  musicSound.setVolume(.05);
  nukeSound = loadSound('assets/nukeSound.wav');
  nukeSound.setVolume();
}

function setup() {
  createCanvas(900, 600);

  p = new Player();
  p.setLoc(createVector(width / 2, height / 2));
  gun = new Gun();

  noCursor();

  masterVolume(1);

  musicSound.loop();
}

function draw() {

  if (!pause) {
    // Draw the background
    //background(30);
    //rectMode(CENTER);
    //fill(200);
    //noStroke();
    //rect(width / 2, height / 2, width - 40, height - 40);
    
    image(backImage, 0, 0);
    if (ee6) {
      colorMode(HSB);
      fill(c++, 255, 255, .1);
      rect(width/2, height/2, width-40, height-40);
      colorMode(RGB);
      if (c > 360) c = 0;
    }
    
    if (tut1 || tut2 || tut3 || tut4) {
      fill(0, 0, 0, 150);
      noStroke();
      rect(width / 2, height/2, width, height);
      fill(255);
      textSize(70);
      textAlign(CENTER);
      if (tut1) text("Use WASD to move", width / 2, height / 2+20);
      if (tut2) text("Use Left Mouse to shoot", width / 2, height / 2+20);
      if (tut3) {
        text("You can steal some", width / 2, height / 2-20);
        text("zombie's hearts", width / 2, height / 2+60);
      }
      if (tut4) {
        text("More hearts stolen", width / 2, height / 2-50);
        text("=", width / 2, height / 2+20);
        text("More enemies", width / 2, height / 2+70);
      }
      textSize(30);
      text("ENTER", width / 2, height-30);
    } else {
      if (gameMode) {
        if (mouseIsPressed) {
          if (mouseButton == LEFT) {
            if (mouseX <= width-50 || mouseY <= height-50 || mouseX >= width-28 || mouseY >= height-28) {
              if (shootingFrames == 0) {
                shootSound.play();
                if (shotgun > 0) {
                  bullets.push(new Bullet(p.getRotation()-PI/12));
                  bullets.push(new Bullet(p.getRotation()));
                  bullets.push(new Bullet(p.getRotation()+PI/12));
                } else {
                  bullets.push(new Bullet(p.getRotation()));
                }
                shootingFrames = 12;
              } else {
                shootingFrames--;
              }
            }
          }
        }
        
        if (shotgun > 0) shotgun--;
        if (speedUp > 0) speedUp--;
        else speed = 5;

        // draw wave counter
        if (breakFrames == 0) {
          textSize(20);
          textAlign(CENTER);
          fill(0);
          text(wave, width - 40, 45);
        }

        // draw the enemies
        for (var i = enemies.length-1; i >= 0; i--) {
          enemies[i].display();
          enemies[i].update();
          if (invFrames == 0) {
            if (enemies[i].checkHit()) {
              invFrames = 20;
              hearts--;
              if (hearts == 0) {
                deathSound.play();
                endMode = true;
                gameMode = false;
                enemiesLeft = 5;
                timeLeft = 600;
                pickups = [];
                enemies = [];
                hearts = 1;
                heartsUnlocked = 1;
                bullets = [];
                invFrames = 0;
                p.setLoc(createVector(width/2, height/2));
                breakFrames = 240;
                shotgun = 0;
                speedUp = 0;
                ee1 = false;
                break;
              }
            }
          }
        }

        if (invFrames > 0) invFrames--;

        // draw the bullets
        for (var i = bullets.length-1; i >= 0; i--) {
          bullets[i].display();
          bullets[i].update();
          if (bullets[i].checkHit()) {
            bullets.splice(i, 1);
          } else {
            var loc = bullets[i].getLoc();
            if ((loc.x < 20 || loc.x > width - 20 || loc.y < 20 || loc.y > height - 20)) {
              bullets.splice(i, 1);
            }
          }
        }

        for (var i = pickups.length-1; i >= 0; i--) {
          pickups[i].display();
          if (pickups[i].checkPickup()) {
            pickups.splice(i, 1);
          }
        }

        // draw the player and the gun
        p.display();
        p.update();
        gun.display();
        gun.update();

        // draw hearts
        tint(0, 0, 0, 128);
        if (heartsUnlocked >= 1) image(heartImage, 30, 30);
        if (heartsUnlocked >= 2) image(heartImage, 60, 30);
        if (heartsUnlocked >= 3) image(heartImage, 90, 30);
        if (heartsUnlocked >= 4) image(heartImage, 120, 30);
        if (heartsUnlocked >= 5) image(heartImage, 150, 30);
        if (heartsUnlocked >= 6) image(heartImage, 180, 30);
        if (heartsUnlocked >= 7) image(heartImage, 210, 30);
        if (heartsUnlocked >= 8) image(heartImage, 240, 30);
        if (heartsUnlocked >= 9) image(heartImage, 270, 30);
        if (heartsUnlocked >= 10) image(heartImage, 300, 30);
        noTint();
        if (hearts >= 1) image(heartImage, 30, 30);
        if (hearts >= 2) image(heartImage, 60, 30);
        if (hearts >= 3) image(heartImage, 90, 30);
        if (hearts >= 4) image(heartImage, 120, 30);
        if (hearts >= 5) image(heartImage, 150, 30);
        if (hearts >= 6) image(heartImage, 180, 30);
        if (hearts >= 7) image(heartImage, 210, 30);
        if (hearts >= 8) image(heartImage, 240, 30);
        if (hearts >= 9) image(heartImage, 270, 30);
        if (hearts >= 10) image(heartImage, 300, 30);
        rectMode(CENTER);

        if (breakFrames > 0) {
          textAlign(CENTER);
          fill(0, 50);
          stroke(0, 100);
          strokeWeight(20);
          rectMode(CENTER);
          rect(width / 2, height / 2, 600, 400);
          noStroke();
          fill(0);
          textSize(300);
          text(wave, width / 2, height / 2 + 100);
          breakFrames--;
          timeLeft = 600;// + (wave-1) * (120);
          enemiesLeft = parseInt(3 * wave * heartsUnlocked);
          rate = parseInt(timeLeft / enemiesLeft);
        } else {
          if (enemiesLeft > 0) {
            if (frameCount % rate == 0) {
              if (!musicSound.isPlaying()) musicSound.play();
              var e = new Enemy();
              e.spawn();
              enemies.push(e);
              enemiesLeft--;
            }
            if (rate == 1) {
              if (!musicSound.isPlaying()) musicSound.play();
              var e = new Enemy();
              e.spawn();
              enemies.push(e);
              var e2 = new Enemey();
              e2.spawn();
              enemies.push(e);
              enemiesLeft--;
            }
          } else if (enemies.length == 0) {
            breakFrames = 240;
            wave++;
          }
        }
      } else if (endMode) {
        fill(0);
        textSize(50);
        textAlign(CENTER);
        text("You made it to round", width / 2, 150);
        textSize(150);
        text(wave, width / 2, 300);
        rectMode(CENTER);
        fill(150);
        stroke(0);
        strokeWeight(10);
        rect(width / 2, 440, 550, 180);
        noStroke();
        fill(0);
        text("RETRY", width / 2, 495);
      }

      // sound indicator
      if (soundOn) image(soundOnImage, width - 50, height - 50);
      else image(soundOffImage, width - 50, height - 50);
    }

    // mouse cursor
    rectMode(CENTER);
    fill(0);
    rect(mouseX, mouseY, 2, 10);
    rect(mouseX, mouseY, 10, 2);
  } else {
    if (!oneFrame) {
      noStroke();
      fill(255, 255, 255, 100);
      rect(width / 2, height / 2, width, height);
      fill(0);
      rect(width / 2 - 50, height / 2, 50, 125);
      rect(width / 2 + 50, height / 2, 50, 125);
      oneFrame = true;
    }
  }
  
  // easter egg
  var hCheck = false;
  var sCheck = false;
  var shCheck = false;
  var nCheck = false;
  for (var i = 0; i < pickups.length; i++) {
    if (pickups[i].getDesc() == "h") hCheck = true;
    if (pickups[i].getDesc() == "s") sCheck = true;
    if (pickups[i].getDesc() == "sh") shCheck = true;
    if (pickups[i].getDesc() == "n") nCheck = true;
  }
  if (hCheck && sCheck && shCheck && nCheck && hearts == 1) ee1 = true;
  else ee1 = false;
}

function Player() {
  var loc;
  var rotation = 0;

  this.setLoc = function(l) {
    loc = l;
  }

  this.getLoc = function() {
    return loc;
  }

  this.display = function() {
    translate(loc.x, loc.y);
    rotate(rotation);
    image(pImage, -10, -10);
    resetMatrix();
  }

  this.update = function() {
    var vel = createVector();
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      vel.x -= 1;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      vel.x += 1;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      vel.y -= 1;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      vel.y += 1;
    }
    vel.normalize();
    vel.mult(speed);
    loc.add(vel);
    if (loc.x < 30) loc.x = 30;
    if (loc.x > width - 30) loc.x = width - 30;
    if (loc.y < 30) loc.y = 30;
    if (loc.y > height - 30) loc.y = height - 30;
    var mouse = createVector(mouseX, mouseY);
    rotation = atan((mouse.y-loc.y) / (mouse.x-loc.x));
    if (mouse.x < loc.x) rotation += PI;
  }

  this.getRotation = function() {
    return rotation;
  }
}

function Gun() {
  var rotation = 0;

  this.display = function() {
    translate(p.getLoc().x, p.getLoc().y);
    //fill(20);
    //rect(10, 0, 20, 5);
    //imageMode(CENTER);
    if (rotation > PI / 2 && rotation < (3 * PI / 2)) {
      scale(-1, 1);
      rotation += PI;
      rotation = map(rotation, PI / 2, (3 * PI / 2), (3 * PI / 2), PI / 2);
    }
    rotate(rotation);
    image(gunImage, 2, 0);
    scale(1, 1);
    fill(20, 20, 20, 50);
    rect(28, 2, 5, 5);
    rect(38, 2, 5, 5);
    rect(48, 2, 5, 5);
    rect(58, 2, 5, 5);
    resetMatrix();
  }

  this.update = function() {
    rotation = p.getRotation();
  }
}

function Bullet(rotation) {
  var loc = createVector(p.getLoc().x, p.getLoc().y);

  this.display = function() {
    translate(loc.x, loc.y);
    rotate(rotation);
    image(bulletImage, 0, 0);
    resetMatrix();
  }

  this.update = function() {
    var vel = p5.Vector.fromAngle(rotation);
    vel.normalize();
    vel.mult(bulletSpeed);
    loc.add(vel);
  }

  this.checkHit = function() {
    for (var i = enemies.length-1; i >= 0; i--) {
      if (abs(loc.x - enemies[i].getLoc().x) <= 12 && abs(loc.y - enemies[i].getLoc().y) <= 12) {
        if (pickups.length <= 8) {
          if (parseInt(random(1, 15)) == 1) pickups.push(new heartPickup(enemies[i].getLoc()));
          else if (parseInt(random(1, 35)) == 1) pickups.push(new shotgunPickup(enemies[i].getLoc()));
          else if (parseInt(random(1, 35)) == 1) pickups.push(new speedPickup(enemies[i].getLoc()));
          else if (parseInt(random(1, 50)) == 1) pickups.push(new nukePickup(enemies[i].getLoc()));
        }
        enemies.splice(i, 1);
        hitSound.play();
        return true;
      }
    }
    return false;
  }

  this.getLoc = function() {
    return loc;
  }
}

function Enemy() {
  var loc;
  var n = random(0, 1000);
  var sp = randomGaussian(enemySpeed);
  sp = constrain(sp, 2, 3.5);
  var cooldown = 30;
  var rotation = 0;
  var flip = random();

  this.spawn = function() {
    var s = parseInt(random(0, 4));
    if (s == 0) loc = createVector(random(width/2-25, width/2+25), -20);
    if (s == 1) loc = createVector(random(width/2-25, width/2+25), height + 20);
    if (s == 2) loc = createVector(-20, random(height/2-25, height/2+25));
    if (s == 3) loc = createVector(width + 20, random(height/2-25, height/2+25));
  }

  this.display = function() {
    translate(loc.x, loc.y);
    if (flip > .5) {
      scale(-1, 1);
      rotation += PI;
      rotation = map(rotation, PI / 2, (3 * PI / 2), (3 * PI / 2), PI / 2);
    }
    rotate(rotation + PI);
    image(zombieImage, -10, -10);
    resetMatrix();
  }

  this.update = function() {
    if (loc.x < 30) {
      loc.x += sp;
    } else if (loc.x > width-30) {
      loc.x -= sp;
    } else if (loc.y < 30) {
      loc.y += sp;
    } else if (loc.y > height-30) {
      loc.y -= sp;
    } else {
      rotation = atan((loc.y - p.getLoc().y) / (loc.x - p.getLoc().x));
      if (loc.x < p.getLoc().x) rotation += PI;
      var vel = p5.Vector.fromAngle(rotation);
      vel.normalize();
      vel.mult(sp);
      var safeNorm = true;
      var newLoc = createVector(loc.x, loc.y);
      newLoc.sub(vel);
      for (var i = enemies.length-1; i >= 0; i--) {
        if (abs(newLoc.x - enemies[i].getLoc().x) <= 20 && loc.x != enemies[i].getLoc().x && abs(newLoc.y - enemies[i].getLoc().y) <= 20 && loc.y != enemies[i].getLoc().y) {
          //safeNorm = false; 
          var head = vel.heading();
          head += map(noise(n += .03), 0, 1, -PI/4, PI/4);
          vel = p5.Vector.fromAngle(head);
          vel.normalize();
          vel.mult(sp);
          newLoc = createVector(loc.x, loc.y);
          newLoc.sub(vel);
          if (newLoc.x < 30 || newLoc.x > width-30 || newLoc.y < 30 || newLoc.y > height-30) safeNorm = false;
        }
      }
      if (safeNorm) loc.sub(vel);
    }
  }

  this.getLoc = function() {
    return loc;
  }

  this.checkHit = function() {
    if (abs(loc.x - p.getLoc().x) <= 16 && abs(loc.y - p.getLoc().y) <= 16) {
      hurtSound.play();
      return true;
    }
    return false;
  }
}

function heartPickup(l) {
  var loc = l

    this.display = function() {
    image(pHeartImage, loc.x-5, loc.y-5);
  }

  this.checkPickup = function() {
    if (abs(loc.x - p.getLoc().x) <= 15 && abs(loc.y - p.getLoc().y) <= 15) {
      pickupSound.play();
      if (hearts < heartsUnlocked) hearts++;
      else if (heartsUnlocked <= 10) {
        heartsUnlocked++;
        hearts++;
      }
      hearts = constrain(hearts, 0, 10);
      return true;
    }
    return false;
  }
  
  this.getDesc = function() {
    return "h"; 
  }
}

function shotgunPickup(l) {
  var loc = l

    this.display = function() {
    image(pShotgunImage, loc.x-5, loc.y-5);
  }

  this.checkPickup = function() {
    if (abs(loc.x - p.getLoc().x) <= 15 && abs(loc.y - p.getLoc().y) <= 15) {
      pickupSound.play();
      shotgun = 600;
      return true;
    }
    return false;
  }
  
  this.getDesc = function() {
    return "sh"; 
  }
}

function speedPickup(l) {
  var loc = l

    this.display = function() {
    image(pSpeedImage, loc.x-5, loc.y-5);
  }

  this.checkPickup = function() {
    if (abs(loc.x - p.getLoc().x) <= 15 && abs(loc.y - p.getLoc().y) <= 15) {
      pickupSound.play();
      speedUp = 600;
      speed = 8;
      return true;
    }
    return false;
  }
  
  this.getDesc = function() {
    return "s"; 
  }
}

function nukePickup(l) {
  var loc = l

    this.display = function() {
    image(pNukeImage, loc.x-5, loc.y-5);
  }

  this.checkPickup = function() {
    if (abs(loc.x - p.getLoc().x) <= 15 && abs(loc.y - p.getLoc().y) <= 15) {
      nukeSound.play();
      musicSound.stop();
      enemiesLeft = 0;
      enemies = [];
      return true;
    }
    return false;
  }
  
  this.getDesc = function() {
    return "n"; 
  }
}

function mousePressed() {
  if (endMode) {
    if (mouseButton == LEFT) {
      if (mouseX > 225 && mouseX < 675 &&  mouseY > 350 && mouseY < 530) {
        endMode = false;
        gameMode = true;
        wave = 1;
      }
    }
  }
  if (mouseButton == LEFT) {
    if (mouseX >= width-50 && mouseY >= height-50 && mouseX <= width-28 && mouseY <= height-28) {
      soundOn = !soundOn; 
      if (soundOn) {
        masterVolume(1);
      } else {
        masterVolume(0);
      }
    }
  }
}

function mouseReleased() {
  shootingFrames = 0;
}

function keyPressed() {
  if (keyCode == 32) {
    pause = !pause;
    oneFrame = false;
    if (pause) masterVolume(0);
    if (!pause) masterVolume(.2);
  }
  if (keyCode == 13) {
    if (tut1) {
      tut1 = false;
      tut2 = true;
    } else if (tut2) {
      tut2 = false;
      tut3 = true;
    } else if (tut3) {
      tut3 = false;
      tut4 = true;
    } else if (tut4) {
      tut4 = false;
      gameMode = true;
      musicSound.setVolume(.15);
    }
  }
  
  if (ee1 && !ee2 && !ee3 && !ee4 && !ee5 && !ee6 && !pause) {
    if (keyCode == 67) {
      ee2 = true;
    }
  }
  else if (ee2 && !pause) {
    if (keyCode == 79) {
      ee3 = true;
    }
    ee2 = false;
  }
  else if (ee3 && !pause) {
    if (keyCode == 80) {
      ee4 = true;
    }
    ee2 = false;
    ee3 = false;
  }
  else if (ee4 && !pause) {
    if (keyCode == 69){
      ee5 = true;
    }
    ee2 = false;
    ee3 = false;
    ee4 = false;
  }
  else if (ee5 && !pause) {
    if (keyCode == 13) {
      ee6 = true;
    }
    ee2 = false;
    ee3 = false;
    ee4 = false;
    ee5 = false;
  }
}