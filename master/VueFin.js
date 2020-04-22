var VueFin = function(){
    var htmlVue;

    var initialiser = function(){//trouve le contenu de page fin
        htmlVue = document.querySelector("#page-fin").innerHTML;
    }

    this.afficher = function(texte, premier, second){//remplace le contenu de la page pour le contenu fin
        htmlVue = htmlVue.replace("{texte-fin-partie}", texte);
        htmlVue = htmlVue.replace("{texte-gagnant}", "Premier : " + premier);
        document.querySelector("body").innerHTML = htmlVue.replace("{texte-perdant}", "Second : " + second);
    }

    initialiser();
}