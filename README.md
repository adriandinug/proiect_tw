# Proiect TW - Notes App

## Instructiuni rulare

1. cd back -> npm install -> nodemon index.js
2. cd front -> npm install -> npm start
3. Intram pe "http://localhost:3000/api/setdb" pentru a crea baza de date
4. Ne logam cu un cont de google
5. Pe pagina de homepage avem mai multe optiuni, printre care:
   - cautare prieteni pentru a-i adauga si a partaja notite
   - crearea unei noi notite
   - putem sa ne alaturam unui grup scriindu-i numele si sa putem sa vedem notitele partajate de alti membrii
   - putem sa creem noi un grup
6. Pe pagina de notite avem o lista cu toate notitele noastre, putem sa le editam sau sa le stergem
7. Pe pagina de profil vedem cateva date generale despre utilizatorul nostru si putem sa ne deconectam

### Specificatii

- Logare cu adresă instituțională
- Structurare și filtrare notițe în funcție de materii, de dată calendaristică (dată creare și ultima modificare) etc.
- Căutare notițe în funcție de etichete, cuvinte cheie etc.
- Adăugare, modificare și ștergere notițe
- Posibilitate de adăugare a atașamentelor (fișiere, imagini etc.) în notițe
- Integrare conținut Youtube
- Implementare sistem markdown
- Opțiune de creare grupuri între utilizatori pentru partajarea notițelor

### Plan

**Prezent - 05.12.2022**

- Front-end aplicație
- Servicii RESTful
- Instructiuni de rulare

### Final

**05.12.2022 - 16.01.2023**

- Restul aplicației

### Endpoints

**user id** este de fapt un JWT ce contine id-ul utilizatorului semnat cu un secret de pe server

#### /api/user :

**GET** user

- /api/user/:id (user id)

**DELETE** user

- /api/user/:id (user id + token poate)

#### /api/user/notes :

**GET** all notes

- /api/user/notes/:id (user id)

**GET** one note

- /api/user/note/:id (note id)

**DELETE** one note

- /api/user/note/:id (note id)

**PUT**(update) one note

- /api/user/note/:id (note id)

**POST** one note

- /api/user/note (toate detaliile in req body)
