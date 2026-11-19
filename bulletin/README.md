# Bulletin scolaire — reproduction HTML/CSS

Reproduction fidèle du bulletin de la **2ème période** de **PIERRE KOIVOGUI** (Complexe Scolaire Franco-Guinéen « LA MAME PLUS », année 2025-2026).

## Ouvrir

```bash
cd bulletin
python3 -m http.server 8765
# puis ouvrir http://127.0.0.1:8765/
```

Ou ouvrir directement `index.html` dans un navigateur.

## Contenu

- `index.html` — structure du bulletin
- `styles.css` — mise en page A4 (210×297 mm), couleurs et typographie calquées sur le PDF
- `assets/` — en-tête, QR code, courbe de progression, filigrane

## Impression

Utiliser **Imprimer → Enregistrer au format PDF** (format A4, marges « aucune ») pour un rendu proche du document original.
