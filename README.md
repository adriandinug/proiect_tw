# Proiect TW - Notes App

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
