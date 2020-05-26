
# Models

* Arrosage : 
	* **Date** date : Date de l'arrosage
	* **Number** humidite : Humidité lors du lancement de l'arrosage.
	* **Number** indicateurMeteo : Indicateur (probabilité de précipitation * intensité prévu) lors du lancement de l'arrosage.

* Setting :
	* **Number** toolID : ID de l'outil d'arrosage
	* **Number** sequenceMountToolID : ID de la séquence qui s'occupe de monter l'outil d'arrosage
	* **Number** sequenceUnmountToolID : ID de la séquence qui s'occupe de démonter l'outil d'arrosage
	* **Number** sensorPin : Pin du capteur d'humidité (sur le Farmduino)
	* **Number** valvePin : Pin de l'électrovanne (sur le Farmduino)
	* **Number** humidityThreshold : Seuil d'humidité à partir duquel arroser
	* **Number** waterNeed : Besoin en eau d'une plante (mm d'eau)
	* **Number** lat : Latitude du robot
	* **Number** long : Longitude du robot

* User
	* **String** username
	* **String** password
	* **Date** date