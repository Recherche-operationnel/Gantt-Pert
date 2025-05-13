# TP2: Diagrammes de Gantt et PERT
Le but du projet? Visualiser les diagrammes de Gantt et PERT pour lles activités d'un projet spécifique. un projet

## Guide pratique
Comment avoir et lancer le projet?

1. Cloner le projet GitHub
```bash
git clone https://github.com/Recherche-operationnel/Gantt-Pert.git

```

2. Installer les dépendances
```bash
npm install 

```

3. Exécuter le projet
```bash
npm run dev

```
4. Accéder à l’application via : http://localhost:3000

## Comprendre le projet
Une fois que j'ai le projet que faire? Voici comment fonctionne le projet:

### Le routage
Le routage des pages est automatique. Pour ajouter une nouvelle route, il suffit de créer un dossier contenant un fichier page.tsx dans le repertoire app/, la route créé est la route /nom_du_dossier.

### Le style
Le style est le tailwindcss pour l'utiliser on écrit directement dans l'attribut classname des balises des fichiers page.tsx.
Exemple:

```js
\\ /src/app/page.tsx
\\Le debut du code ici
return(
    <section className="py-12 px-6">
        <h3 className="text-2xl font-semibold text-center mb-8">Nos Activités</h3>
    </section>
);
```

### Les images
Une image qui se trouve dans le dossier public de la racine du projet peut etre appelé directement dans la balise 

```js
<Image
    src='/images/projet.jpg'
    alt={project.title}
    width={300}
    height={200}
    className="rounded-lg object-cover"
/>
```

### Le modal
Dans le dossier des components il y a un fichier nommé **modal.tsx** il s'agit d'un composant générique pour les modals dans le projet.

### Les services
Des services ont été créés pour centraliser les opérations relatives aux entités du projets. C'est dans ces fichiers qu'on écrit les fonctions qui vont etre utilisés pour récupérer les innformations du Backend.

### Les fakes data
Pour un début, en attendant le backend, on va utiliser les fakes data qui se trouvent dans le dossier data(pour faire comme si). On va également les utiliser dans les services une fois que le Backend sera disponible, on va changer les urls des fakes data par celles du Backend.

## Le taff à faire


## Toujours Tester
La suite? Les tests. Chaque fois que vous faites une page assurez vous qu'elle marche avec les fakes data selon le modèle que je vais vous présenter.

## Comment collaborer?
On va éssayer de faire un travail collaboratif en se basant sur la coopération(ça a l'air bizarre dit comme ça).

Pour commencer, 
- on a qu'une seule branche. 
- Chacun ne va modifier que les fichiers relatifs à sa tache ou pour que ce soit plus simple à son entité.
- Avant de push, il est nécessaire de faire un pull du contenu présent sur github.
- En cas de problème le signaler dans groupe, pas d'héroïsme, on apprend tous et on peut faire des erreurs.

## Répartition du travail

Pour TPD:
- Le composant de la vue standard d'un projet ( pour acceder à cette page en attendant la redirection ajoute /projectViews)
- Le modal qui contient le formulaire d'ajout d'une activité et L'ajout automatique dans le tableau
- Le composant de la vue du diagramme de PERT

Pour TK:
- La page d'affichage de la liste des projets (ajouter la redirection vers le projet lorsqu'on clique sur le projet)
- Le modal du formulaire de création d'un projet avec l'ajout automatique du projet créé dans la liste et la redirection automatique vers la page des vues du projets
- Le composant de la vue du diagramme de Gantt

Pour NC:
- Initialiser le projet
- La Landing Page
- Donner les taches

## Licence

Ce projet est sous licence MIT.  
Vous êtes libres de l’utiliser, le modifier, le partager, même à des fins commerciales.  
La seule condition : conserver la mention de l’auteur original.

Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

