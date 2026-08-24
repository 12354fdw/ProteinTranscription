# ProteinTranscription

A small TypeScript CLI that **transcribes DNA → RNA → amino acid (protein) chain**.

## Usage

```bash
npm run start -- <DNA sequence>
```

The sequence can be one continuous string or space-separated:

```bash
npm run start -- TACCGTAAATTTATT
npm run start -- T A C C G T A A A T T T A T T
```

### Example output

```
DNA:   T A C C G T A A A T T T A T T
RNA:   A U G G C A U U U A A A U A A
CHAIN: START met---ala---phe---lys [END]
```

- `DNA` — the input, printed one nucleotide per column.
- `RNA` — the complementary transcript (A↔U, T→A, G↔C). Invalid bases are
  shown as `.` so the columns stay aligned.
- `CHAIN` — the translated amino acids. Translation begins at the first **AUG**
  (start) codon and stops at the first stop codon (**UAA / UAG / UGA**), which is
  printed as `[END]`.

## Development

```bash
npm run build      # TypeScript -> dist/
npm run start      # run the CLI (uses dist/)
npm run lint       # eslint
npm run format     # prettier
```

## Biology notes

- Input is expected to be a **DNA template strand** using only `A`, `T`, `G`, `C`.
- **Transcription** produces the complementary RNA (A→U, T→A, G→C, C→G).
- **Translation** reads RNA in groups of three (codons) using the standard
  genetic code in `src/genetic-code.ts`, as described above.
