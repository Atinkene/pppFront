# PPP Project - Frontend

Ce dépôt contient le frontend du projet PPP, une application de gestion de dossiers patients médicaux.

## Prérequis

- Node.js >= 16.x
- npm >= 8.x ou yarn
- Un backend compatible (voir [PPP Project - Backend](https://github.com/Atinkene/PPP))

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-utilisateur/ppp-front.git
   cd ppp-front
   ```

2. Installez les dépendances :

   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuration

- Copiez le fichier `.env.example` en `.env` et adaptez les variables si besoin (URL de l’API backend, etc).

## Lancement en développement

```bash
npm start
# ou
yarn start
```

L’application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts utiles

- `npm run build` : build de production
- `npm run lint` : lint du code
- `npm run test` : lancer les tests unitaires

## Structure du projet

- `src/components/` : composants React (DossierViewer, etc)
- `src/services/` : appels API
- `src/contexts/` : contextes React (authentification, etc)
- `src/utils/` : fonctions utilitaires
- `src/App.jsx` : point d’entrée principal

## Fonctionnalités principales

- Consultation et gestion des dossiers patients
- Gestion des sous-dossiers (admissions, examens, imagerie, etc)
- Upload d’images DICOM pour les examens d’imagerie
- Authentification par rôle (médecin, radiologue, etc)
- Interface responsive

## Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-feature`)
3. Commitez vos modifications (`git commit -am 'Ajout de ma feature'`)
4. Pushez la branche (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

## Licence

MIT

---

**Contact** : Atinkene