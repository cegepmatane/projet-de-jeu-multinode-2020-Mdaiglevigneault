var Mur = function(scene, index){

    var charge;
    var image;
    var spriteSheet;
    var sprite;
    var echelle = {x:1.5,y:5};
    var frame = {
        width : 50,
        height : 50
    }

    var initialiser = function(){//cree l'image du mur
        image = new Image();
        image.onload = creerSpriteSheet;
        image.src = "illustration/forcefield.png";
    }

    var creerSpriteSheet = function(){//cree le spritesheet
        console.log("Mur : image charger");
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
        console.log("Mur : image creer");

        creerSprite();
    }

    var creerSprite = function(){//cree le sprite
        sprite = new createjs.Sprite(spriteSheet, "default");
        sprite.scaleX = echelle.x;
        sprite.scaleY = echelle.y;
        sprite.regX = sprite.regY = 25;
        if (index == 1){
            sprite.x = 729;
        } else {
            sprite.x = 804;
        }
        
        sprite.y = 365;
        sprite.setBounds(
            sprite.x, sprite.y,
            frame.width*echelle.x, frame.height*echelle.y);
        
        console.log("Mur : sprite creer");
        charge = true;
    }


//Section des access Publics --------------------------------------

    this.detruire = function(){//deplace le mur hors du jeu
        sprite.x = sprite.y = -3300;
    }

    this.getRectangle = function(){//retourne le rectangle (x,y,width,height) de l'objet
        var rectangle = {
            x : (sprite.x-(25*echelle.x)),
            y : (sprite.y-(25*echelle.y)),
            width : sprite.getBounds().width,
            height : sprite.getBounds().height
        };
        return rectangle;
    }

    this.estCharge = function(){//verifie que l'image du mur est loader
        return charge;
    }

    this.afficher = function(){//ajoute le mur a la scene
        console.log("Mur -- afficher");
        scene.addChild(sprite);
    }

    initialiser();
}