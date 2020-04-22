(function application(){

    var nomJoueur;
    var jeu;

    //vues
    var musique;
    var vueJeu;
    var vueFin;

    var multijoueur;

    var initialiser = function(){//cree les vue jeu, accueil et fun et affiche accueil
        vueJeu = new VueJeu();
        vueFin = new VueFin();
        
        nomJoueur = "1";

        multijoueur = new Multijoueur(validerNom);

        multijoueur.initialiserVue(nomJoueur);
        
        createjs.Sound.registerSound("sons/Open.mp3", "action");

        window.addEventListener("hashchange", naviguer);
    }

    var naviguer = function(){//affiche la bonne page selon le hash
        if (nomJoueur != null){
            var hash = window.location.hash;
            if (hash.match(/^#accueil/)){
                multijoueur.initialiserVue(nomJoueur);
            } else if (hash.match(/^#jouer/)){
                musique = createjs.Sound.play("action");
                creeJeu();
            } else if (hash.match(/^#fin-partie-gagnee/)){
                if (jeu.getNumeroJoueur() == 1){
                    vueFin.afficher("Partie gagne!", jeu.getScoreJ1(), jeu.getScoreJ2());
                } else {
                    vueFin.afficher("Partie gagne!", jeu.getScoreJ2(), jeu.getScoreJ1());
                }
                jeu = null;
            }else if (hash.match(/^#fin-partie-perdue/)){ 
                if (jeu.getNumeroJoueur() == 1){
                    vueFin.afficher("Partie perdue!", jeu.getScoreJ2(), jeu.getScoreJ1());
                } else {
                    vueFin.afficher("Partie perdue!", jeu.getScoreJ1(), jeu.getScoreJ2());
                }
                jeu = null;
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