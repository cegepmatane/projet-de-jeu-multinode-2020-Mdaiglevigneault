(function(){

    var TOUCHE_GAUCHE = 37;
	var TOUCHE_DROITE = 39;
	var TOUCHE_BAS = 40;
	var TOUCHE_HAUT = 38;
	var TOUCHE_W = 87;
	var TOUCHE_S = 83;
	var TOUCHE_A = 65;
	var TOUCHE_D = 68;

	var gestionTouche = {
        recule: false,
        avance: false,
        tourneDroite: false,
        tourneGauche: false,
		cliqueGauche: false
	}

    const NOMBRE_JOUEUR_REQUIS = 2;

    //CONSTANTES CLE
    const VARIABLE =
        {
            RECULE: "recule",
            AVANCE: "avance",
            TOURNEDROITE: "tourne-droite",
            TOURNEGAUCHE: "tourne-gauche",
            CLIQUEGAUCHE: "clique-gauche"
        };

    var multiNode;

    var pseudonyme;
    var boutonAuthentification;

    var listeJoueur;
    var pseudonymeJoueur;
    var pseudonymeAutreJoueur;

    function initialiser(){

        multiNode = new MultiNode();
        multiNode.confirmerConnexion = confirmerConnexion;
        multiNode.confirmerAuthentification = confirmerAuthentification;
        multiNode.apprendreAuthentification = apprendreAuthentification;
        multiNode.recevoirVariable = recevoirVariable;
        multiNode.connecter();

        listeJoueur = {};
        pseudonymeJoueur = "";
        pseudonymeAutreJoueur = "";

        initialiserVue();

    }

    function initialiserVue(){

        formulaireAuthentification = document.getElementById("formulaire-authentification");
        formulaireAuthentification.addEventListener("submit", authentifierJoueur)

        pseudonyme = document.getElementById("pseudonyme");

        boutonAuthentification = document.getElementById("bouton-authentification");

    }

    var gererTouchePresser = function(evenement){//gere le deplacement du tank selon la touche enfoncer
        if (aucunControle()){
            switch (evenement.keyCode){
                case TOUCHE_DROITE:
                case TOUCHE_D:
                    aviserServeur(VARIABLE.TOURNEDROITE,true);
                    gestionTouche.tourneDroite = true;
                    break;
                case TOUCHE_GAUCHE:
                case TOUCHE_A:
                    aviserServeur(VARIABLE.TOURNEGAUCHE,true);
                    gestionTouche.tourneGauche = true;
                    break;
                case TOUCHE_HAUT:
                case TOUCHE_W:
                    aviserServeur(VARIABLE.AVANCE,true);
                    gestionTouche.avance = true;
                    break;
                case TOUCHE_BAS:
                case TOUCHE_S:
                    aviserServeur(VARIABLE.RECULE,true);
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
                if (gestionTouche.tourneDroite){
                    aviserServeur(VARIABLE.TOURNEDROITE,false);
                }
				gestionTouche.tourneDroite = false;
				break;
			case TOUCHE_GAUCHE:
			case TOUCHE_A:
                if (gestionTouche.tourneGauche){
                    aviserServeur(VARIABLE.TOURNEGAUCHE,false);
                }
				gestionTouche.tourneGauche = false;
				break;
			case TOUCHE_HAUT:
			case TOUCHE_W:
                if (gestionTouche.avance){
                    aviserServeur(VARIABLE.AVANCE,false);;
                }
				gestionTouche.avance = false;
				break;
			case TOUCHE_BAS:
			case TOUCHE_S:
                if (gestionTouche.recule){
                    aviserServeur(VARIABLE.RECULE,false);
                }
				gestionTouche.recule = false;
				break;
		}
	}

    function aviserServeur(id, bool){
            multiNode.posterVariableBooleenne(pseudonymeJoueur + "=>" + id,bool);
    }

    function confirmerConnexion()
    {
        console.log("Je suis connecté.");
    }
    
    function confirmerAuthentification(autresParticipants){

        console.log("Je suis authentifié.");
        console.log("Les autres participants sont " + JSON.stringify(autresParticipants));

        formulaireAuthentification.querySelector("fieldset").disabled = true;

        ajouterJoueur(pseudonymeJoueur);

        for (index = 0; index < autresParticipants.length; ++index) {
            ajouterJoueur(autresParticipants[index]);
        }

        validerDebutPartie();

    }

    function recevoirVariable(variable){

        console.log("Surcharge de recevoirVariable " + variable.cle + " = " + variable.valeur);

        var cle = identifierComposantCleVariable(variable.cle);

        //TODO actions selon la variable recue

    }

    function apprendreAuthentification(pseudonyme){

        console.log("Nouvel ami " + pseudonyme);

        ajouterJoueur(pseudonyme);

        validerDebutPartie();

    }

    function authentifierJoueur(evenement){

        evenement.preventDefault();

        pseudonymeJoueur = pseudonyme.value;

        multiNode.demanderAuthentification(pseudonymeJoueur);

        boutonAuthentification.disabled = true;

    }

    function identifierComposantCleVariable(cleVariable){

        var composantCle = cleVariable.split('=>');

        var cle = {

            pseudonyme : composantCle[0],
            nomAnonyme : composantCle[1]

        }

        return cle;

    }

    function ajouterJoueur(nouveauPseudonymeJoueur){

        console.log("ajouterJoueur() : " + nouveauPseudonymeJoueur);

        listeJoueur[nouveauPseudonymeJoueur] =
            {
                pointDeVie : 20
            };

    }

    function validerDebutPartie(){

        var nombreJoueur = Object.keys(listeJoueur).length;

        console.log("validerDebutPartie() : " + nombreJoueur + " == " + NOMBRE_JOUEUR_REQUIS);

        if(nombreJoueur == NOMBRE_JOUEUR_REQUIS){

            console.log("peut commencer!!");
            
            window.addEventListener("keydown", gererTouchePresser);
            window.addEventListener("keyup", gererToucheLever);
    
            window.addEventListener("mousedown", function(event){
                if (event.button == 0){
                    aviserServeur(VARIABLE.CLIQUEGAUCHE,true);
                }});
    
            window.addEventListener("mouseup", function(event){
                if (event.button == 0){
                    aviserServeur(VARIABLE.CLIQUEGAUCHE,false);
                }});

        }

    }

    initialiser();

})();
