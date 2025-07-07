## Auth

- Fares El Kolli.

# Platforme ImmoQuebec

Plateforme web complète de gestion immobilière, développée dans le cadre du projet de session **INM 5151** à l’UQAM.

## Technologies utilisées

- **Backend** : Spring Boot (Java 17, Maven)
- **Frontend** : Angular 18
- **Base de données** : PostgreSQL
- Sécurité : Spring Security + JWT
- Migration DB : Flyway

---

##  Démarrage local

###  1. Backend (Spring Boot)

```bash
cd backend/immoquebec
mvn spring-boot:run
```

Accès via : http://localhost:8080

---

###  2. Frontend (Angular)

```bash
cd frontend/homehistory
npm install
ng serve
```

Accès via : http://localhost:4200

---

## Structure du projet

```
ImmoQuebec-Platform/
│
├── backend/
│   └── immoquebec/         # Projet Spring Boot
│
├── frontend/
│   └── immoquebec/        # Application Angular
│
├── .gitignore
└── README.md
```

---

## Configuration

Pour exécuter ce projet, insérez dans fichier `src/environments/environment.ts` vos propres clés Firebase.

Les clés API ne sont incluses dans ce dépôt pour des raisons de sécurité.

---

##  Licence

Projet académique 
