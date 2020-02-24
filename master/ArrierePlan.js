var ArrierePlan = function(scene){

    //Eau
    var imageEau;
    var spriteEauSheet;
    var spriteEau;
    var eauCharge;
    var frame = {
        width : 560,
        height : 315
    }


    //Mare
    var imageMare;
    var bitmapMare;
    var MareCharge;
    var DelaisAnimationMs = 2;//TODO augmenter
    var DerniereAnimation = 0;


    //Sol
    var imageSol;
    var bitmapSol;
    var solCharge;


    var initialiser = function(){//cree les image de l'eau, le sol et la mare
        //creation
        imageEau = new Image();
        imageMare = new Image();
        imageSol = new Image();

        //Abonnement au Events
        imageEau.onload = creerSpriteSheetEau;
        imageMare.onload = creerBitmapMare;
        imageSol.onload = creerBitmapSol;

        //Defenir la source des images
        imageEau.src = "illustration/watersheet.png";
        imageMare.src = "illustration/mareNoir.png";
        imageSol.src = "illustration/back.png";

        //charge a faux
        eauCharge = false;
        MareCharge = false;
        solCharge = false;
    }

    var creerSpriteSheetEau = function(){//cree le spritesheet
        console.log("eau : image charger");
        spriteEauSheet = new createjs.SpriteSheet(
		{
            images : [imageEau],
            frames : frame,
            animations: {
                default: [0,15,"default",0.05]
            }
        }
		);
        console.log("eau : image creer");

        creerSpriteEau();
    }

    var creerSpriteEau = function(){//cree le sprite pour l'eau
    console.log("Mare -- creerSprite");
        spriteEau = new createjs.Sprite(spriteEauSheet, "default");
        spriteEau.scaleX = spriteEau.scaleY = 2.8;
        eauCharge = true;
    }

    var creerBitmapMare = function(){//cree le bitmap pour la Mare
        console.log("Mare -- creerBitmap");
        bitmapMare = new createjs.Bitmap(imageMare);
        bitmapMare.regX = bitmapMare.regY = 25;
        bitmapMare.x = 766;
        bitmapMare.y = 365;
        bitmapMare.scaleX = 3.15;// valeur de (31) pour faire 100% du canvas en X
        bitmapMare.scaleY = 2;// valeur de (15) pour faire 100% du canvas en Y
        marecharge = true;
    }
    
    var creerBitmapSol = function(){//cree le bitmap pour le sol
        console.log("Sol -- creerBitmap");
        bitmapSol = new createjs.Bitmap(imageSol);
        bitmapSol.y = -10;
        bitmapSol.x = -15;
        solCharge = true;
    }


//Section des access Publics --------------------------------------

    this.estCharge = function(){//verifie que l'image du sol, l'eau et la Mare sont loader
        return solCharge && eauCharge && marecharge;
    }

    this.afficher = function(){//ajoute l'eau, le sol et la mare a la scene
        console.log("arrierePlan -- afficher");
        scene.addChild(spriteEau);
        scene.addChild(bitmapMare);
        scene.addChild(bitmapSol);
    }

    this.animer = function(){//deplace la mare selon le temps passer et le delais
        var time = (new Date()).getTime();
        if (time - DerniereAnimation >= DelaisAnimationMs){
            if (bitmapMare.scaleY < 15){
                bitmapMare.scaleY += 0.05;
            } else if (bitmapMare.scaleX < 31){
                bitmapMare.scaleX += 0.05;
            }
            DerniereAnimation = time;
        }
    }

    this.tempsEstEcoule = function(){//Game over, la mare a remplis le canvas
        return (bitmapMare.scaleX >= 31);
    }

    initialiser();
}