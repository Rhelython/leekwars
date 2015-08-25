#Leek Wars Editor Custom Documentation

Bonjour à tous,

En ayant assez de devoir sans arrêt parcourir mes différentes IA pour retrouver la signature exacte d'une de mes fonctions ou me rappeler toutes leurs fonctionnement, j'ai écrit un UserScript (testé sur Chrome avec TamperMonkey) qui permet d'afficher dans la pop-up d'auto-complétion la documentation de mes propres fonctions.

La documentation est écrite dans le style Javadoc (cf. les exemples)
Je n'y ai passé que quelques heures pour l'instant donc n'hésitez pas à me signaler des bugs ou des améliorations possibles.


## Lien de téléchargement :
https://github.com/Rhelython/leekwars/raw/master/leekwars_v2_custom_documentation.user.js



Ce projet est un fork. L'auteur du projet original est AluCardDH, accessible à cette url :
https://github.com/AluCardDH/leekwars/raw/master/leekwars_v2_custom_documentation.user.js

L'objectif de ce fork est d'être au plus près du code original tout en ajoutant des fonctionnalités qui me manquent et qui peuvent peut-être intéressé plus de monde.


### Exemples
Et puisque des petites images valent mieux que des longs discours, voici des exemples :

v0.1 :

https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_function.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_function2.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_var.JPG
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_global.jpg

v0.3 :

https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_completion_plus.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_completion_parameters.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_completion_parameters2.jpg

v0.4 :

https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_global2.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_ops.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_ops2.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_ops3.jpg

v0.6.2 :
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_coloration.jpg
https://raw.githubusercontent.com/Rhelython/leekwars/master/examples/ex_new_tags.jpg


## Note de version :
### v 0.6.2 (2015-08-25) :
+ Ajout de la coloration des paramètres
+ Ajout des tags @author, @date, @version, @exceptions, @require, @pre, @post, @url, @reference
* Lisibilité de la popup de documentation 'améliorée' (les goûts et les couleurs hein ..)

