# :partly_sunny: :seedling: Farmbot-Weather-Server :seedling: :partly_sunny:

Une interface permettant de visualiser les données météo ainsi que de gérer l'arrosage automatique du Farmbot de l'INSA Rennes

:warning: **Ce repository contient uniquement le code de la partie serveur, le code client se situe ici : [Farmbot-Weather-Client](https://github.com/pcancoin/Farmbot-Weather-Client)**

## Table des matières

-   [A propos du projet](#a-propos-du-projet)
    -   [L'équipe](#léquipe)
    -   [Technologies utilisées](#technologies-utilisées)
    
-   [Mise en place](#mise-en-place)
    -   [Prérequis](#prérequis)
    -   [Fichier environnement](#fichier-environnement)
    -   [Installation](#installation)
    
-   [Architecture du code](#architecture-du-code)
-   [Contact](#contact)

## A propos du projet

FarmBot est un robot potager. Il permet de prendre soin des plantes à distance en autonomie. Dans le cadre des études pratiques de l'INSA Rennes, nous, quatre étudiants en Informatique, avons pu travailler sur ce robot afin d'héberger notre propre [serveur pour la gestion du FarmBot](https://developer.farm.bot/docs/web-app) sur un VPS de l'INSA, évitant de passer à chaque fois par les serveur de la compagnie situés aux Etats Unis. Nous avons aussi ajouté une fonctionnalité d'arrosage automatique ainsi qu'une interface web pour gérer celui-ci, dont le code se trouve sur le repository où vous vous trouvez actuellement.

### L'équipe

Quatre étudiants en informatique en 3ème année INSA Rennes :

-   Juliette BONNARD - juliette99bonnard@hotmail.fr
-   Manuel POISSON - mpoissonmanuel@gmail.com
-   Pierre DUC-MARTIN - contact@pierredm.fr
-   Pablo CANCOIN - pablo.cancoin@gmail.com

### Technologies utilisées

-   [NodeJS](https://nodejs.org/en/)
-   [ExpressJS](https://expressjs.com/)
-   [FarmbotJS](https://github.com/FarmBot/farmbot-js)
-   [MongoDB](https://www.mongodb.com/) avec [Mongoose](http://mongoosejs.net/)

## Mise en place

Envie de déployer cette interface pour votre FarmBot ?

### Prérequis

-   [Docker Engine](https://docs.docker.com/engine/install/)

### Fichier environnement

-   `darkskyKey` : Clé API [Darksky](https://darksky.net/) pour récupérer les données météo
-   `mongodb` : URL de connexion au serveur MongoDB (par défaut `mongodb://mongodb:27017`, pour une configuration locale avec Docker)
-   `cookieKey` : Clé secrète pour les cookies (ex générée avec `openssl rand -hex 64`)
-   `serverUrl` : URL sur laquelle est déployée [Farmbot-Web-App](https://github.com/FarmBot/Farmbot-Web-App/) (pour les accès à l'API FarmBot)
-   `farmbotMail` : Mail de connexion au serveur [Farmbot-Web-App](https://github.com/FarmBot/Farmbot-Web-App/) (pour les accès à l'API FarmBot)
-   `farmbotPassword` : Mot de passe de connexion au serveur [Farmbot-Web-App](https://github.com/FarmBot/Farmbot-Web-App/)
-   `adminPass` : Mot de passe de connexion à l'interface météo, pour le compte **admin** créé lors du déploiement du serveur

### Installation

1. Cloner le repository du serveur :

```sh
git clone --depth=1 https://github.com/pcancoin/Farmbot-Weather-Server.git
```

2. Rentrer dans le dossier

```sh
cd Farmbot-Weather-Server/
```

3. Créer le fichier .env

```sh
cp .env.example .env
```

4. :warning: Bien remplir tous les champs du .env

5. Build et lancement du serveur

```sh
sudo docker-compose up -d
```

## Architecture du code

<!--### Différents dossiers-->

-   _gestionArrosage/_ : Contient le code principal de l'arrosage automatique, qui vérifie s'il faut arroser et donne les ordres au robot
-   _middlewares/_ : Regroupe les différents [middlewares](http://expressjs.com/en/guide/using-middleware.html)
-   _models/_ : Différents modèles utilisés pour le stockage de données (librairie [Mongoose](http://mongoosejs.net/))
-   _node_modules/_ : Toutes les dépendances du projets, installées avec `npm install`
-   _routes/_ : Différentes routes ou URI que désert le serveur
-   _services/_ : Différents services utilisés par le serveur web et/ou par la gestion de l'arrosage automatique

-   _index.js_ : Fichier principal, lie le serveur à l'arrosage automatique

## Contact

Pablo Cancoin - pablo.cancoin@gmail.com
