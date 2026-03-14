# Beerpong Premier League - Hotfix final

## Spuštění
npm install
npm run dev

## Důležité
Aby se už při registraci ukazovaly registrované týmy, nestačí jen nový ZIP.
Musíš ve Firebase nasadit i přiložený soubor `firestore.rules`.

## Firestore rules
Nahraj přes Firebase Console nebo Firebase CLI tento obsah:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{playerId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }

    match /matches/{matchId} {
      allow read: if true;
      allow create, update: if request.auth != null;
    }

    match /matchEvents/{eventId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}

## Co je opravené
- profil je vizuálně lepší
- dlouhý název týmu se vejde do boxu
- profil už se nenačítá stylem „nejprve se přihlas“ při běžném refreshi
- při registraci se ukazují registrované týmy
- při změně týmu v profilu se ukazují registrované týmy
- home má víc herní beerpong styl
"# premierleague"  
"# premierleague"  
