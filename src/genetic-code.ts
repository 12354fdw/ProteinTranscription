/**
 * The standard RNA genetic code.
 *
 * Each key is an RNA codon (3 bases) and each value is the amino acid it
 * encodes. The three stop codons map to "Stop". The start codon AUG also
 * encodes Methionine (met).
 */
export const CODON_TO_AMINO_ACID: Readonly<Record<string, string>> = {
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
	GGG: "gly",
};

/** The RNA start codon. */
export const START_CODON = "AUG";

/** The RNA stop codons. */
export const STOP_CODONS: ReadonlySet<string> = new Set(["UAA", "UAG", "UGA"]);

/** Valid DNA nucleotides. */
export const DNA_BASES: ReadonlySet<string> = new Set(["A", "T", "G", "C"]);
