# Rebranding: logo „Ember Dot" pentru Deep Blue

## Concept
Un singur punct cald (ember) — ultra-minimalist, în contrast semantic total cu numele „Deep Blue" (rece, greu, sub apă). Punctul este căldura, energia, vocea. Fără albastru nicăieri.

## Mark
- Un cerc perfect (sau punct ușor dinamic — ex. cu o mică tăietură/accent opțional) în gradient Ember → Amber
- Construcție geometrică curată, grid clar, funcționează la orice dimensiune (favicon → poster)
- Variante: brand (gradient), mono ink, reversed light
- Lockup: punct + wordmark „deep blue" în Sora, punctul poate juca și rol de diacritic/punct final în lockup

## Implementare
1. **Refacere `src/components/Logo.tsx`** — noul SVG Ember Dot + lockup orizontal; export PNG-uri high-res (brand, mono, reversed)
2. **Favicon & app icons** — `public/favicon.png` + `apple-touch-icon.png` regenerate din noul mark
3. **Brand book PDF actualizat** — regenerez `/mnt/documents/Deep-Blue-Brand-Book.pdf` cu noul logo:
   - Pagina „The Mark": construcție, grid, lockup-uri
   - Pagina „Misuse": interdicții actualizate
   - Toate paginile unde apare logo-ul vechi (cover, UI application)
   - Narațiunea de semantic contrast rămâne — devine chiar mai puternică cu punctul
4. **Assets export** — PNG-uri high-res în `/mnt/documents/deep-blue-logo/`
5. **Verificare vizuală** — screenshot pe ecranul de auth + QA pagină cu pagină pe PDF

## Tehnic
- Mark-ul: cerc SVG cu `fill="url(#emberGrad)"` — gradientul există deja în tokens
- PDF: regenerez cu `reportlab` din scriptul existent `/tmp/brand/book.py`, actualizând secțiunile de logo
- Fonts: Sora + Manrope rămân neschimbate; paleta Ember/Amber/Cream/Bone/Ink rămâne
