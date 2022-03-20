export const fetchFeatureTypes = (() => {
    /**
     * Fetch the data related to feature types
        promoters: Array of Feature Objects that represent promoters
        terminators: Array of Feature Objects that represent terminators
        regulatorySequences: Array of Feature Objects that represent regulatorySequences
        replicationOrigins: Array of Feature Objects that represent replicationOrigins
        selectableMarkers: Array of Feature Objects that represent selectableMarkers
        reporterGenes: Array of Feature Objects that represent reporterGenes
        affinityTags: Array of Feature Objects that represent affinityTags
        localizationSequences: Array of Feature Objects that represent localization sequences
        twoHybridGenes: Array of Feature Objects that represent two hybrid genes
        genes: Array of Feature Objects that represent genes
        primers: Array of Feature Objects that represent primers
        misc: Array of Feature Objects that represent miscellaneousFeatures
     */

    const features = [
        {
            id:'promoters',
            display:'Promoters',
            color:'#ff0000',
            bwColor: '#eee',
            decoration:'arrow'
        },
        {
            id:'terminators',
            display:'Terminators',
            color:'#ffff00',
            bwColor: '#ccc',
            decoration:'arrow'
        },
        {
            id:'regulatorySequences',
            display:'Regulatory Sequences',
            color:'#ff00ff',
            bwColor: '#ddd',
            decoration:'arrow'
        },
        {
            id:'replicationOrigins',
            display:'Replication Origins',
            color:'#00ff00',
            bwColor: '#bbb',
            decoration:'arrow'
        },
        {
            id:'selectableMarkers',
            display:'Selectable Markers',
            color:'#0000ff',
            bwColor: '#aaa',
            decoration:'arrow'
        },
        {
            id:'reporterGenes',
            display:'Reporter Genes',
            color:'#00ffff',
            bwColor: '#999',
            decoration:'arrow'
        },
        {
            id:'affinityTags',
            display:'Affinity Tags',
            color:'#f86dba',
            bwColor: '#111',
            decoration:'arrow'
        },
        {
            id:'localizationSequences',
            display:'Localization Sequences',
            color:'#976df8',
            bwColor: '#222',
            decoration:'arrow'
        },
        {
            id:'twoHybridGenes',
            display:'Two Hybrid Genes',
            color:'#6df8b7',
            bwColor: '#333',
            decoration:'arrow'
        },
        {
            id:'genes',
            display:'Genes',
            color:'#82aecc',
            bwColor: '#444',
            decoration:'arrow'
        },
        {
            id:'primers',
            display:'Primers',
            color:'#b2cc82',
            bwColor: '#555',
            decoration:'arrow'
        },
        {
            id:'misc',
            display:'Miscellaneous',
            color:'#af7736',
            bwColor: '#666',
            decoration:'arrow'
        },
        {
            id:'restrictionSites',
            display: 'Restriction Sites',
            color:'#777',
            bwColor: '#000',
            decoration:'arc'
        },
        {   
            id:'user',
            display: 'User-defined',
            color: '#ffcc00',
            bwColor: '#888',
            decoration:'arrow'
        }

    ];
    return features;
})

export const getFeatureNames = (() => {
    /**
     * Static data of all the feature names.
     * TODO: Might move elsewhere
     */
    const features = ['lac_promoter', 'AmpR_promoter', 'tetO', 'pBR322_origin', 'f1_origin', 'Ampicillin', 'Gal4_dna_binding_domain2', 'lacZ_a', 'chicken_beta_actin_promoter', 'AmpR_promoter', 'CAG_enhancer', 'pBR322_origin', 'f1_origin', 'Ampicillin', 'mCherry', 'mStrawberry', 'mOrange', 'pAmCherry', 'mOrange2', 'mTangerine', 'mRaspberry', 'mHoneydew', 'mRFP1', 'mPlum', 'mBanana', 'woodchuck_hepatitis_virus_post_transcriptional_regulatory_element', 'right_AAV-2_inverted_terminal_repeat_adenovirus', 'right_AAV-2_inverted_terminal_repeat_adenovirus', 'left_AAV-2_inverted_terminal_repeat_adenovirus', 'left_AAV-2_inverted_terminal_repeat_adenovirus', 'chicken_beta_actin_promoter', 'chicken_beta_actin_promoter', 'AmpR_promoter', 'CAG_enhancer', 'CAG_enhancer', 'CAG_enhancer', 'CAG_enhancer', 'pBR322_origin', 'Ampicillin', 'CMV_immearly_promoter', 'SV40_promoter2', 'SV40_promoter', 'EM7_promoter', 'lac_promoter', 'AmpR_promoter', 'bGH_PA_terminator', 'CAG_enhancer', 'HIV-1_rev_response_element(RRE)', 'SV40_enhancer', 'pBR322_origin', 'f1_origin', 'SV40_origin', 'Ampicillin', 'bleo', 'cyclization_recombinase_nuclear_localization_signal', 'woodchuck_hepatitis_virus_post_transcriptional_regulatory_element', 'zeocin_resistance_ORF', 'HIV-1_5_long_terminal_repeat', 'HIV-1_5_long_terminal_repeat', 'truncated_HIV-1_3_prime_long_terminal_repeat', 'truncated_HIV-1_3_prime_long_terminal_repeat', 'HIV-1_psi_pack', 'AmpR_promoter', 'tetR', 'pBR322_origin', 'Ampicillin', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'CMV_immearly_promoter', 'SV40_promoter2', 'SV40_promoter', 'EM7_promoter', 'lac_promoter', 'AmpR_promoter']
    return [...new Set(features)];
})


/**
 *  Returns the DNA input of the user with excess information removed
 *  If it is a FASTA file, removes the first line
 *  Removes all non ATCG characters from the body
 * @param  {str} input The DNA sequence
 */
export const stripInput = ((input) => {
    var stripped = input.trim();
    if(stripped[0] === '>'){
        stripped = stripped.substring(stripped.indexOf("\n") + 1);
    }
    // Remove non actg input
    const checkDNA = /[^atcg]/gi;
    stripped = stripped.replace(checkDNA, '');
    return stripped.toLowerCase();
})

