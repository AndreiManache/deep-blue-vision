# Logo color revision: from Ember Dot to Ink Dot

## Problem
The current logo and the voice action orb both use the warm Ember→Amber gradient, so the home screen reads as one large amber shape. The brand mark needs to become a quieter counterpoint.

## Decision
Render the dot in the same warm near-black as the wordmark: the **Ink** token (`#1a130f`). The voice orb keeps the Ember→Amber gradient as the single warm focal point and primary action.

## What will change

1. **Logo component** (`src/components/Logo.tsx`)
   - Replace the radial Ember→Amber gradient with a solid Ink fill.
   - Keep the circular geometry and lowercase wordmark lockup.
   - Add a subtle, non-amber hover/active state if needed.

2. **Static assets**
   - Regenerate `public/favicon.png` and `public/apple-touch-icon.png` with an Ink dot.
   - Re-export high-res logo assets to `/mnt/documents/deep-blue-logo/` in Ink, mono ink, and light variants.

3. **Brand book PDF**
   - Rewrite `/mnt/documents/Deep-Blue-Brand-Book.pdf` to show the mark in Ink.
   - Update the construction and misuse pages to reference the new color.
   - Keep the "semantic contrast" story, but shift the warmth narrative to the voice orb.

4. **Project memory**
   - Update the logo rule from "radial ember→amber gradient" to "single Ink circle; Ember/Amber warmth reserved for the voice action orb."

5. **Verification**
   - Browser preview of the home header and auth screen to confirm the logo no longer adds amber to the page.
