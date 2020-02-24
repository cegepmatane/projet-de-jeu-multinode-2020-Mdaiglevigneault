var VueJeu = function(){
    var htmlVue;

    var initialiser = function(){//trouve le contenu de page jeu
        htmlVue = document.querySelector("#page-jeu").innerHTML;
    }

    this.afficher = function(){//remplace le contenu de la page pour le contenu Jeu
        document.querySelector("body").innerHTML = htmlVue;
    }

    initialiser();
}