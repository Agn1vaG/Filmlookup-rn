# MovieApp

React Native + Expo Router application for searching movies, viewing details, handling user authentication, and saving titles. TMDB powers data. Appwrite handles users and storage. Navigation is file-based under the `app/` directory.

---

## Features
- Movie search from TMDB  
- Movie detail pages (`app/movies/[id].tsx`)  
- User login and signup with Appwrite  
- Save and unsave movies  
- Tab navigation using Expo Router  
- Tailwind (nativewind) styling  

---

## Project Structure

```
MOVIEAPP/
 ├─ app/
 │   ├─ (tabs)/
 │   │   ├─ _layout.tsx
 │   │   ├─ index.tsx
 │   │   ├─ profile.tsx
 │   │   ├─ save.tsx
 │   │   └─ search.tsx
 │   ├─ movies/
 │   │   ├─ [id].tsx
 │   │   └─ _layout.tsx
 │   ├─ login.tsx
 │   └─ signup.tsx
 ├─ assets/
 ├─ components/
 ├─ constants/
 ├─ interfaces/
 ├─ services/
 ├─ types/
 ├─ .env
 ├─ package.json
 ├─ tailwind.config.js
 ├─ postcss.config.js
 ├─ tsconfig.json
 └─ README.md
```

---

## Installation
npm install
npx expo start

---

## Environment Variables  
Create a `.env` file:
EXPO_PUBLIC_TMDB_API_KEY=d2945534190db6cc1a2c97091d113ad8
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1

Expo requires the `EXPO_PUBLIC_` prefix for client-side variables.

---

## Build (Android)
expo build:android

---

## Requirements
- Node.js  
- Expo CLI  
- TMDB API key  
- Appwrite project (Users + Database)  

---

## Notes
- All screens in `app/` must export a default React component.  
- Saved-movie functionality depends on correct Appwrite queries.  
- TMDB calls must use the `EXPO_PUBLIC_TMDB_API_KEY`.  
- The Expo Router navigation relies strictly on the folder layout.  

---

## License
MIT

