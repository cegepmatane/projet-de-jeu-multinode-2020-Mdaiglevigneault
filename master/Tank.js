var Tank = function(scene, numeroJoueur){

    var imageTank;
    var spriteSheet;
    var spriteTank;
    var charge;
    var frame = {
        width : 338,
        height : 265
    };
    var echelle = 0.3;

    //parametre de controle pour le joueur
    var dernierEmplacement;
    var nombreBalles = 30;
    var ballesUtilise = [];
    var ballesDispo = [];
    var vitesse = 5;
    var velociteX;
    var velociteY;
    var deltaAngle = 0.03;
    var angle;
    var tempsDernierTir = 0;
    var delaisTirMilisecondes = 100;

    var initialiser = function(){//cree l'image du tank et cree des balles
        if (numeroJoueur == 1){
            dernierEmplacement = {x:100,y:365}
            angle = 0;
        } else if (numeroJoueur == 2){
            dernierEmplacement = {x:1400,y:366}
            angle = 3.14;
        }

        createjs.Sound.registerSound("sons/zapsplat_warfare_bullet_pass_by_001_43604.mp3", "shoot");

	    imageTank =  new Image();
        imageTank.onload = creerSpriteSheet;
        imageTank.src = "illustration/tanksheet.png";
        charge = false;
        creerBalles();
    }

    var creerSpriteSheet = function(evenementOnload){//cree la spritesheet
        console.log("Tank : image charger");
        spriteSheet = new createjs.SpriteSheet(
		{
            images : [imageTank],
            frames : frame,
            animations: {
                tir: [1,3,"immobile",0.3],
				avancer: [0,1,"avancer",0.3],
				immobile: [0]
            }
        }
		);
        console.log("Tank : image creer");
        creerSprite();
    }

    var creerSprite = function(){//cree le sprite
        spriteTank = new createjs.Sprite(spriteSheet, "immobile");
        spriteTank.scaleX = spriteTank.scaleY = echelle;
        spriteTank.regX = frame.width/2;
        spriteTank.regY = frame.height/2;
        retournerEnArriere();
        spriteTank.setBounds(
            spriteTank.x, spriteTank.y,
            frame.width*echelle, frame.height*echelle);
        spriteTank.rotation = angle*180/Math.PI;
        charge = true;
    }

    var verifierLimiteDeJeu = function(){//verifie et s'assure que le tank ne sort pas de la zone de jeu
        if (numeroJoueur == 1 && (spriteTank.x <= 44 || spriteTank.x >= 635 || spriteTank.y <= 104 || spriteTank.y >= 639)){
            retournerEnArriere();
        }
        if ((numeroJoueur == 2 && (spriteTank.x <= 900 || spriteTank.x >= 1490 || spriteTank.y <= 104 || spriteTank.y >= 639))){
            retournerEnArriere();
        }
    }

    var gererAnimation = function(){//lance l'animation avancer si le joeur n'avance pas ou ne tir pas
        if (spriteTank.currentAnimation != "avancer" && spriteTank.currentAnimation != "tir")
            spriteTank.gotoAndPlay("avancer");
    }

    var retournerEnArriere = function(){//deplace le tank a sa derniere position connue
        spriteTank.x = dernierEmplacement.x;
        spriteTank.y = dernierEmplacement.y;
    }


//section Controlle des Balles --------------------------------------

    var verifierBallesCharger = function(){//verifie que les images de balles sont loader
        var nbPasCharge = 0;
        ballesDispo.forEach((item)=>{
            if (!item.estCharge()){
                nbPasCharge++;
            }
        });
        console.log(nbPasCharge);
        if (nbPasCharge == 0)
            return true;
        else
            return false;
    }

    var afficherBalles = function(){//ajoute toute le balles a la scene
        ballesDispo.forEach((item)=>{
            item.afficher();
        });
        console.log("Balles affichees!!!");
    }

    var getballeDispo = function(){//retourne une balle disponible si il y a lieu
        var i = 0;
        while (ballesDispo[i] == null && i < ballesDispo.length) {i++}
        if (ballesDispo[i] != null){
            ballesUtilise[i] = ballesDispo[i];
            ballesDispo[i] = null; 
            return ballesUtilise[i];
        } else {
            return null;
        }
    }

    var changerBalleDispo = function(id){//rend une balle disponible
        console.log("Balle MISE DISPO!!!");
        ballesDispo[id] = ballesUtilise[id];
        ballesUtilise[id] = null; 
    }

    var creerBalles = function(){//cree toute les balles
        for (var i = 0; i < nombreBalles; i++){
            ballesDispo[i] = new Balle(scene, changerBalleDispo, i);
        }
    }


//Section des access Publics --------------------------------------

    this.getRectangle = function(){//retourne le rectangle (x,y,width,height) de l'objet
        var rectangle = {
            x : spriteTank.x,
            y : spriteTank.y,
            width : spriteTank.getBounds().width*echelle,
            height : spriteTank.getBounds().height*echelle

        };
        return rectangle;
    }

    this.estCharge = function(){//verifie que l'image de tank est loader et celle des balles aussis
        return charge && verifierBallesCharger();
    }

    this.afficher = function(){//ajouter le tank et les balles dans la scene
        scene.addChild(spriteTank);
        afficherBalles();
        console.log("Tank : sprite afficher");
    }

    this.avancer = function(){//deplace la tank ver l'avant selon l'angle actuel
		velociteX = vitesse * Math.cos(angle);
		velociteY = vitesse * Math.sin(angle);
        
        dernierEmplacement.x = spriteTank.x; dernierEmplacement.y = spriteTank.y;

		spriteTank.x += velociteX;
        spriteTank.y += velociteY;
        verifierLimiteDeJeu();
        gererAnimation();
    }

    this.reculer = function(){//deplace la tank ver l'arriere selon l'angle actuel
		velociteX = vitesse * Math.cos(angle);
        velociteY = vitesse * Math.sin(angle);
        
        dernierEmplacement.x = spriteTank.x; dernierEmplacement.y = spriteTank.y;
        
		spriteTank.x -= velociteX;
        spriteTank.y -= velociteY;
        
        verifierLimiteDeJeu();
        gererAnimation();
    }

    this.tourner = function(direction){//modifie l'angle du tank selon le sens desiree
        if(direction == "G"){
            angle -= deltaAngle;
			if(angle < 0)
				angle += 2*Math.PI;
        }
        if(direction == "D"){
            angle += deltaAngle;
			if(angle > 2*Math.PI)
				angle -= 2*Math.PI;
        }

        gererAnimation();
        spriteTank.rotation = angle*180/Math.PI;
    }

    this.annulerMouvement = function(){//deplace le tank a sa derniere position connue
        retournerEnArriere();
    }

    this.arreter = function(){//affiche l'animation immobile si pas immobile
        if (spriteTank.currentAnimation != "immobile")
            spriteTank.gotoAndPlay("immobile");
    }

    this.Tirer = function(evenement){//envoie un projectile si le delais est respectee
        var tempsActuel = (new Date()).getTime();
        if (tempsActuel - tempsDernierTir >= delaisTirMilisecondes){
            var balle = getballeDispo();
            if (balle != null){
                if (spriteTank.currentAnimation != "tir"){
                    spriteTank.gotoAndPlay("tir");
                    spriteTank.animationend = function(){
                        spriteTank.gotoAndPlay("immobile");
                    }
                }
                balle.estTirer({x: spriteTank.x,y: spriteTank.y}, angle);
                createjs.Sound.play("shoot");
                tempsDernierTir = tempsActuel;
            }
        }
    }

    this.listeBalle = function(){//retourne la liste de balles
        return ballesUtilise;
    }

    this.avancerBalles = function(){//deplace toutes les balles
        ballesUtilise.forEach(balle => {
            if (balle != null){
                balle.avancer();
            }
        });
    }

    initialiser();
}