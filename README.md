# Farmbot-Weather-Server
Une interface permettant de visualiser les données météo ainsi que de gérer l'arrosage automatique du Farmbot de l'INSA Rennes



[![Contributors][contributors-shield]][contributors-url]

## Table des matières

* [A propos du projet](#a-propos-du-projet)
* [Technologies utilisées](#technologies-utilisées)
* [Mise en place](#mise-en-place)
  * [Prérequis](#prérequis)
  * [Installation](#installation)
* [Contact](Contact)

## A propos du projet


### Technologies utilisées

* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/)
* [FarmbotJS](https://github.com/FarmBot/farmbot-js)


## Mise en place

Envie de déployer cette interface pour votre FarmBot ?

### Prérequis

* [Docker Engine](https://docs.docker.com/engine/install/)

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

<!-- CONTACT -->
## Contact

Pablo Cancoin - pablo.cancoin@gmail.com
[contributors-shield]: https://img.shields.io/github/contributors/pcancoin/Farmbot-Weather-Server?style=flat-square
[contributors-url]: https://github.com/pcancoin/Farmbot-Weather-Server/graphs/contributors
