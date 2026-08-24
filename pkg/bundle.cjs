"use strict";

// src/genetic-code.ts
var CODON_TO_AMINO_ACID = {
  // Phenylalanine
  UUU: "phe",
  UUC: "phe",
  // Leucine
  UUA: "leu",
  UUG: "leu",
  CUU: "leu",
  CUC: "leu",
  CUA: "leu",
  CUG: "leu",
  // Serine
  UCU: "ser",
  UCC: "ser",
  UCA: "ser",
  UCG: "ser",
  AGU: "ser",
  AGC: "ser",
  // Tyrosine
  UAU: "tyr",
  UAC: "tyr",
  // Stop codons
  UAA: "Stop",
  UAG: "Stop",
  UGA: "Stop",
  // Cysteine
  UGU: "cys",
  UGC: "cys",
  // Tryptophan
  UGG: "trp",
  // Proline
  CCU: "pro",
  CCC: "pro",
  CCA: "pro",
  CCG: "pro",
  // Histidine
  CAU: "his",
  CAC: "his",
  // Glutamine
  CAA: "gln",
  CAG: "gln",
  // Arginine
  CGU: "arg",
  CGC: "arg",
  CGA: "arg",
  CGG: "arg",
  AGA: "arg",
  AGG: "arg",
  // Isoleucine
  AUU: "ile",
  AUC: "ile",
  AUA: "ile",
  // Methionine / Start
  AUG: "met",
  // Threonine
  ACU: "thr",
  ACC: "thr",
  ACA: "thr",
  ACG: "thr",
  // Asparagine
  AAU: "asn",
  AAC: "asn",
  // Lysine
  AAA: "lys",
  AAG: "lys",
  // Valine
  GUU: "val",
  GUC: "val",
  GUA: "val",
  GUG: "val",
  // Alanine
  GCU: "ala",
  GCC: "ala",
  GCA: "ala",
  GCG: "ala",
  // Aspartic acid
  GAU: "asp",
  GAC: "asp",
  // Glutamic acid
  GAA: "glu",
  GAG: "glu",
  // Glycine
  GGU: "gly",
  GGC: "gly",
  GGA: "gly",
  GGG: "gly"
};
var START_CODON = "AUG";
var STOP_CODONS = /* @__PURE__ */ new Set(["UAA", "UAG", "UGA"]);
var DNA_BASES = /* @__PURE__ */ new Set(["A", "T", "G", "C"]);

// src/transcriber.ts
var DNA_TO_RNA = {
  A: "U",
  T: "A",
  G: "C",
  C: "G"
};
function normalizeSequence(input) {
  return input.replace(/\s+/g, "").toUpperCase();
}
function transcribe(dna) {
  return [...dna].map((base) => {
    const rna = DNA_TO_RNA[base];
    return rna === void 0 ? { rna: ".", valid: false } : { rna, valid: true };
  });
}
function translate(rna) {
  const startIndex = rna.indexOf(START_CODON);
  if (startIndex === -1) {
    return { startIndex: -1, aminoAcids: [], terminated: false };
  }
  const aminoAcids = [];
  let terminated = false;
  for (let i = startIndex; i + 3 <= rna.length; i += 3) {
    const codon = rna.slice(i, i + 3);
    const aminoAcid = CODON_TO_AMINO_ACID[codon];
    if (STOP_CODONS.has(codon)) {
      terminated = true;
      break;
    }
    if (aminoAcid !== void 0) {
      aminoAcids.push(aminoAcid);
    }
  }
  return { startIndex, aminoAcids, terminated };
}
function invalidBasePositions(dna) {
  const positions = [];
  [...dna].forEach((base, index) => {
    if (!DNA_BASES.has(base)) positions.push(index);
  });
  return positions;
}

// src/index.ts
var RESET = "\x1B[0m";
var HIGHLIGHT_A = "\x1B[48;5;24m";
var HIGHLIGHT_B = "\x1B[48;5;52m";
function highlightCodons(sequence) {
  const parts = [];
  for (let i = 0; i < sequence.length; i += 3) {
    const codon = sequence.slice(i, i + 3);
    const highlight = i / 3 % 2 === 0 ? HIGHLIGHT_A : HIGHLIGHT_B;
    parts.push(`${highlight}${[...codon].join(" ")}${RESET}`);
  }
  return parts.join(" ");
}
function renderReport(dnaInput) {
  const dna = normalizeSequence(dnaInput);
  const transcribed = transcribe(dna);
  const rna = transcribed.map((n) => n.rna).join("");
  const translation = translate(rna);
  const lines = [];
  lines.push(`DNA:   ${highlightCodons(dna)}`);
  lines.push(`RNA:   ${highlightCodons(rna)}`);
  if (translation.startIndex === -1) {
    lines.push("CHAIN: no start codon (AUG) found");
  } else {
    const chain = translation.aminoAcids.join("---");
    lines.push(translation.terminated ? `CHAIN: ${chain}   [END]` : `CHAIN: START ${chain}`);
  }
  return lines.join("\n");
}
function main() {
  const args = process.argv.slice(2);
  const dnaInput = args.join(" ").trim();
  if (dnaInput.length === 0) {
    console.error(
      "Usage: ProteinTranscription.exe <DNA sequence>\n  e.g. ProteinTranscription.exe ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG\n  or   ProteinTranscription.exe A T G G C C A T T G T A"
    );
    process.exit(1);
  }
  const dna = normalizeSequence(dnaInput);
  const invalid = invalidBasePositions(dna);
  if (invalid.length > 0) {
    const bad = invalid.map((pos) => `${pos + 1}('${dna[pos]}')`).join(", ");
    console.error(`Warning: non-DNA nucleotide(s) at ${bad} will be transcribed as '.'`);
  }
  console.log(renderReport(dnaInput));
}
main();
