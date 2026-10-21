# StudySprint

**Connect your notes. Remember what matters.**

<img width="1720" height="1228" alt="image" src="https://github.com/user-attachments/assets/6a9f4d6d-da12-4fee-97fc-f306a3d29fe7" />

A persistent study application for your own material: document uploads with OCR, original-file and split readers, linked Markdown notes, source-based flashcard drafts, approval, FSRS reviews, version history, and portable backups including original files. No sample workspace or canned generation is included.

Requires Node 22.13+, Python 3.14, Tesseract, and LibreOffice for document conversion. See [STUDYSPRINT.md](STUDYSPRINT.md) for setup, configuration, test commands, and current limitations.


### Key Features

* **Gamified Active Recall (Adventure Mode):** Turns flashcard decks into monster-taming encounters where typing answers damages creature HP and three strikes end the battle[cite: 7, 8]. Results feed directly into the FSRS spaced repetition engine[cite: 8].
* * **Semantic Concept Graphs:** Automatically extracts key ideas from lecture notes and clusters them into concentric similarity rings (High, Medium, Low) using text similarity. Allows interactive editing of links and supporting text before syncing concepts directly into a global, force-directed knowledge graph.
* **Document Conversion & Annotations:** The Original reader supports highlights, underlines, comments, and freehand drawing with recoverable autosave, undo/redo, and flattened annotated-PDF downloads. Converted notes retain private image assets.
* **Portable Backups:** v3 ZIP backups retain originals, PDF bases, images, annotations, and Markdown revision histories (v1 JSON and v2 ZIP restores remain supported).
* **Local Dictation:** Live English speech recognition runs locally via WhisperLiveKit/MLX on Apple Silicon without third-party transcription APIs (see [JUDGES.md](JUDGES.md)).



### Document conversion and annotations

The Original reader supports highlights, underlines, comments and freehand drawing with recoverable autosave, undo/redo and flattened annotated-PDF downloads. Converted notes retain private image assets; Improve conversion offers a review before saving a new Markdown revision. ZIP backups now use v3 and retain originals, PDF bases, images, annotations and revisions; v2 ZIP and v1 JSON restores remain supported. Markdown note bundles carry PNG/JPEG image files. See [converter setup and verification](converter/README.md).
Requires Node 22.13+. See [STUDYSPRINT.md](STUDYSPRINT.md) for setup, configuration, test commands and current limitations.

For live English dictation on an Apple Silicon Mac and a free public judges’ link, see [JUDGES.md](JUDGES.md). Speech recognition runs locally through WhisperLiveKit/MLX; no paid transcription API is required.

<summary><b>🎮 View Adventure Mode Details & Gameplay</b></summary>

<br>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d8938173-19da-43d2-afe6-a3ec41d22adb" width="48%" />
  <img src="https://github.com/user-attachments/assets/b512fa24-239b-48c0-9570-870cc3354de7" width="48%" />
</p>

* **Concepts as Creatures:** Spawns active flashcards as wild encounters (e.g., *Wild Evidence*)[cite: 7].
* **Type-to-Attack:** Deal damage to enemy HP by typing recall responses to catch creatures for your collection[cite: 7, 8].
* **Three-Strike Rule:** Three misses drain your Adventurer HP to zero and exhaust the party[cite: 7, 8].
* **Progression:** Earn XP, level up your profile, and synchronize combat stats with your spaced repetition intervals[cite: 7, 8].

</details>

---

### Setup & Requirements

Requires Node 22.13+. For document converter setup and verification details, see [converter/README.md](converter/README.md). For configuration and test commands, refer to [STUDYSPRINT.md](STUDYSPRINT.md).
