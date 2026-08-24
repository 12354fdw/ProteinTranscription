import { invalidBasePositions, normalizeSequence, transcribe, translate } from "./transcriber.js";

// --- ANSI highlight helpers ---------------------------------------------
const RESET = "\x1b[0m";
/** First alternating highlight (dark blue background). */
const HIGHLIGHT_A = "\x1b[48;5;24m";
/** Second alternating highlight (dark red background). */
const HIGHLIGHT_B = "\x1b[48;5;52m";

/**
 * Render a sequence with alternating highlights applied per codon.
 *
 * Every group of 3 nucleotides (a codon) gets a background colour, and the
 * colour alternates between groups so the DNA and RNA rows are easy to read
 * three-by-three.
 */
function highlightCodons(sequence: string): string {
	const parts: string[] = [];
	for (let i = 0; i < sequence.length; i += 3) {
		const codon = sequence.slice(i, i + 3);
		const highlight = (i / 3) % 2 === 0 ? HIGHLIGHT_A : HIGHLIGHT_B;
		parts.push(`${highlight}${[...codon].join(" ")}${RESET}`);
	}
	return parts.join(" ");
}

/**
 * Render the report in the requested format.
 *
 *     DNA:   D A T A G G A C C A T A C C
 *     RNA:   U A C . . . . . . . . . . .
 *     CHAIN: START thy---his---his---his [END]
 *
 * The DNA and RNA rows are printed with alternating highlights grouped in
 * codons (triplets) so the base pairs are easy to spot three at a time.
 */
function renderReport(dnaInput: string): string {
	const dna = normalizeSequence(dnaInput);
	const transcribed = transcribe(dna);
	const rna = transcribed.map((n) => n.rna).join("");
	const translation = translate(rna);

	const lines: string[] = [];
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

function main(): void {
	const args = process.argv.slice(2);
	const dnaInput = args.join(" ").trim();

	if (dnaInput.length === 0) {
		console.error(
			"Usage: npm run start -- <DNA sequence>\n" +
				"  e.g. npm run start -- ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG\n" +
				"  or   npm run start -- A T G G C C A T T G T A",
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
