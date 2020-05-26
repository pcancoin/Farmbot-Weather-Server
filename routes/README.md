# Routes

:warning: **Toutes les routes doivent être précédées de ```/api```**

| Méthode |             Route            |                                                      Fonction                                                     |
|:-------:|:----------------------------:|:-----------------------------------------------------------------------------------------------------------------:|
|         |                              |                                                    **Farmbot**                                                    |
|   GET   |        ```/farmbot```        | Renvoie les 25 dernières lectures du capteur initialisé dans les paramètres (Tableau format ```[{"date":"0", value:0}]```) |
|         |                              |                                                    **Darksky**                                                    |
|   GET   |        ```/darksky```        |                                Renvoie les principales informations météorologiques                               |
|   GET   | ```/darksky/precipitation``` |                    Renvoie les précipitations des 24 prochaines heures, formatées pour un graph                   |
|         |                              |                                                    **Arrosage**                                                   |
|   GET   |        ```/arrosage```       |                                         Renvoie les 10 derniers arrosages                                         |
|   POST  |        ```/arrosage```       |                                              Crée un nouvel arrosage                                              |
|   GET   |      ```/arrosage/run```     |                                                  Lance l'arrosage                                                 |
|         |                              |                                                    **Réglages**                                                   |
|   GET   |        ```/settings```       |                                            Renvoie les réglages actuels                                           |
|   POST  |        ```/settings```       |                                                Modifie les réglages                                               |
|         |                              |                                                **Authentification**                                               |
|   POST  |       ```/auth/login```      |                                          Callback pour l'authentification                                         |
|   GET   |      ```/auth/logout```      |                                              Déconnecte l'utilisateur                                             |
|   GET   |   ```/auth/current_user/```  |                                  Renvoie l'utilisateur courant, ```null``` sinon                                  |