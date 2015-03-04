// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//-----------Game Variables---------
var player;
var cursors;
var playerCollisionGroup;
var isJumpCollisionGroup;
var killCollisionGroup;

//-------------OBJECTS---------------
var checkmark;
var index;

//-------------Boxes------------------
var checkCreated = 0;
var Box;
var boxX;
var boxY;
//----------Player Control Variables---
var facing = 'left';
var jumpButton;
var isDebug = false;
var ifCanJump = true;
var godmode = 0;

//----------Pause Control-----------
var paused;
var pausePanel;
var mehSpeed;

//---------Other Variables---------
var score = 0;
var scoreText;
var diamond;
var diamond2;

//----------frie-------------
var sprite;
var emitter;
var emitter2;



Game.main = function(game){
    this.music=null;
}
Game.main.prototype={
    

    preload: function () {
        this.load.audio('tutorialmusic', 'assets/Steve_Combs_22_Thank_You_Remix.mp3');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.image('fulldome', 'assets/fulldome.png');
        this.load.image('diamond','assets/diamond.png');
        this.load.image('check','assets/check.png');
        //Terrain details
        this.load.physics('physicsdata','assets/world/forest/forest.json');
        this.load.image('terr-null','assets/world/forest/terr-null.png');
        this.load.image('terr1-1','assets/world/forest/terr1-1.png');
        this.load.image('terr1-2','assets/world/forest/terr1-2.png');
        this.load.image('terr1-3','assets/world/forest/terr1-3.png');
        this.load.image('terr1-4','assets/world/forest/terr1-4.png');
        this.load.image('terr1-5','assets/world/forest/terr1-5.png');
        this.load.image('terr1-6','assets/world/forest/terr1-6.png');
        this.load.image('terr1-7','assets/world/forest/terr1-7.png');
        //UI
        this.load.image('continue','assets/UI/continue.png');
        this.load.image('help','assets/UI/help.png');
        this.load.image('pause','assets/UI/pause.png');
        this.load.image('quit','assets/UI/quit.png');
        this.load.image('restart','assets/UI/restart.png');
        this.load.image('helpscn','assets/UI/helpscreen.png');

        //fire
        this.load.image('fire1', 'assets/fire/fire1.png');
        this.load.image('fire2', 'assets/fire/fire2.png');
        this.load.image('fire3', 'assets/fire/fire3.png');
        this.load.image('smoke', 'assets/fire/smoke-puff.png');

        this.load.spritesheet('ball', 'assets/fire/plasmaball.png', 128, 128);

    },

    createBox: function(x, y, index, playerCollisionGroup, isJumpCollisionGroup ){
        boxX = x;
        boxY = y;
        Box = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(Box);
        Box.body.friction = 100;
        Box.body.restitution = 0.0;
        Box.body.gravity = 500;
        Box.body.static = false;
        Box.body.fixedRotation = true;
        Box.body.setCollisionGroup(isJumpCollisionGroup);
        Box.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

    },

    terraincreator: function(image,x,y,playerCollisionGroup,isJumpCollisionGroup,realTerrain){
        var terrain = this.add.sprite(x, y,image); //creates the sprite
        this.physics.p2.enableBody(terrain,isDebug);    //enables physics on it
        terrain.body.clearShapes();
        if(realTerrain){
            terrain.body.loadPolygon('physicsdata',image);
            //1.Tells the ground to be part of the jumpable collision group
            //2.This effectively tells it that it collides with these collision groups.
            terrain.body.setCollisionGroup(isJumpCollisionGroup);
            terrain.body.collides([isJumpCollisionGroup, playerCollisionGroup]);
        }
        terrain.body.static = true;                  //disables gravity for itself...
        terrain.body.fixedRotation = true;           //fixes rotation?
    },

    create: function() {
        //adds music
        this.music = this.add.audio('tutorialmusic');
        this.music.play();

        //changes bounds of the world and add a background for the world
        this.world.setBounds(0,0,10000,2800);
        this.stage.backgroundColor = '#d0f4f7';

        //  We're going to be using physics, so enable the P2 Physics system
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 500;
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.restitution = 0.0;

        //COLLISION GROUPS -- VERY IMPORTANT (Helps keep track of which platforms the player can jump on...)
        playerCollisionGroup = this.physics.p2.createCollisionGroup();
        isJumpCollisionGroup = this.physics.p2.createCollisionGroup();
        killCollisionGroup = this.physics.p2.createCollisionGroup();

        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.physics.p2.updateBoundsCollisionGroup();

        this.terraincreator('terr1-1',400,1600,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',400,2200,playerCollisionGroup,isJumpCollisionGroup,false);
        this.terraincreator('terr1-2',1200,1300,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',1200,1900,playerCollisionGroup,isJumpCollisionGroup,false);
        this.terraincreator('terr1-3',2000,1527,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',2000,2057,playerCollisionGroup,isJumpCollisionGroup,false);
        this.terraincreator('terr1-4',2800,1595,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',2800,2195,playerCollisionGroup,isJumpCollisionGroup,false);
        this.terraincreator('terr1-5',4000,1527,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',4000,2127,playerCollisionGroup,isJumpCollisionGroup,false);
        this.terraincreator('terr1-6',4800,1350,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',4800,1950,playerCollisionGroup,isJumpCollisionGroup,false);
        this.terraincreator('terr1-7',5600,1470,playerCollisionGroup,isJumpCollisionGroup,true);
        this.terraincreator('terr-null',5600,2070,playerCollisionGroup,isJumpCollisionGroup,false);

        //Add a forsure kill player object
        diamond = this.add.sprite(300, 1600-175, 'diamond');
        this.physics.p2.enableBody(diamond,isDebug);
        diamond.body.static = true;
        diamond.body.fixedRotation = true;
        diamond.body.setCollisionGroup(killCollisionGroup);
        diamond.body.collides([playerCollisionGroup]);

        //create a moveable Boxs
        this.createBox(100, 1700, 'diamond',playerCollisionGroup, isJumpCollisionGroup);

        //TESING purposes -- added a checkmark for lols
        checkmark = this.add.sprite(400,128,'check');
        this.physics.p2.enableBody(checkmark,isDebug);
        checkmark.body.clearShapes();
        checkmark.body.loadPolygon('physicsdata','check');
        checkmark.body.setCollisionGroup(isJumpCollisionGroup);
        checkmark.body.collides([isJumpCollisionGroup, playerCollisionGroup]);
        
        // The player aanimations and position
        player = this.add.sprite(32, 1600 - 150, 'dude');
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.physics.p2.enable(player);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(killCollisionGroup, this.endGame, this)

        //sets camera to follow
        this.camera.follow(player);

        //Sets the jump button to up
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.UP);

        pushButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  The score
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        //  Our controls.(left/up/down/right)
        cursors = this.input.keyboard.createCursorKeys();
        
        //pause menu
        this.btnPause = this.game.add.button(675,20,'pause',this.pauseGame,this);

        //Build the Pause Panel
        this.pausePanel = new PausePanel(this.game);
        this.game.add.existing(this.pausePanel);

        //Enter Play Mode
        mehSpeed = new Array();
        this.playGame();

        //fire
        //this.physics.startSystem(Phaser.Physics.ARCADE);
        emitter = this.add.emitter(this.world.centerX, this.world.centerY, 300);
        //emitter = this.add.emitter(500, 300, 300);

        emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
        emitter.gravity = 340;
        emitter.setAlpha(1, 0, 3000);
        emitter.setScale(0.5, 0, 0.5, 0, 3000);

        emitter.start(false, 3000, 5);

        sprite = this.add.sprite(500, 100, 'ball', 0);
        //sprite = this.add.sprite(900, 200, 'ball', 0);
        this.physics.arcade.enable(sprite);
        //sprite.body.setSize(5, 5, 0, 0);

        //fire 2
        emitter2 = this.add.emitter(this.world.centerX, this.world.centerY, 300);
        //emitter = this.add.emitter(500, 300, 300);

        emitter2.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
        emitter2.gravity = -30;
        emitter2.setAlpha(1, 0, 2000);
        emitter2.setScale(0.3, 0.3, 0.3, 0, 3000);

        emitter2.start(false, 3000, 5);
       
    },

    pauseGame: function(){
        if(!paused){
            paused = true;
            this.pausePanel.show();
            this.physics.p2.gravity.y = 0;
            
            //add any object that is affected by gravity here.
            mehSpeed.push(checkmark.body.velocity.x);
            mehSpeed.push(checkmark.body.velocity.y);
            
            //Set the vbelocities to zero to make sure they dont move anymore.
            checkmark.body.velocity.x = 0;
            checkmark.body.velocity.y = 0;
            
            //fix the objects from rotating and make them static
            checkmark.body.fixedRotation = true;
        }
    },

    playGame: function(){
        if(paused){
            paused = false;
            this.pausePanel.hide();
            this.physics.p2.gravity.y = 500;
            
            //Push out velocties affected by gravity for objects here.
            checkmark.body.velocity.y = mehSpeed.pop();
            checkmark.body.velocity.x = mehSpeed.pop();
            
            //allow for totations and disable static.
            checkmark.body.fixedRotation = false;
        }
    },


    update: function() {

        //console.log("x:"+this.camera.x);
        //console.log("y:"+this.camera.y);

        //  To move the UI along with the camera 
        scoreText.x = this.camera.x+16;
        scoreText.y = this.camera.y+16;
        this.btnPause.x = this.camera.x+675;
        this.btnPause.y = this.camera.y+20;
        this.pausePanel.x = this.camera.x+655;
        if(!paused){
                this.pausePanel.y = this.camera.y-100;
                this.pausePanel.update();
        }


        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if(paused)
            player.body.velocity.y = 0;

        //Control Player Movement;
        if (!paused){
            if (cursors.left.isDown)
            {
                player.body.moveLeft(200+godmode);

                if (facing != 'left')
                {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(200+godmode);

                if (facing != 'right')
                {
                    player.animations.play('right');
                    facing = 'right';
                }
            }
            else if(ifCanJump)
            {
                player.body.velocity.x = 0;

                if (facing != 'idle')
                {
                    player.animations.stop();

                    if (facing == 'left')
                    {
                        player.frame = 0;
                    }
                    else
                    {
                        player.frame = 5;
                    }

                    facing = 'idle';
                }
            }

            if (jumpButton.isDown && ifCanJump){
                player.body.moveUp(300+godmode);
                ifCanJump = false;
            }
            // moving a Box-----------------------------
            if ((pushButton.isDown && cursors.left.isDown) || (pushButton.isDown && cursors.right.isDown)) {
                if (checkCreated < 1){
                    Box.body.destroy();
                    Box.kill();
                    this.createBox(boxX, boxY, 'diamond',playerCollisionGroup, isJumpCollisionGroup);
                    checkCreated++;
                }
            }else if (pushButton.isUp){
                Box.body.static = true;
                boxX = Box.body.x;
                boxY = Box.body.y;
                checkCreated =0;
            }

        }
        //console.log("y=",player.body.y);
        //console.log("x=",player.body.x);
        if (player.body.y >= this.world.height-32){
            this.endGame();
        }


        //fire---------------------------
        var px = 0;
        var py = 0;

        px *= -1;
        py *= -1;

        emitter.minParticleSpeed.set(px, py);
        emitter.maxParticleSpeed.set(px, py);

        emitter.emitX = sprite.x;
        emitter.emitY = sprite.y+58;

        //fire2---------------------------
        var px2 = 200;
        var py2 = 0;

        px2 *= -1;
        py2 *= -1;

        emitter2.minParticleSpeed.set(px2, py2);
        emitter2.maxParticleSpeed.set(px2, py2);

        emitter2.emitX = 400;
        emitter2.emitY = 1600;

        // emitter.forEachExists(game.world.wrap, game.world);
        //this.world.wrap(sprite, 64);
        //console.log(px);
        if (player.body.x >= 232 && player.body.x <= 431 
                     && player.body.y <= 440 && player.body.y >= 434){
            this.endGame();
        }
    },


// correct the endGame function
    endGame: function(){
        score = 0;
        this.music.stop();
        this.state.start('gameover');
    },

};

var PausePanel = function(game, parent){
    //Super call to Phaser.group
    Phaser.Group.call(this, game, parent);

    this.btnPlay = this.game.add.button(20,20,'continue',function(){
        this.game.state.getCurrentState().playGame()
    },this);
    this.add(this.btnPlay);

    //place it out of bounds
    this.x = 655;
    this.y = -100;
    
    btnRestart = this.game.add.button(350,-225,'restart',function(){
        this.game.state.restart(true,true);
    },this);

    btnHelpScreen = this.game.add.button(150,-500,'helpscn',function(){
        this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-600}, 200, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnRestart).to({y:this.game.camera.y+175}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(btnHelp).to({y:this.game.camera.y+250}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(btnQuit).to({y:this.game.camera.y+325}, 500, Phaser.Easing.Bounce.Out, true);
    },this);

    btnHelp = this.game.add.button(350,-150,'help',function(){
        this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y+50}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 200, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 200, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 200, Phaser.Easing.Linear.NONE, true);
    },this);

    btnQuit = this.game.add.button(350,-75,'quit',function(){
        this.game.state.start('mainmenu');
    },this);
};

PausePanel.prototype = Object.create(Phaser.Group.prototype);
PausePanel.constructor = PausePanel;

PausePanel.prototype.show = function(){
    this.game.add.tween(this).to({y:this.game.camera.y+0}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnRestart).to({y:this.game.camera.y+175}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnHelp).to({y:this.game.camera.y+250}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnQuit).to({y:this.game.camera.y+325}, 500, Phaser.Easing.Bounce.Out, true);
};
PausePanel.prototype.update = function(){
    if(!paused){
        this.game.add.tween(btnRestart).to({x:this.game.camera.x+350}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({x:this.game.camera.x+350}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({x:this.game.camera.x+350}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelpScreen).to({x:this.game.camera.x+150}, 1, Phaser.Easing.Linear.NONE, true);
        //for Y-axis
        this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-600}, 1, Phaser.Easing.Linear.NONE, true);
    }
}

PausePanel.prototype.hide = function(){
    this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-500}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this).to({y:this.game.camera.y-100}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 200, Phaser.Easing.Linear.NONE, true);
};

