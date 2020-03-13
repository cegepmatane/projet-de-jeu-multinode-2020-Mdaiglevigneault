var Jeu = function(){
	//Constantes de touches
	var TOUCHE_GAUCHE = 37;
	var TOUCHE_DROITE = 39;
	var TOUCHE_BAS = 40;
	var TOUCHE_HAUT = 38;
	var TOUCHE_W = 87;
	var TOUCHE_S = 83;
	var TOUCHE_A = 65;
	var TOUCHE_D = 68;

	//Etat du clique gauche
	var gestionTouche = {
		recule: false,
        avance: false,
        tourneDroite: false,
        tourneGauche: false,
		cliqueGauche: false
	}
	
	//Element de la page
	var scoreJoueur = {texte:null,valeur:0};
	var scene;
	var testChargement;

	//Objets
	var arrierePlan;
	var tank;
	var mur;
	var boss;
	var nombreBoites = 7;
	var listeBoite = [];

	
    var initialiser = function(){//trouve le canvas et le 'hud', cree la scene
		var dessin = document.getElementById("dessin");
		scoreJoueur.texte = document.getElementById("scoreJ1");
		afficherScore();//afficher le score de départ
		scene = new createjs.Stage(dessin);
		console.log("scene creer");
		

//Section Creation --------------------------------------

		arrierePlan = new ArrierePlan(scene);
		mur = new Mur(scene);
		creerBoites();
		boss = new Boss(scene);
		tank = new Tank(scene);
		

//Section Ticker --------------------------------------

		createjs.Ticker.setFPS(30);
		var gererTick = function(evenementTick){//gameLoop
			if (window.location.href.search("#jouer") == -1){
				terminerJeu(null);
			} else if (gererCollisionRectangleBalle(boss.getRectangle(), tank.listeBalle())){
				terminerJeu(true);
			} else if (arrierePlan.tempsEstEcoule()){
				terminerJeu(false);
			} else {
				gererCollisionBoiteBalle(tank.listeBalle(),listeBoite);
				gererCollisionTank(tank.getRectangle(), listeBoite);
				gererCollisionRectangleBalle(mur.getRectangle(), tank.listeBalle());

				tank.avancerBalles();
				gererDeplacementsTank();

				gererTir();

				arrierePlan.animer();
				scene.update();

				console.log("scene updater");
			}
		}

		var terminerJeu = function(gagner){//termine le jeu
			createjs.Ticker.removeEventListener("tick", gererTick);
			if (gagner != null){
				if (gagner){
					window.location.href = "#fin-partie-gagnee";
				} else {
					window.location.href = "#fin-partie-perdue";
				}
			}
		}
		

//Section Abonnement au Events --------------------------------------

		/*window.addEventListener("keydown", gererTouchePresser);
		window.addEventListener("keyup", gererToucheLever);
		window.addEventListener("mousedown", function(){gestionTouche.cliqueGauche = true;});
		window.addEventListener("mouseup", function(){gestionTouche.cliqueGauche = false;});*/


//Section chargement du Jeu --------------------------------------

		var testerChargement = function(objet){//verifie le changement de tout les composants
			if(tank.estCharge() && listeBoiteEstCharge() && arrierePlan.estCharge() && mur.estCharge() && boss.estCharge()){
				console.log("(Prêts a afficher == true");
				afficherObjet();
				createjs.Ticker.addEventListener("tick", gererTick);
				clearInterval(testChargement);
			}
		}

		//lancer le chargement du jeu
		testChargement = setInterval(testerChargement, 100)
	}


//Section Affichage sur la page  --------------------------------------

	var afficherScore = function(){//met a jour le score du joueur
		scoreJoueur.texte.innerHTML = "score : " + scoreJoueur.valeur;
	}

	var afficherObjet = function (){
		arrierePlan.afficher();
		boss.afficher();
		mur.afficher();
		afficherListeBoite();
		tank.afficher();
	}
	

//Section Controle Des Boites --------------------------------------

	var creerBoites = function(){//cree toute les boites
		for (var i=0 ; i < nombreBoites; i++){
			var position;
			switch (i){//contient les position x,y des boites pour le Joueur 1
				case 0:
					position = {x:550,y:90};
					break;
				case 1:
					position = {x:450,y:170};
					break;
				case 2:
					position = {x:550,y:250};
					break;
				case 3:
					position = {x:450,y:330};
					break;
				case 4:
					position = {x:550,y:410};
					break;
				case 5:
					position = {x:450,y:490};
					break;
				case 6:
					position = {x:550,y:570};
					break;
			}
			listeBoite[i] = new Boite(scene,position);
		}
	}

	var listeBoiteEstCharge = function(){//verifie que toute les images des boites son loader
		var nbPasCharge = 0;
		listeBoite.forEach(boite => {
			if (!boite.estCharge()){
				nbPasCharge++;
			}
		});
		return (nbPasCharge == 0);
	}

	var afficherListeBoite = function(){//ajoute toute les boites a la scene
		listeBoite.forEach(boite => {
			boite.afficher();
		});
	}


//Section fonctions des EventsListeners --------------------------------------

	var gererTir = function(){//tank tir si clique gauche est presser
		if (gestionTouche.cliqueGauche == true)
			tank.Tirer();
	}

	this.updateGestionTouche = function(touche, valeur){
		console.log(touche + " -> " + valeur);
		switch (touche){
			case "recule":
				gestionTouche.recule = valeur;
				break;
			case "avance":
				gestionTouche.avance = valeur;
				break;
			case "tourne-droite":
				gestionTouche.tourneDroite = valeur;
				break;
			case "tourne-gauche":
				gestionTouche.tourneGauche = valeur;
				break;
			case "clique-gauche":
				gestionTouche.cliqueGauche = valeur;
				break;
		}
	}

	/*var gererTouchePresser = function(evenement){//gere le deplacement du tank selon la touche enfoncer
		if (aucunControle()){
			switch (evenement.keyCode){
				case TOUCHE_DROITE:
				case TOUCHE_D:
					gestionTouche.tourneDroite = true;
					break;
				case TOUCHE_GAUCHE:
				case TOUCHE_A:
					gestionTouche.tourneGauche = true;
					break;
				case TOUCHE_HAUT:
				case TOUCHE_W:
					gestionTouche.avance = true;
					break;
				case TOUCHE_BAS:
				case TOUCHE_S:
					gestionTouche.recule = true;
					break;
			}
		}
	}

	var aucunControle = function(){
        return (!gestionTouche.avance && !gestionTouche.recule && !gestionTouche.tourneGauche && !gestionTouche.tourneDroite);
    }

	var gererToucheLever = function(evenement){//termine un deplacement du tank
		switch (evenement.keyCode){
			case TOUCHE_DROITE:
			case TOUCHE_D:
				gestionTouche.tourneDroite = false;
				break;
			case TOUCHE_GAUCHE:
			case TOUCHE_A:
				gestionTouche.tourneGauche = false;
				break;
			case TOUCHE_HAUT:
			case TOUCHE_W:
				gestionTouche.avance = false;
				break;
			case TOUCHE_BAS:
			case TOUCHE_S:
				gestionTouche.recule = false;
				break;
		}
		tank.arreter();
	}*/


	var gererDeplacementsTank = function(){
		if (gestionTouche.tourneDroite){
			tank.tourner("D");
		} else
		if (gestionTouche.tourneGauche){
			tank.tourner("G");
		} else
		if (gestionTouche.avance){
			tank.avancer();
		} else
		if (gestionTouche.recule){
			tank.reculer();
		} else {
			tank.arreter();
		}
	}

//Section Gestion des collisions --------------------------------------

	var gerercollisionEntreRectangle = function(rectangle1, rectangle2){//verifie la collision entre deux rectangles donnes
		if (rectangle1.x >= rectangle2.x + rectangle2.width || 
			rectangle1.x + rectangle1.width <= rectangle2.x|| 
			rectangle1.y >= rectangle2.y + rectangle2.height || 
			rectangle1.y + rectangle1.height <= rectangle2.y)
		{
			return false;
		} else {
			return true;
		}
	}

	var gererCollisionRectangleBalle = function(rectangleBoss, listeBalle){//verifie la collision entre un rectangle et une liste de balle donnee
		var nbCollision = 0;
		listeBalle.forEach(balle => {
			if (balle != null){
				if (gerercollisionEntreRectangle(balle.getRectangle(), rectangleBoss)){
					balle.rentrerEncollision();
					nbCollision++;
				}
			}
		});
		return (nbCollision != 0);
	}

	var gererCollisionBoiteBalle = function(listeBalle, listeBoite){//verifie la collision entre une liste de boite et une liste de balle
		listeBoite.forEach(boite => {
			if (boite.getVie() > 0){
				listeBalle.forEach(balle => {
					if (balle != null){
						if (gerercollisionEntreRectangle(balle.getRectangle(),boite.getRectangle())){
							balle.rentrerEncollision();
							if (boite.toucher()){//true si la boite est "morte" lors de l'impact
								scoreJoueur.valeur++;
								afficherScore();
								if (scoreJoueur.valeur >= 7){
									mur.detruire();
								}
							}
						}
					}
				});
			}
		});
	}

	var gererCollisionTank = function(rectangleTank, listeboite){//verifie la collision entre un tank et une liste de boite
		listeBoite.forEach(boite => {
			if (boite.getVie() > 0){
				if (gerercollisionEntreRectangle(rectangleTank,boite.getRectangle())){
					tank.annulerMouvement();
				}
			}
		});
	}

    initialiser();
}