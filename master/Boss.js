var Boss = function(scene){

    var charge;
    var image;
    var spriteSheet;
    var sprite;
    var echelle = 0.333;
    var frame = {
        width : 300,
        height : 300
    }

    var initialiser = function(){//cree l'image du boss
        image = new Image();
        image.onload = creerSpriteSheet;
        image.src = "illustration/boss.png";
    }

    var creerSpriteSheet = function(){//cree le spritesheet
        console.log("Boss : image charger");
        spriteSheet = new createjs.SpriteSheet({
            images : [image],
            frames : frame,
            animations: {
                default: {
                    frames: [0,1,2,1,0],
                    next: "default",
                    speed: 0.2
                }
            }
        });
        console.log("Boss : image creer");

        creerSprite();
    }

    var creerSprite = function(){//cree le sprite
        sprite = new createjs.Sprite(spriteSheet, "default");
        sprite.scaleX = echelle;
        sprite.scaleY = echelle;
        sprite.regX = sprite.regY = 150;
        sprite.x = 766;
        sprite.y = 365;
        sprite.setBounds(
            sprite.x, sprite.y,
            frame.width*echelle, frame.height*echelle);

        charge = true;
    }

//Section des access Publics --------------------------------------

    this.getRectangle = function(){//retourne le rectangle (x,y,width,height) de l'objet
        var rectangle = {
            x : (sprite.x-(150*echelle)),
            y : (sprite.y-(150*echelle)),
            width : sprite.getBounds().width,
            height : sprite.getBounds().height
        };
        return rectangle;
    }

    this.estCharge = function(){//verifie que l'image du boss est loader
        return charge;
    }

    this.afficher = function(){//ajoute le sprite du boss a la scene
        console.log("Boss -- afficher");
        scene.addChild(sprite);
    }

    initialiser();
}