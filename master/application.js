(function application(){

    var nomJoueur;
    var jeu;

    //vues
    var vueAccueil;
    var vueJeu;
    var vueFin;

    var initialiser = function(){//cree les vue jeu, accueil et fun et affiche accueil
        vueAccueil = new VueAccueil(lancerJeu);
        vueJeu = new VueJeu();
        vueFin = new VueFin();
        
        nomJoueur = null;
        vueAccueil.afficher(null);

        window.addEventListener("hashchange", naviguer);
    }

    var naviguer = function(){//affiche la bonne page selon le hash
        if (nomJoueur != null){
            var hash = window.location.hash;
            if (hash.match(/^#accueil/)){
                vueAccueil.afficher(nomJoueur);
            } else if (hash.match(/^#jouer/)){
                creeJeu();
            } else if (hash.match(/^#fin-partie-gagnee/)){
                jeu = null;
                vueFin.afficher("Partie gagne!");
            }else if (hash.match(/^#fin-partie-perdue/)){
                jeu = null;
                vueFin.afficher("Partie perdue!");
            }
        }
    }

    var creeJeu = function(){//affiche la vue jeu et cree un jeu
        vueJeu.afficher();
        jeu = new Jeu();
    }

    var lancerJeu = function(nomDuJoueur){//verifie le nom et change le hash
        if (nomDuJoueur != ""){
            nomJoueur = nomDuJoueur;
            window.location.href = "#jouer";
        } else {
            alert("Veuillez entrer un nom pour jouer!");
        }   
    }

    document.addEventListener("DOMContentLoaded", initialiser);
})();