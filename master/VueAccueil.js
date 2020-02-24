var VueAccueil = function(lancerJeu){
    var formulaireJoueur;
    var nomJoueur;

    var initialiser = function(){//trouve le contenu de page accueil
        htmlVue = document.querySelector("#page-accueil").innerHTML;
    }

    this.afficher = function(nomDuJoueur){//affiche le contenu de VueAccueil dans la page
        document.querySelector("body").innerHTML = htmlVue;

        formulaireJoueur = document.querySelector("#formulaire-joueur");
        nomJoueur = document.querySelector("#nom-joueur");
        nomJoueur.value = nomDuJoueur;
        //enrJoueur =  document.querySelector("enregistrer-joueur");

        document.addEventListener("submit", enregistrerJoueur);
    }

    var enregistrerJoueur = function(evenement){//demande a l'appli de lancer le jeu
        evenement.preventDefault();
        lancerJeu(nomJoueur.value);
    }

    initialiser();
}