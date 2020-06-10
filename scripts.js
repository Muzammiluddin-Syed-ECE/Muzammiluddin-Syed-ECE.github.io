var myGamePiece = [];
var myInfectedLine;
var myDeathLine;
var myUntouchedLine;

var positionx = [];
var positiony = [];
var numPieces = 800; 
var numInfected = 1;
var numUntouched = numPieces -1;
var numDead = 0;
var numUpdated = 0;
    //function that starts game
function startGame() {
    var count;
    for (count = 0; count < numPieces; count++) {
        myGamePiece[count] = new Component( 15, 15, "#808080", (count%32) * 32, (Math.floor(count/32) * 32)%1000, count);
    }
    myInfectedLine = new Linecomponent("red", 1, myGraphArea.canvas.height, 0);
    myDeathLine = new Linecomponent("black", 1, myGraphArea.canvas.height, 1);
    myUntouchedLine = new Linecomponent("#808080", 1, myGraphArea.canvas.height - numPieces, 2);
    myGamePiece[0].x = 20;
    myGamePiece[0].y = 100;
    myGamePiece[1].x = 200;
    myGamePiece[1].y = 100;
    myGamePiece[0].color = "#000000";
    myGamePiece[0].speedX = 1;
    myGamePiece[0].speedY =  -1;
    myGamePiece[1].speedX =  -1;
    myGamePiece[1].speedY =  -1;
    myGamePiece[0].infected = true;
    
    myGameArea.start();
    myGraphArea.start();
            //set up the pieces
                //call intitiating animaltion functions
}
    
var myGameArea = {
    canvas : document.getElementById("myAnimation"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 25);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

var myGraphArea = {
    canvas: document.getElementById("myGraph"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGraphArea, 25);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Linecomponent(color, x, y, mode) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.mode = mode;
    this.update = function() {
        let ctx = myGraphArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 5, 5);
        
    };
    this.newPos = function() {
        document.getElementById("test").innerHTML = "halfway - 2";
        numUpdated++;
        
        this.x = this.x+0.4;
        if (this.mode === 0) {
            this.y = myGraphArea.canvas.height - 5 - numInfected * 1.2;
        }
        if (this.mode === 1) {
            this.y = myGraphArea.canvas.height - 5 - numDead * 1.2;
        }
        if (this.mode === 2) {
            this.y = (myGraphArea.canvas.height - numPieces) + (numPieces - numUntouched);
        }
        console.log(this.x);
        document.getElementById("test").innerHTML = "halfway - 3";
    }
}
function Component(width, height, color, x, y, id) {
    this.width = width;
    this.height = height;
    this.speedX = 0.5 - (Math.random() * 1);
    this.speedY = 0.5 - (Math.random() * 1);
    this.x = x;
    this.y = y;
    this.id = id;
    this.color = color;
    this.infected = false;
    this.immune = false;
    this.dead = false;
    this.chanceOfInfection = 0.80;
    this.chanceOfCure = 0.00178;
    this.chanceOfDeath = 0.00178;
    this.deathTimer = 0;

    this.update = function() {
        if( Math.random() < this.chanceOfCure && this.infected) {
            this.cure();
            this.immune = true;
        }
        if(this.infected) {
            this.deathTimer += 25;
        }
        if( Math.random() < this.chanceOfDeath && this.deathTimer > 14000 && this.infected && !this.dead) {
            this.death();
        }
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    };
    this.wallCollision = function() {
        let col = true;
        if ((this.x >= (myGameArea.canvas.width - this.width)) && this.speedX > 0) {
            this.speedX =  -1 * this.speedX;
            
        }
        if (this.y >= (myGameArea.canvas.height - this.height) && this.speedY > 0) {
            this.speedY =  -1 * this.speedY;
        }
        if (this.x <= 0 && this.speedX < 0) {
            this.speedX =  -1 * this.speedX;
        }
        if (this.y <= 0 && this.speedY < 0) {
            this.speedY =  -1 * this.speedY;
        }
    };
    this.blockCollision = function() {
        for (let count = 0; count<numPieces; count++) {
            if (count != this.id && !myGamePiece[count].dead) {
                if((Math.abs(this.x - myGamePiece[count].x)<= this.width) && (Math.abs(this.y - myGamePiece[count].y)) <= this.height) {
                    let colliding = false;
                    let colPiece = myGamePiece[count];
                    let vCollision = {x: colPiece.x - this.x, y: colPiece.y - this.y};
                    let distance = Math.sqrt((colPiece.x - this.x) * (colPiece.x - this.x) + (colPiece.y - this.y) * (colPiece.y - this.y));
                    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                    let vRelativeVelocity = {x: this.speedX - colPiece.speedX, y: this.speedY - colPiece.speedY};
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                    
                    if (speed > 0) {
                    
                    
                        this.speedX  -= (speed * vCollisionNorm.x);
                        this.speedY  -= (speed * vCollisionNorm.y);
                        colPiece.speedX += (speed * vCollisionNorm.x);
                        colPiece.speedY += (speed * vCollisionNorm.y);

                        colPiece.wallCollision();
                        this.wallCollision();
                    }
                    if (this.infected || colPiece.infected) {
                        this.infect();
                        colPiece.infect();
                    }


                    this.collision = false;
                    colPiece.collision = false;

                   
                }
            }
        }
    };
    this.infect = function() {
        if (Math.random() < this.chanceOfInfection && !this.infected && !this.immune) {
            this.infected = true;
            numInfected++;
            document.getElementById("numberOfInfected").innerHTML = numInfected.toString();
            this.color = "#000000";
            numUntouched-- ;
        }
        
    };
    this.cure = function() {
        this.infected = false;
        numInfected --;
        document.getElementById("numberOfInfected").innerHTML = numInfected.toString();
        this.color = "Green";
    };
    this.death = function() {
        this.dead = true;
        this.color = "red";
        numDead++;
        numInfected --;
        this.infected = false;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
    };

    this.attemptMove = function() {
        for (let count = 0; count<numPieces; count++) {
            if (count != this.id) {
                if((Math.abs((this.x + this.speedX) - myGamePiece[count].x)< 30) && (Math.abs((this.y+ this.speedY) - myGamePiece[count].y)< 30)) {
                    return false;
                }
            }
        }
        return true;
    };
    this.newPos = function() {
        
        //this.wallCollision();
        this.blockCollision();
        //if (!(this.wallCollision()) && this.attemptMove()) {
        this.wallCollision();
        this.x += this.speedX;
        this.y += this.speedY;
        //}
    
    };
}

//updating board
function updateGameArea() {
    myGameArea.clear();
    let count;
    for (count = 0; count < numPieces; count++) {
        myGamePiece[count].newPos();
        
    }
    for (count = 0; count < numPieces; count++) {
        myGamePiece[count].update();
    }
}

function updateGraphArea() {
    document.getElementById("test").innerHTML = "halfway";
    myInfectedLine.newPos();
    myInfectedLine.update();
    myDeathLine.newPos();
    myDeathLine.update();
    myUntouchedLine.newPos();
    myUntouchedLine.update();
}