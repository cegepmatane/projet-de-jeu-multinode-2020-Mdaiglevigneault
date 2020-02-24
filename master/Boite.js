var Boite = function(scene, position){

    var imageBoite;
    var spriteSheet;
    var spriteBoite;
    var charge;
    var echelle = 0.3;
    var frame = {
        width : 251,
        height : 251
    }
    var vie = 5;

    var initialiser = function(){//cree l'image
	    imageBoite =  new Image();
        imageBoite.onload = creerSpriteSheet;
        imageBoite.src = "illustration/boxsheet.png";
        charge = false;
    }

    var creerSpriteSheet = function(evenementOnload){//cree spritesheet
        console.log("Boite : image charger");
        spriteSheet = new createjs.SpriteSheet({
            images : [imageBoite],
            frames : frame,
            animations: {
                default: {
                    frames: [0,1,2,3,2,1,0],
                    next: "default",
                    speed: 0.25
                }
            }
        });
        console.log("Boite : image creer");
        creerSprite();
    }

    var creerSprite = function(){//cree sprite
        spriteBoite = new createjs.Sprite(spriteSheet, "default");
        spriteBoite.scaleX = spriteBoite.scaleY = echelle;
        spriteBoite.x = position.x; spriteBoite.y = position.y;
        spriteBoite.setBounds(
            spriteBoite.x, spriteBoite.y,
            frame.width*echelle, frame.height*echelle);
        console.log("Boite : sprite creer");

        charge = true;
    }


//Section des access Publics --------------------------------------

    this.getVie = function(){//retoutne la valeur de vie
        return vie;
    }

    this.toucher = function(){//reduis la vie est retourne true si la boite est "morte"
        console.log("Boite toucher!!");
        vie--;
        if (vie <= 0){
            spriteBoite.x = spriteBoite.y = -3050;
            return true;
        } else {
            return false;
        }
    }

    this.getRectangle = function(){//retourne le rectangle (x,y,width,height) de l'objet
        var rectangle = {
            x : spriteBoite.x,
            y : spriteBoite.y,
            width : spriteBoite.getBounds().width,
            height : spriteBoite.getBounds().height
        };
        return rectangle;
    }

    this.afficher = function(){//ajoute le sprite a la scene
        scene.addChild(spriteBoite);
        console.log("Boite : sprite afficher");
    }

    this.estCharge = function(){//verifie que l'image est loader
        return charge;
    }

    initialiser();
}