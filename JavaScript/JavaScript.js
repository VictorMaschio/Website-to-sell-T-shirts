class Tshirt {
    constructor(id, img, nom, colors, prix, tags) { /* img est une image, nom le nom du T-shirt, et couleurs une liste contenant les couleurs des apperçu*/
        this._id = id;
        this._img = img;
        this._nom = nom;
        this._colors = colors;
        this._prix = prix;
        this._tags = tags;
    }
    get img() { return this._img };
    get nom() { return this._nom };
    get couleurs() { return this._couleurs };
    get tags() { return this._tags }
    get prix() { return this._prix }

    SetAll() {
        var copyproduit = document.importNode(Template.content, true).querySelector("div.produit");
        copyproduit.id=this._id;
        copyproduit.querySelector("a").href += "?id=" + this._id;
        copyproduit.querySelector("a canvas").id="lol" + this._id;
        copyproduit.querySelector("h2").innerHTML=this._nom;
        copyproduit.querySelector("p").innerHTML = this._prix + " €";
        copyproduit.querySelector("template").innerHTML = this._tags;
        copyproduit.querySelector("div.personnalisation").id=this._img;
        document.querySelector("div.boutique").append(copyproduit);
        for (let i in this._colors) {
            let division=document.createElement("div");
            division.id=this._colors[i];
            division.addEventListener("mouseover", function (event){
                let colorc=event.target.id;
                let imgc=event.target.parentNode.id;
                let idc =event.target.parentNode.parentNode.id;
                loadProductsImages("lol" + idc, colorc, imgc);

            });
            document.getElementById(this._id).querySelector("div.personnalisation").appendChild(division);
        }
        let rond=document.getElementById(this._id).querySelectorAll("div.personnalisation div");
        rond.forEach( a=>{
            a.style.backgroundColor = a.id;
        });
        loadProductsImages("lol" + this._id, this._colors[0], this._img);
    }

    Initiate(object) {
        this._id = object.id;
        this._img = object.img;
        this._nom = object.nom;
        this._colors = object.colors;
        this._prix = object.prix;
        this._tags = object.tags;
        this.SetAll();
    }
}

function Creat_Tshirt(FichierName) { /* Fonction de l'affichage dynamique des Tshirt */
    let contenu_json = [];
    var Tshirtx = new Tshirt();
    fetch(FichierName)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            contenu_json = json;
        })
        .then(function () {
            k = 0
            while (k < contenu_json.length) {
                Tshirtx.Initiate(contenu_json[k]);
                k += 1;
            }
        })
}


/* Fonction de chargement des pages (header,footer,...)*/
function loader() {
    fetch("header.html")
        .then(response => {
            return response.text();
        })
        .then(data => {
            document.querySelector("header").innerHTML = data;
            liens = document.querySelectorAll("nav a");
            liens.forEach(a => {
                if (a.href == location.protocol + '//' + location.host + location.pathname)
                    a.classList.add('active');
            });
        });
    fetch("footer.html")
        .then(response => {
            return response.text();
        })
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        });
}

window.onload = function () {
    loader();
    if (document.title == "Nos Produits") {
        Creat_Tshirt("../JSON/Data.json");
        Creat_filter();
    } else if (document.title == "Personnalisation") {
        InfoTshirt("../JSON/Data.json");
    } else if (document.title == "Panier") {
        AffichageRecap()
        ajd = GetDate();
        document.getElementById("date").setAttribute("min", ajd);
    }
}

function GetDate() {
    ajd = new Date();
    jour = ajd.getDate();
    mois = ajd.getMonth() + 1;
    annee = ajd.getFullYear();
    heure = ajd.getHours();
    minutes = ajd.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (heure < 10) {
        heure = '0' + heure;
    }
    if (jour < 10) {
        jour = '0' + jour;
    }
    if (mois < 10) {
        mois = '0' + mois;
    }
    ajd = annee + '-' + mois + '-' + jour + 'T' + heure + ':' + minutes + ':00';
    return ajd;
}

function Creat_filter() {
    tagbtn = document.querySelectorAll("div.filtres button");
    tagbtn.forEach(a => {
        a.addEventListener("click", function (event) {
            select("Tag", event.target.innerHTML);
        });
    });
    colorbtn = document.querySelectorAll("div.filtres div div");
    colorbtn.forEach(a => {
        a.addEventListener("click", function (event) {
            select("Color", event.target.id);
        });
    });
}

function InfoTshirt(FichierName) {
    id = new URLSearchParams(window.location.search).get("id");
    let contenu_json = [];
    fetch(FichierName)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            contenu_json = json;
        })
        .then(function () {
            document.querySelector("div.Description h1").innerHTML = contenu_json[id].nom;
            document.querySelector("div.Description p").innerHTML = "Prix : " + contenu_json[id].prix + " €";
            loadProductsImages('Principale', contenu_json[id].colors[0], contenu_json[id].img);
            for (k in contenu_json[id].colors) {
                copy = document.importNode(template.content, true);
                image = copy.querySelector("a");
                if (k == 0) {
                    image.classList.add("active");
                }
                image.addEventListener("click", function (event) {
                    if (event.target.tagName == 'A') {
                        coloris = event.target.querySelector("canvas").id;
                    } else if (event.target.tagName == 'CANVAS') {
                        coloris = event.target.id;
                    }
                    selectcolor(coloris);
                    loadProductsImages('Principale', coloris, contenu_json[id].img);
                });
                image.querySelector("canvas").id = contenu_json[id].colors[k];
                document.querySelector("aside.sidebar").append(image);
                loadProductsImages(contenu_json[id].colors[k], contenu_json[id].colors[k], contenu_json[id].img);
            }
            taillebtn = document.querySelectorAll("div.Description div.Tailles button");
            taillebtn.forEach(a => {
                a.addEventListener("click", function (event) {
                    selectTaille(event.target.innerHTML);
                });
            });
            numberbtn = document.querySelectorAll("div.Description div.Quantite button");
            numberbtn.forEach(a => {
                a.addEventListener("click", function (event) {
                    buttonnumber(event.target.innerHTML);
                });
            });
            ajout = document.querySelector("div.Description div.ajout a")
            ajout.addEventListener("click", function () {
                addarticle(contenu_json[id].img);
            });
        });
}


// Fonction du bouton retour en haut de la page
window.onscroll = function () { scroll() };

function scroll() {
    var topbtn = document.getElementById("scrlbutton");
    topbtn.addEventListener("click", function () {
        document.documentElement.scrollTop = 0;
    });
    if (document.documentElement.scrollTop > 100) {
        topbtn.style.display = "block";
    } else {
        topbtn.style.display = "none";
    }
}

// Fonction de filtrage 
function select(type, value) {
    if (type == 'Tag') {
        Tagactive = document.querySelector("div.filtres button.active");
        Tagactive.classList.remove('active');
        Tag = document.querySelectorAll("div.filtres button");
        Tag.forEach(a => {
            if (a.innerHTML == value) {
                a.classList.add('active');
            }
        })
        Coloractive = document.querySelector("div.filtres div div.active").id;
        Produits = document.querySelectorAll("div.produit");
        Produits.forEach(a => {
            ListeTag = a.querySelector("template.tag").innerHTML.split(',');
            DivRond = a.querySelectorAll("div.personnalisation div");
            e = 0;
            DivRond.forEach(d => {
                if (d.id == Coloractive || Coloractive == 'AllColor') {
                    for (k in ListeTag) {
                        if (ListeTag[k] == value || value == 'AllTag') {
                            e += 1;
                        }
                    }
                }
            })
            if (e > 0) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        })
    } else if (type == 'Color') {
        Coloractive = document.querySelector("div.filtres div div.active");
        Coloractive.classList.remove('active');
        Color = document.querySelectorAll("div.filtres div div");
        Color.forEach(a => {
            if (a.id == value) {
                a.classList.add('active');
            }
        })
        Tagactive = document.querySelector("div.filtres button.active").innerHTML;
        Produits = document.querySelectorAll("div.produit");
        Produits.forEach(a => {
            ListeTag = a.querySelector("template.tag").innerHTML.split(',');
            DivRond = a.querySelectorAll("div.personnalisation div");
            e = 0;
            DivRond.forEach(d => {
                if (d.id == value || value == 'AllColor') {
                    for (k in ListeTag) {
                        if (ListeTag[k] == Tagactive || Tagactive == 'AllTag') {
                            e += 1;
                        }
                    }
                }
            })
            if (e > 0) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        })
    }
}
/* Fonctions de personnalisation */
function selectTaille(value) {
    sizeactive = document.querySelector("div.Tailles button.active");
    sizeactive.classList.remove('active');
    size = document.querySelectorAll("div.Tailles button");
    size.forEach(a => {
        if (a.innerHTML == value) {
            a.classList.add('active');
        }
    })
}

function buttonnumber(value) {
    number = document.querySelector("div.Quantite div.number").innerHTML;
    number = parseInt(number);
    if (value == '-' && number > 1) {
        document.querySelector("div.Quantite div.number").innerHTML = number - 1;
    } else if ((value == '+' && number < 100)) {
        document.querySelector("div.Quantite div.number").innerHTML = number + 1;
    }

}

function selectcolor(value) {
    coloractive = document.querySelector("aside a.active");
    coloractive.classList.remove('active');
    color = document.querySelectorAll("aside a");
    color.forEach(a => {
        color = a.querySelector("canvas").id;
        if (color == value) {
            a.classList.add('active');
        }
    })
}
// Fonction d'ajout au panier
function addarticle(logo) {
    nom = document.querySelector("div.Description h1").innerHTML;
    prix = document.querySelector("div.Description p").innerHTML.split(' ')[2];
    taille = document.querySelector("div.Tailles button.active").innerHTML;
    color = document.querySelector("aside.sidebar a.active canvas").id;
    quantite = document.querySelector("div.Quantite div.number").innerHTML;

    storage_panier(nom, prix, taille, color, quantite, logo);
}

// FONCTION DU STORAGE VERS LE PANIER 
function storage_panier(nom, prix, taille, couleur, quantite, logo) {
    var ListeProduitPanier = localStorage.getItem("ListeProduitPanier");
    var Id = nom + taille + couleur;
    var Produit = {
        nom: nom,
        prix: prix,
        taille: taille,
        couleur: couleur,
        quantite: quantite,
        logo: logo
    };
    var Produit_JSON = JSON.stringify(Produit);
    if (ListeProduitPanier == null) {
        ListeProduitPanier = [];
    } else {
        ListeProduitPanier = ListeProduitPanier.split(',');
    }
    test = 0;
    ListeProduitPanier.forEach(a => {
        if (a == Id)
            test = 1;
    });
    if (test == 0) {
        ListeProduitPanier.push(Id);
        localStorage.removeItem("ListeProduitPanier");
        localStorage.setItem("ListeProduitPanier", ListeProduitPanier);
        localStorage.setItem(Id, Produit_JSON);
    } else {
        Produitexistant_JSON = localStorage.getItem(Id);
        Produitexistant = JSON.parse(Produitexistant_JSON);
        nouvellequantite = parseInt(quantite) + parseInt(Produitexistant.quantite);
        Produitexistant.quantite = nouvellequantite;
        localStorage.removeItem(Id);
        Produitexistant_JSON = JSON.stringify(Produitexistant)
        localStorage.setItem(Id, Produitexistant_JSON);
    }
}

async function AffichageRecap() {
    ListeProduitPanier = localStorage.getItem("ListeProduitPanier");
    if (ListeProduitPanier == [] || ListeProduitPanier == null) {
        p = document.createElement("p")
        p.innerHTML = "Votre panier est vide"
        document.getElementsByClassName("recap")[0].appendChild(p)
    } else {
        PrixTotal = 0;
        ListeProduitPanier = ListeProduitPanier.split(',');
        ListeProduitPanier.forEach(a => {
            copyRecap = document.importNode(Template.content, true).querySelector("div.produit");
            Produit_JSON = localStorage.getItem(a);
            Produit = JSON.parse(Produit_JSON);
            if (Produit != null) {
                Id = Produit.nom + Produit.taille + Produit.couleur;
                copyRecap.getElementsByClassName("Tailles")[0].innerHTML = Produit.taille;
                copyRecap.getElementsByClassName("Quantite")[0].innerHTML = Produit.quantite;
                copyRecap.querySelector("canvas").id = Id;
                if (Produit.quantite >= 10) {
                    reduc = 0.9;
                    copyRecap.getElementsByClassName("Nom")[0].innerHTML = Produit.nom + " *** Réduction***";
                } else {
                    reduc = 1;
                    copyRecap.getElementsByClassName("Nom")[0].innerHTML = Produit.nom;
                }
                
                prixTshirt = reduc * Produit.prix * Produit.quantite;
                prixTshirt = Math.round(prixTshirt*100)/100;
                PrixTotal += prixTshirt;
                copyRecap.getElementsByClassName("Prix")[0].innerHTML = prixTshirt + " €";
                copyRecap.getElementsByTagName("button")[0].id = a;
                copyRecap.querySelector("button").addEventListener("click", function (event) {
                    ListeProduitPanier.splice(ListeProduitPanier.indexOf(event.target.id), 1);
                    localStorage.removeItem(event.target.id);
                    localStorage.removeItem("ListeProduitPanier");
                    localStorage.setItem("ListeProduitPanier", ListeProduitPanier);
                    window.location.reload();
                });
                document.getElementsByClassName("recap")[0].append(copyRecap);
                loadProductsImages(Id, Produit.couleur, Produit.logo);
            }
        });
        boutonvalider = document.createElement("div");
        boutonvalider.classList.add("valider");
        btn = document.createElement("button");
        btn.innerHTML = "Valider la commande";
        if (window.location.href != "http://127.0.0.1:5500/HTML/Panier.html") {
            CooGPS();
            var PrixDistance = await CooGPS()
            PrixdeLivraison = deliverP() + PrixDistance;
            PrixTotal += PrixdeLivraison;
            divLivraison = document.createElement("p");
            divLivraison.innerHTML = "Cout de Livraison " + PrixdeLivraison + " €";
            document.querySelector("div.recap").appendChild(divLivraison);
            divPrixTotal = document.createElement("p");
            divPrixTotal.innerHTML = "Prix Total " + PrixTotal + " €";
            document.querySelector("div.recap").appendChild(divPrixTotal);
            btn.addEventListener("click", function () {
                resetPanier()
                window.location.reload();
            });
        } else {
            btn.addEventListener("click", function () {
                continuer();
            });
        }
        boutonvalider.appendChild(btn);
        document.querySelector("div.recap").appendChild(boutonvalider);
    }
}

function continuer() {
    document.querySelector("div.recap").style.display = "none";
    document.querySelector("div.formulaire").style.display = "block";
}


function deliverP() {
    deliver = new URLSearchParams(window.location.search).get("Date");
    deliverListe = deliver.split('-');
    deliverDay = deliverListe[2].split('T')[0];
    deliverHour = deliverListe[2].split('T')[1] + ":00";
    DeliverDate = deliverListe[1] + " " + deliverDay + " " + deliverListe[0] + " " + deliverHour;
    ActualDate = new Date();
    DeliverDate = new Date(DeliverDate);
    a = ((DeliverDate.getTime() - ActualDate.getTime()) / 86400000).toFixed(0);
    if (a >= 3) {
        deliverprice = 0;
    } else {
        deliverprice = 8;
    }
    return deliverprice;
}

async function CooGPS() {
    const Pays = new URLSearchParams(window.location.search).get("Pays");
    const Adresse = new URLSearchParams(window.location.search).get("Addresse");
    const Ville = new URLSearchParams(window.location.search).get("Ville");
    const Zip = new URLSearchParams(window.location.search).get("Zip");
    const AdresseTot = Adresse + " " + Ville + " " + Pays + " " + Zip;
    AdressTot2 = encodeURIComponent(AdresseTot);
    const url = "https://api.mapbox.com/geocoding/v5/" + "mapbox.places" + "/" + AdressTot2 + ".json" + "?access_token=sk.eyJ1Ijoib3Jhbml1bSIsImEiOiJja3ZsNHJ3NHcybW5uMnBxNTgyZ2NuNHFpIn0.jvH44nTouDHCugCmMDdyjQ";
    const x = 0;
    const y = 0;
    var CoutLivraison = 0
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(async function (json) {
            const y = json.features[0].center[0];
            const x = json.features[1].center[1];
            CoutLivraison = await DistanceGPS(x, y);
        })
    return CoutLivraison
}
async function DistanceGPS(x, y) {
    const adresse1 = "45.75889" + "," + "4.855356";
    const adresse2 = x + "," + y;
    url = "https://api.mapbox.com/directions/v5/" + "mapbox/driving/" + adresse1 + ";" + adresse2 + "?steps=true&geometries=geojson&access_token=sk.eyJ1Ijoib3Jhbml1bSIsImEiOiJja3ZsNHJ3NHcybW5uMnBxNTgyZ2NuNHFpIn0.jvH44nTouDHCugCmMDdyjQ";
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(function (json) {
            d = json.routes[0].distance;
            d = (d / 1000);
            if (d >= 20) {
                CoutLivraison = (5 + 0.07 * d).toFixed(2);
            } else {
                CoutLivraison = 0;
            }
        })
    return parseInt(CoutLivraison);
}


function resetPanier() {
    ListeProduitPanier = localStorage.getItem("ListeProduitPanier");
    ListeProduitPanier = ListeProduitPanier.split(',');
    ListeProduitPanier.forEach(a => {
        localStorage.removeItem(a);
    });
    localStorage.removeItem("ListeProduitPanier");
}

function loadProductsImages(id, color, liens) {
    let logo_img = new Image();
    logo_img.onload = () => {
        frgd_img = new Image();
        frgd_img.onload = () => {
            bkg_img = new Image();
            bkg_img.onload = () => {
                drawImages(id, color, logo_img);
            }
            bkg_img.src = "../Images/Back.png";
        }
        frgd_img.src = "../Images/Front.png";
    }
    logo_img.src = liens;
}

function drawImages(id, color, logo_img) {
    canvas = document.getElementById(id);
    context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1000;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bkg_img, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.6;
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.drawImage(frgd_img, 0, 0, canvas.width, canvas.height);
    context.drawImage(logo_img, 250, 400, 300, 300);

}