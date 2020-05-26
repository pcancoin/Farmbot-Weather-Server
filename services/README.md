# Services

## Arrosages

Permet de **récupérer les derniers arrosages** ou d’en créer de nouveaux afin de les afficher par la suite dans l’interface météo.

## Darksky

Permet d’effectuer des **requêtes sur l’API DarkSky** et de récupérer ses données météo, notamment l’intensité et la probabilité des précipitations à venir.

## FarmbotApi

Permet d’effectuer des **requêtes sur l’API de FarmBot**.

Ce service permet de récupérer les données du capteur d’humidité, d’obtenir des informations sur toutes les plantes enregistrées, sur les séquences, ainsi que sur les outils du FarmBot. Il permet aussi de récupérer les pins et les ID nécessaires à l’initialisation des paramètres de l’interface météo. La fonction initToken() prend en paramètres l’adresse e-mail et le mot de passe du compte relié à FarmBot afin de créer le token qui autorisera l’accès à l’API. 

## FarmbotControl

Permet de **contrôler le robot**.

Ce service permet principalement de déplacer le robot, d’arroser, de monter et démonter l’outil d’arrosage, et de lire la valeur du capteur d’humidité. La fonction retrieveTokenAndConnect() permet, de la même manière que initToken(), de récupérer le token du compte FarmBot, pour ensuite se connecter au robot grâce à celui-ci. 

## Passport

## Settings

Permet d’**initialiser les réglages**, de les **récupérer**, et de les **modifier**.
