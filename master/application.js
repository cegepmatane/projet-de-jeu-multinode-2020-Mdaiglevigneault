(function application(){

    var nomJoueur;
    var jeu;

    //vues
    var vueAccueil;
    var vueJeu;
    var vueFin;

    var multijoueur;

    var initialiser = function(){//cree les vue jeu, accueil et fun et affiche accueil
        //vueAccueil = new VueAccueil(lancerJeu);OLD
        vueJeu = new VueJeu();
        vueFin = new VueFin();
        
        nomJoueur = "1";

        multijoueur = new Multijoueur(validerNom);

        //vueAccueil.afficher(null);OLD
        multijoueur.initialiserVue(nomJoueur);
        

        window.addEventListener("hashchange", naviguer);
    }

    var naviguer = function(){//affiche la bonne page selon le hash
        if (nomJoueur != null){
            var hash = window.location.hash;
            if (hash.match(/^#accueil/)){
                multijoueur.initialiserVue(nomJoueur);
                //vueAccueil.afficher(nomJoueur);
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
        multijoueur.setJeu(jeu);
    }

    var validerNom = function(nomDuJoueur){//verifie le nom et change le hash
        if (nomDuJoueur != ""){
            nomJoueur = nomDuJoueur;
            return true;
        } else {
            alert("Veuillez entrer un nom pour jouer!");
            return false;
        }   
    }

    document.addEventListener("DOMContentLoaded", initialiser);
})();