var Jeu = function(){

	//Etat du clique gauche
	var gestionToucheJoueur1 = {
		recule: false,
        avance: false,
        tourneDroite: false,
        tourneGauche: false,
		cliqueGauche: false
	}

	var gestionToucheJoueur2 = {
		recule: false,
        avance: false,
        tourneDroite: false,
        tourneGauche: false,
		cliqueGauche: false
	}
	
	var NumeroJoueur;
	var aviserServeurPointage;
	var aviserServeurGagnant;

	//Element de la page
	var scoreJoueur1 = {element:null,texte:"",valeur:0,index:1};
	var scoreJoueur2 = {element:null,texte:"",valeur:0,index:2};
	var scene;
	var testChargement;

	//Objets
	var arrierePlan;
	var tankJoueur1;
	var mur1;
	var mur2;
	var boss;
	var nombreBoites = 14;
	var listeBoite = [];

	
    var initialiser = function(){//trouve le canvas et le 'hud', cree la scene
		var dessin = document.getElementById("dessin");
		scoreJoueur1.element = document.getElementById("scoreJ1");
		scoreJoueur2.element = document.getElementById("scoreJ2");
		scene = new createjs.Stage(dessin);
		console.log("scene creer");
		

//Section Creation --------------------------------------

		arrierePlan = new ArrierePlan(scene);
		mur1 = new Mur(scene, 1);
		mur2 = new Mur(scene, 2);
		creerBoites();
		boss = new Boss(scene);
		tankJoueur1 = new Tank(scene, 1);
		tankJoueur2 = new Tank(scene, 2);
		

//Section Ticker --------------------------------------

		createjs.Ticker.setFPS(30);
		var gererTick = function(evenementTick){//gameLoop
			if (window.location.href.search("#jouer") == -1){
				terminerJeu(null);
			} else if ((NumeroJoueur == 1 && gererCollisionRectangleBalle(boss.getRectangle(), tankJoueur1.listeBalle()))
					 ||(NumeroJoueur == 2 && gererCollisionRectangleBalle(boss.getRectangle(), tankJoueur2.listeBalle()))) {
				createjs.Ticker.removeEventListener("tick", gererTick);
				aviserServeurGagnant();
			} else if (arrierePlan.tempsEstEcoule()){
				createjs.Ticker.removeEventListener("tick", gererTick);
				terminerJeu(false);
			} else {

				gererCollisionBoiteBalle(tankJoueur1.listeBalle(),listeBoite, scoreJoueur1.index);
				gererCollisionTank(tankJoueur1,tankJoueur1.getRectangle(), listeBoite);
				gererCollisionRectangleBalle(mur1.getRectangle(), tankJoueur1.listeBalle());

				gererCollisionBoiteBalle(tankJoueur2.listeBalle(),listeBoite, scoreJoueur2.index);
				gererCollisionTank(tankJoueur2,tankJoueur2.getRectangle(), listeBoite);
				gererCollisionRectangleBalle(mur2.getRectangle(), tankJoueur2.listeBalle());

				tankJoueur1.avancerBalles();
				tankJoueur2.avancerBalles();
				gererDeplacementsTankJoueur(tankJoueur1, gestionToucheJoueur1);
				gererDeplacementsTankJoueur(tankJoueur2, gestionToucheJoueur2);

				gererTir();

				arrierePlan.animer();
				scene.update();

				console.log("scene updater");
			}
		}

//Section chargement du Jeu --------------------------------------

		var testerChargement = function(objet){//verifie le changement de tout les composants
			if(tankJoueur1.estCharge() && tankJoueur2.estCharge() && listeBoiteEstCharge() && arrierePlan.estCharge() && mur1.estCharge() && mur2.estCharge() && boss.estCharge()){
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
		scoreJoueur1.element.innerHTML = scoreJoueur1.texte + scoreJoueur1.valeur;
		scoreJoueur2.element.innerHTML = scoreJoueur2.texte + scoreJoueur2.valeur;
	}

	var afficherObjet = function (){
		arrierePlan.afficher();
		boss.afficher();
		mur1.afficher();
		mur2.afficher();
		afficherListeBoite();
		tankJoueur1.afficher();
		tankJoueur2.afficher();
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
				case 7:
					position = {x:900,y:90};
					break;
				case 8:
					position = {x:1000,y:170};
					break;
				case 9:
					position = {x:900,y:250};
					break;
				case 10:
					position = {x:1000,y:330};
					break;
				case 11:
					position = {x:900,y:410};
					break;
				case 12:
					position = {x:1000,y:490};
					break;
				case 13:
					position = {x:900,y:570};
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

	var gererTir = function(){//tankJoueur1 tir si clique gauche est presser
		if (gestionToucheJoueur1.cliqueGauche == true)
			tankJoueur1.Tirer();
		if (gestionToucheJoueur2.cliqueGauche == true)
			tankJoueur2.Tirer();
	}

	this.updateGestionToucheJoueur1 = function(touche, valeur){
		console.log(touche + " -> " + valeur);
		switch (touche){
			case "gagne" :
				terminerJeu(NumeroJoueur == 1);
				break;
			case "ajoutpoint" :
				scoreJoueur1.valeur++;
				afficherScore();
				if (scoreJoueur1.valeur >= 7){
					mur1.detruire();
				}
				break;
			case "recule":
				gestionToucheJoueur1.recule = valeur;
				break;
			case "avance":
				gestionToucheJoueur1.avance = valeur;
				break;
			case "tourne-droite":
				gestionToucheJoueur1.tourneDroite = valeur;
				break;
			case "tourne-gauche":
				gestionToucheJoueur1.tourneGauche = valeur;
				break;
			case "clique-gauche":
				gestionToucheJoueur1.cliqueGauche = valeur;
				break;
		}
	}

	this.updateGestionToucheJoueur2 = function(touche, valeur){
		console.log(touche + " -> " + valeur);
		switch (touche){
			case "gagne" :
				terminerJeu(NumeroJoueur == 2);
				break;
			case "ajoutpoint" :
				scoreJoueur2.valeur++;
				afficherScore();
				if (scoreJoueur2.valeur >= 7){
					mur2.detruire();
				}
				break;
			case "recule":
				gestionToucheJoueur2.recule = valeur;
				break;
			case "avance":
				gestionToucheJoueur2.avance = valeur;
				break;
			case "tourne-droite":
				gestionToucheJoueur2.tourneDroite = valeur;
				break;
			case "tourne-gauche":
				gestionToucheJoueur2.tourneGauche = valeur;
				break;
			case "clique-gauche":
				gestionToucheJoueur2.cliqueGauche = valeur;
				break;
		}
	}

	this.setNumeroJoueur = function(numero){
		NumeroJoueur = numero;
	}

	this.setAviserServeurPointage = function(aviser){
		aviserServeurPointage = aviser;
	}

	this.setAviserServeurGagnant = function(aviser){
		console.log("allo allo test test");
		aviserServeurGagnant = aviser;
	}

	this.getScoreJ1 = function(){
		return scoreJoueur1.texte + scoreJoueur1.valeur;
	}

	this.getScoreJ2 = function(){
		return scoreJoueur2.texte + scoreJoueur2.valeur;
	}

	this.getNumeroJoueur = function(){
		return NumeroJoueur;
	}

	this.setPseudonymes = function (nomJoueur1, nomJoueur2){
		scoreJoueur1.texte = nomJoueur1 + " - points : ";
		scoreJoueur2.texte = nomJoueur2 + " - points : ";
		afficherScore();
	}

	var gererDeplacementsTankJoueur = function(tankJoueur, gestionToucheJoueur){
		if (gestionToucheJoueur.tourneDroite){
			tankJoueur.tourner("D");
		} else
		if (gestionToucheJoueur.tourneGauche){
			tankJoueur.tourner("G");
		} else
		if (gestionToucheJoueur.avance){
			tankJoueur.avancer();
		} else
		if (gestionToucheJoueur.recule){
			tankJoueur.reculer();
		} else {
			tankJoueur.arreter();
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

	var gererCollisionBoiteBalle = function(listeBalle, listeBoite, indexJoueur){//verifie la collision entre une liste de boite et une liste de balle
		listeBoite.forEach(boite => {
			if (boite.getVie() > 0){
				listeBalle.forEach(balle => {
					if (balle != null){
						if (gerercollisionEntreRectangle(balle.getRectangle(),boite.getRectangle())){
							balle.rentrerEncollision();
							if (boite.toucher()){//true si la boite est "morte" lors de l'impact
								if (indexJoueur == NumeroJoueur){
									aviserServeurPointage();
								}
							}
						}
					}
				});
			}
		});
	}

	var gererCollisionTank = function(tankjoueur ,rectangleTank, listeboite){//verifie la collision entre un tankJoueur1 et une liste de boite
		listeBoite.forEach(boite => {
			if (boite.getVie() > 0){
				if (gerercollisionEntreRectangle(rectangleTank,boite.getRectangle())){
					tankjoueur.annulerMouvement();
				}
			}
		});
	}

	var terminerJeu = function(gagner){//termine le jeu	
		if (gagner != null){
			if (gagner){
				window.location.href = "#fin-partie-gagnee";
			} else {
				window.location.href = "#fin-partie-perdue";
			}
		}
	}

    initialiser();
}