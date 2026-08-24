import { CODON_TO_AMINO_ACID, DNA_BASES, START_CODON, STOP_CODONS } from "./genetic-code.js";

/**
 * The complementary RNA base for a given DNA base.
 * DNA T -> RNA A, DNA A -> RNA U, DNA G -> RNA C, DNA C -> RNA G.
 */
const DNA_TO_RNA: Readonly<Record<string, string>> = {
	A: "U",
	T: "A",
	G: "C",
	C: "G",
};

/** Normalize input: strip whitespace and uppercase (e.g. "DATAGGACCATACC" or "D A T A G"). */
export function normalizeSequence(input: string): string {
	return input.replace(/\s+/g, "").toUpperCase();
}

/** A single transcribed nucleotide (rna) plus whether it was valid DNA. */
export interface TranscribedNucleotide {
	rna: string;
	valid: boolean;
}

/**
 * Transcribe a DNA sequence into its complementary RNA sequence,
 * base by base. Invalid bases are transcribed as "." so the alignment
 * (one RNA symbol per DNA symbol) is preserved.
 */
export function transcribe(dna: string): TranscribedNucleotide[] {
	return [...dna].map((base) => {
		const rna = DNA_TO_RNA[base];
		return rna === undefined ? { rna: ".", valid: false } : { rna, valid: true };
	});
}

export interface TranslationResult {
	/** 0-based index in the RNA where translation began (the AUG start). */
	startIndex: number;
	/** Amino acids encoded by codons that appear before the start codon. */
	preStartAminoAcids: string[];
	/** The amino acids found between the start codon and the first stop codon. */
	aminoAcids: string[];
	/** True when a stop codon terminated the chain. */
	terminated: boolean;
}

/**
 * Translate an RNA sequence into an amino acid chain following the
 * standard reading frame: locate the first START codon (AUG) and read
 * codons in groups of three until a stop codon is reached.
 */
export function translate(rna: string): TranslationResult {
	const startIndex = rna.indexOf(START_CODON);

	if (startIndex === -1) {
		return { startIndex: -1, preStartAminoAcids: [], aminoAcids: [], terminated: false };
	}

	const preStartAminoAcids: string[] = [];
	for (let i = 0; i + 3 <= startIndex; i += 3) {
		const codon = rna.slice(i, i + 3);
		const aminoAcid = CODON_TO_AMINO_ACID[codon];
		// Unknown / unhandled codons are skipped so the output stays robust.
		if (aminoAcid !== undefined && !STOP_CODONS.has(codon)) {
			preStartAminoAcids.push(aminoAcid);
		}
	}

	const aminoAcids: string[] = [];
	let terminated = false;

	for (let i = startIndex; i + 3 <= rna.length; i += 3) {
		const codon = rna.slice(i, i + 3);
		const aminoAcid = CODON_TO_AMINO_ACID[codon];

		if (STOP_CODONS.has(codon)) {
			terminated = true;
			break;
		}

		// Unknown / unhandled codons are skipped so the output stays robust.
		if (aminoAcid !== undefined) {
			aminoAcids.push(aminoAcid);
		}
	}

	return { startIndex, preStartAminoAcids, aminoAcids, terminated };
}

/** Sanity check that reports which positions are not valid DNA bases. */
export function invalidBasePositions(dna: string): number[] {
	const positions: number[] = [];
	[...dna].forEach((base, index) => {
		if (!DNA_BASES.has(base)) positions.push(index);
	});
	return positions;
}
