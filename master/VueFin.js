var VueFin = function(){
    var htmlVue;

    var initialiser = function(){//trouve le contenu de page fin
        htmlVue = document.querySelector("#page-fin").innerHTML;
    }

    this.afficher = function(texte){//remplace le contenu de la page pour le contenu fin
        document.querySelector("body").innerHTML = htmlVue.replace("{texte-fin-partie}", texte);
    }

    initialiser();
}