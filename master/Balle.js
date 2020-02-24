function Balle(scene, changerBalleDispo, id){
    
    this.id = id;
    var image;
    var bitmap;
    var charge;
    var echelle = 0.2;
    var velocite;
    var velociteX;
    var velociteY;

    var initialiser = function(){//cree l'image de la balle
        image = new Image();
        image.onload = creerBitmap;
        image.src = "illustration/Balle.png";
        utilisee = false;
        charge = false;
    }

    var creerBitmap = function(evenementOnload){//cree le bitmap
        console.log("balle -- creerBitmap");
        bitmap = new createjs.Bitmap(image);
        bitmap.regX = bitmap.regY = 25;
        bitmap.x = bitmap.y = -3000;
        bitmap.scaleX = bitmap.scaleY = echelle;
        charge = true;
    }

    var verifierCollisons = function(){//met la balle de cote quand elle sort du canvas
        if (bitmap.x >= 1613 || bitmap.x <= -50 || bitmap.y >= 813 || bitmap.y <= -50){ // sortie du canvas
            envoyerDeCote();
        }
    }


//Section des access Publics --------------------------------------

    this.getRectangle = function(){//retourne le rectangle (x,y,width,height) de l'objet
        var rectangle = {
            x : bitmap.x,
            y : bitmap.y,
            width : image.width*echelle,
            height : image.height*echelle
        };

        return rectangle;
    }

    this.estCharge = function(){//verifie que l'image de la balle est chargee
        return charge;
    }

    this.afficher = function(){//ajoute la balle a la scene
        console.log("balle -- afficher");
        scene.addChild(bitmap);
    }

    this.avancer = function(){//deplace les balles et verifie quelle sont dans la map
        bitmap.x += velociteX;
        bitmap.y += velociteY;
        verifierCollisons();
    }

    this.estTirer = function(position, direction){//deplace la balle au canon cree la trajectoire et velocite
        bitmap.x = position.x + (55 * Math.cos(direction));
        bitmap.y = position.y + (55 * Math.sin(direction));
        velocite = 20;
        velociteX = velocite * Math.cos(direction);
		velociteY = velocite * Math.sin(direction);
    }

    this.rentrerEncollision = function(){//met la balle de cote
        console.log("collision balle!!");
        envoyerDeCote();
    }

    var envoyerDeCote = function(){//sort la balle du jeu, annule sa trajectoire et annule sa velocite
        changerBalleDispo(id);
        bitmap.x = bitmap.y = -3000;
        velocite = 0;
        velociteX = 0;
        velociteY = 0;
    }

    initialiser();
}