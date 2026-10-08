/* =========================================================
   SYSTÈME D'ÉVALUATION DU CONFORT THERMIQUE
   PAR LOGIQUE FLOUE
========================================================= */


/* =========================================================
   1. RÉCUPÉRATION DES ÉLÉMENTS HTML
========================================================= */

const temperatureInput =
    document.getElementById("temperature");

const humiditeInput =
    document.getElementById("humidite");

const evaluerButton =
    document.getElementById("evaluer");


/* =========================================================
   2. FONCTIONS D'APPARTENANCE DE LA TEMPÉRATURE
========================================================= */


/*
   TEMPÉRATURE FROIDE

   t <= 10       → degré = 1
   t >= 20       → degré = 0
   entre 10 et 20 → diminution progressive
*/

function temperatureFroide(t) {

    if (t <= 10) {
        return 1;
    }

    if (t >= 20) {
        return 0;
    }

    return (20 - t) / 10;
}


/*
   TEMPÉRATURE MODÉRÉE

   15 → 0
   22.5 → 1
   30 → 0
*/

function temperatureModeree(t) {

    if (t <= 15 || t >= 30) {
        return 0;
    }

    if (t <= 22.5) {
        return (t - 15) / 7.5;
    }

    return (30 - t) / 7.5;
}


/*
   TEMPÉRATURE CHAUDE

   t <= 25 → 0
   t >= 35 → 1
   entre 25 et 35 → augmentation progressive
*/

function temperatureChaude(t) {

    if (t <= 25) {
        return 0;
    }

    if (t >= 35) {
        return 1;
    }

    return (t - 25) / 10;
}


/* =========================================================
   3. FONCTIONS D'APPARTENANCE DE L'HUMIDITÉ
========================================================= */


/*
   HUMIDITÉ FAIBLE

   h <= 20 → 1
   h >= 40 → 0
*/

function humiditeFaible(h) {

    if (h <= 20) {
        return 1;
    }

    if (h >= 40) {
        return 0;
    }

    return (40 - h) / 20;
}


/*
   HUMIDITÉ MOYENNE

   30 → 0
   50 → 1
   70 → 0
*/

function humiditeMoyenne(h) {

    if (h <= 30 || h >= 70) {
        return 0;
    }

    if (h <= 50) {
        return (h - 30) / 20;
    }

    return (70 - h) / 20;
}


/*
   HUMIDITÉ ÉLEVÉE

   h <= 60 → 0
   h >= 80 → 1
*/

function humiditeElevee(h) {

    if (h <= 60) {
        return 0;
    }

    if (h >= 80) {
        return 1;
    }

    return (h - 60) / 20;
}


/* =========================================================
   4. FONCTION POUR LIMITER UNE VALEUR ENTRE 0 ET 1
========================================================= */

function limiter(valeur) {

    return Math.max(
        0,
        Math.min(1, valeur)
    );
}


/* =========================================================
   5. APPLICATION DES RÈGLES FLOUES
========================================================= */

/*
   Opérateur ET = MIN

   Exemple :

   Température modérée = 0.67
   Humidité moyenne = 1

   Règle :
   SI température est MODÉRÉE
   ET humidité est MOYENNE
   ALORS confort est BON

   Force de la règle :

   min(0.67, 1) = 0.67
*/


function appliquerRegles(
    froide,
    moderee,
    chaude,
    faible,
    moyenne,
    elevee
) {


    /* =========================
       RÈGLES POUR "MAUVAIS"
    ========================= */


    // R1
    const R1 = Math.min(
        froide,
        faible
    );


    // R2
    const R2 = Math.min(
        froide,
        moyenne
    );


    // R3
    const R3 = Math.min(
        froide,
        elevee
    );


    // R7
    const R7 = Math.min(
        chaude,
        faible
    );


    // R8
    const R8 = Math.min(
        chaude,
        moyenne
    );


    // R9
    const R9 = Math.min(
        chaude,
        elevee
    );


    /*
       Agrégation des règles donnant
       un confort MAUVAIS.
    */

    const mauvais = Math.max(
        R1,
        R2,
        R3,
        R7,
        R8,
        R9
    );


    /* =========================
       RÈGLES POUR "MOYEN"
    ========================= */


    // R4
    const R4 = Math.min(
        moderee,
        faible
    );


    // R6
    const R6 = Math.min(
        moderee,
        elevee
    );


    const moyen = Math.max(
        R4,
        R6
    );


    /* =========================
       RÈGLE POUR "BON"
    ========================= */


    // R5
    const R5 = Math.min(
        moderee,
        moyenne
    );


    const bon = R5;


    return {

        mauvais: limiter(mauvais),

        moyen: limiter(moyen),

        bon: limiter(bon)

    };
}


/* =========================================================
   6. CALCUL DU SCORE
========================================================= */


/*
   Conversion du degré de confort
   en score sur 100.

   0   → confort faible
   100 → confort excellent
*/


function calculerScore(
    mauvais,
    moyen,
    bon
) {

    /*
       Les trois degrés représentent
       les différents niveaux de confort.
    */

    const somme =
        mauvais +
        moyen +
        bon;


    if (somme === 0) {
        return 0;
    }


    /*
       Moyenne pondérée :

       Mauvais = 20 points
       Moyen   = 50 points
       Bon     = 100 points
    */

    let score =
        (
            mauvais * 20 +
            moyen * 50 +
            bon * 100
        ) / somme;


    return Math.round(score);
}


/* =========================================================
   7. MISE À JOUR DES BARRES
========================================================= */

function mettreAJourBarre(
    id,
    valeur
) {

    const element =
        document.getElementById(id);

    element.style.width =
        (valeur * 100) + "%";
}


/* =========================================================
   8. AFFICHAGE D'UNE VALEUR
========================================================= */

function afficherValeur(
    id,
    valeur
) {

    document.getElementById(id)
        .textContent =
        valeur.toFixed(2);
}


/* =========================================================
   9. FONCTION PRINCIPALE D'ÉVALUATION
========================================================= */

function evaluerConfort() {


    /* =========================
       RÉCUPÉRER LES VALEURS
    ========================= */

    const temperature =
        parseFloat(
            temperatureInput.value
        );


    const humidite =
        parseFloat(
            humiditeInput.value
        );


    /* =========================
       VÉRIFICATION
    ========================= */

    if (
        isNaN(temperature) ||
        isNaN(humidite)
    ) {

        alert(
            "Veuillez saisir une température et une humidité valides."
        );

        return;
    }


    if (
        temperature < 0 ||
        temperature > 50
    ) {

        alert(
            "La température doit être comprise entre 0°C et 50°C."
        );

        return;
    }


    if (
        humidite < 0 ||
        humidite > 100
    ) {

        alert(
            "L'humidité doit être comprise entre 0% et 100%."
        );

        return;
    }


    /* =========================
       FUZZIFICATION
    ========================= */


    const froide =
        temperatureFroide(
            temperature
        );


    const moderee =
        temperatureModeree(
            temperature
        );


    const chaude =
        temperatureChaude(
            temperature
        );


    const faible =
        humiditeFaible(
            humidite
        );


    const moyenne =
        humiditeMoyenne(
            humidite
        );


    const elevee =
        humiditeElevee(
            humidite
        );


    /* =========================
       AFFICHER TEMPÉRATURE
    ========================= */

    afficherValeur(
        "froideValue",
        froide
    );

    afficherValeur(
        "modereeValue",
        moderee
    );

    afficherValeur(
        "chaudeValue",
        chaude
    );


    /* =========================
       AFFICHER HUMIDITÉ
    ========================= */

    afficherValeur(
        "faibleValue",
        faible
    );

    afficherValeur(
        "moyenneValue",
        moyenne
    );

    afficherValeur(
        "eleveeValue",
        elevee
    );


    /* =========================
       ANIMATION DES BARRES
    ========================= */

    mettreAJourBarre(
        "froideBar",
        froide
    );

    mettreAJourBarre(
        "modereeBar",
        moderee
    );

    mettreAJourBarre(
        "chaudeBar",
        chaude
    );


    mettreAJourBarre(
        "faibleBar",
        faible
    );

    mettreAJourBarre(
        "moyenneBar",
        moyenne
    );

    mettreAJourBarre(
        "eleveeBar",
        elevee
    );


    /* =========================
       INFÉRENCE FLOUE
    ========================= */

    const resultats =
        appliquerRegles(
            froide,
            moderee,
            chaude,
            faible,
            moyenne,
            elevee
        );


    const mauvais =
        resultats.mauvais;

    const moyen =
        resultats.moyen;

    const bon =
        resultats.bon;


    /* =========================
       AFFICHAGE DES RÉSULTATS
    ========================= */

    afficherValeur(
        "mauvaisValue",
        mauvais
    );

    afficherValeur(
        "moyenValue",
        moyen
    );

    afficherValeur(
        "bonValue",
        bon
    );


    mettreAJourBarre(
        "mauvaisBar",
        mauvais
    );

    mettreAJourBarre(
        "moyenBar",
        moyen
    );

    mettreAJourBarre(
        "bonBar",
        bon
    );


    /* =========================
       CALCUL DU SCORE
    ========================= */

    const score =
        calculerScore(
            mauvais,
            moyen,
            bon
        );


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "progressBar"
    ).style.width =
        score + "%";


    /* =========================
       INTERPRÉTATION
    ========================= */

    const comfortLabel =
        document.getElementById(
            "comfortLabel"
        );


    const informationText =
        document.getElementById(
            "informationText"
        );


    if (score >= 75) {

        comfortLabel.textContent =
            "Confort élevé";

        informationText.textContent =
            "Le niveau de confort est élevé. La température et l'humidité sont favorables à de bonnes conditions de confort.";

    }

    else if (score >= 50) {

        comfortLabel.textContent =
            "Confort moyen";

        informationText.textContent =
            "Les conditions sont relativement confortables, mais certains paramètres peuvent être améliorés.";

    }

    else {

        comfortLabel.textContent =
            "Confort faible";

        informationText.textContent =
            "Les conditions thermiques sont peu favorables. Une adaptation de la température ou de l'humidité peut améliorer le confort.";

    }

}


/* =========================================================
   10. ÉVÉNEMENT DU BOUTON
========================================================= */

evaluerButton.addEventListener(
    "click",
    evaluerConfort
);


/* =========================================================
   11. CALCUL AUTOMATIQUE AU CHARGEMENT
========================================================= */

evaluerConfort();