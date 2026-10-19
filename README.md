# StudySprint

**Connect your notes. Remember what matters.**
<img width="1720" height="1228" alt="image" src="https://github.com/user-attachments/assets/6a9f4d6d-da12-4fee-97fc-f306a3d29fe7" />

---

### ⚔️ Gamified Active Recall: Adventure Mode
<img width="1580" height="780" alt="image" src="https://github.com/user-attachments/assets/d8938173-19da-43d2-afe6-a3ec41d22adb" />


<img width="1576" height="604" alt="image" src="https://github.com/user-attachments/assets/b512fa24-239b-48c0-9570-870cc3354de7" />


StudySprint transforms active recall into an interactive monster-taming RPG battle system. Rather than reviewing static flashcards, your study notes and concepts spawn as encounters in the wild[cite: 7].

* **Concepts as Creatures:** Every encounter draws directly from your active flashcard deck, manifesting study concepts as wild creatures (e.g., *Wild Evidence*)[cite: 7].
* **Type-to-Attack Mechanics:** 
  * Deal damage to the creature's HP bar by recalling and typing the answer[cite: 7].
  * Correct answers defeat the creature and add it to your permanent **Collection**[cite: 7, 8].
* **High-Stakes Spaced Repetition:**
  * **Adventurer Health (HP):** You start each run with a health pool[cite: 7].
  * **Three-Strike Rule:** Three incorrect answers drop your Adventurer HP to zero, triggering party exhaustion and ending the battle[cite: 7, 8].
  * **Spaced Repetition Integration:** Battle outcomes (wins, misses, and defeats) automatically adjust the card's review schedule in your spaced repetition queue[cite: 8].
* **Progression System:** Gain experience points (XP) to level up your adventurer profile and track caught creatures in your compendium[cite: 7].

---

A persistent study application for your own material: document uploads with OCR, original-file and split readers, linked Markdown notes, source-based flashcard drafts, approval, FSRS reviews, version history, and portable backups including original files. No sample workspace or canned generation is included.

Requires Node 22.13+, Python 3.14, Tesseract, and LibreOffice for document conversion. See [STUDYSPRINT.md](STUDYSPRINT.md) for setup, configuration, test commands and current limitations.

### Document conversion and annotations

The Original reader supports highlights, underlines, comments and freehand drawing with recoverable autosave, undo/redo and flattened annotated-PDF downloads. Converted notes retain private image assets; Improve conversion offers a review before saving a new Markdown revision. ZIP backups now use v3 and retain originals, PDF bases, images, annotations and revisions; v2 ZIP and v1 JSON restores remain supported. Markdown note bundles carry PNG/JPEG image files. See [converter setup and verification](converter/README.md).
Requires Node 22.13+. See [STUDYSPRINT.md](STUDYSPRINT.md) for setup, configuration, test commands and current limitations.

For live English dictation on an Apple Silicon Mac and a free public judges’ link, see [JUDGES.md](JUDGES.md). Speech recognition runs locally through WhisperLiveKit/MLX; no paid transcription API is required.
