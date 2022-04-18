export const fetchFeatureTypes = ((getMap = false) => {
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
            color:'#777777',
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

    if(getMap){
        const newObj = {}
        features.forEach(v => {
            newObj[v.display] = v.color;
        })
        return newObj
    }

    return features;
})

export const getFeatureNames = (() => {
    /**
     * Static data of all the feature names.
     */
    const features = ['lac_promoter', 'AmpR_promoter', 'tetO', 'pBR322_origin', 'f1_origin', 'Ampicillin', 'Gal4_dna_binding_domain2', 'lacZ_a', 'chicken_beta_actin_promoter', 'AmpR_promoter', 'CAG_enhancer', 'pBR322_origin', 'f1_origin', 'Ampicillin', 'mCherry', 'mStrawberry', 'mOrange', 'pAmCherry', 'mOrange2', 'mTangerine', 'mRaspberry', 'mHoneydew', 'mRFP1', 'mPlum', 'mBanana', 'woodchuck_hepatitis_virus_post_transcriptional_regulatory_element', 'right_AAV-2_inverted_terminal_repeat_adenovirus', 'right_AAV-2_inverted_terminal_repeat_adenovirus', 'left_AAV-2_inverted_terminal_repeat_adenovirus', 'left_AAV-2_inverted_terminal_repeat_adenovirus', 'chicken_beta_actin_promoter', 'chicken_beta_actin_promoter', 'AmpR_promoter', 'CAG_enhancer', 'CAG_enhancer', 'CAG_enhancer', 'CAG_enhancer', 'pBR322_origin', 'Ampicillin', 'CMV_immearly_promoter', 'SV40_promoter2', 'SV40_promoter', 'EM7_promoter', 'lac_promoter', 'AmpR_promoter', 'bGH_PA_terminator', 'CAG_enhancer', 'HIV-1_rev_response_element(RRE)', 'SV40_enhancer', 'pBR322_origin', 'f1_origin', 'SV40_origin', 'Ampicillin', 'bleo', 'cyclization_recombinase_nuclear_localization_signal', 'woodchuck_hepatitis_virus_post_transcriptional_regulatory_element', 'zeocin_resistance_ORF', 'HIV-1_5_long_terminal_repeat', 'HIV-1_5_long_terminal_repeat', 'truncated_HIV-1_3_prime_long_terminal_repeat', 'truncated_HIV-1_3_prime_long_terminal_repeat', 'HIV-1_psi_pack', 'AmpR_promoter', 'tetR', 'pBR322_origin', 'Ampicillin', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'lac_promoter', 'AmpR_promoter', 'pBR322_origin', 'Ampicillin', 'lacZ_a', 'CMV_immearly_promoter', 'SV40_promoter2', 'SV40_promoter', 'EM7_promoter', 'lac_promoter', 'AmpR_promoter']
    return [...new Set(features)];
})

export const getExpressionTypes = (() => {
    /**
     * Static data of all the expression types.
     */
    const expressionTypes = ['Yeast Expression', 'Plant Expression', 'Bacterial Expression', 'Mammalian Expression', 'Insect Expression', 'Worm Expression', 'CRISPR']
    return [...new Set(expressionTypes)];
})

/**
 *  Returns the DNA input of the user with excess information removed
 *  If it is a FASTA file, removes the first line
 *  Removes all non ATCG characters from the body
 * @param  {str} input The DNA sequence
 * @param  {bool} upperCase Whether or not to return the uppercase sequence 
 */
export const stripInput = ((input, upperCase = false) => {
    var stripped = input.trim();
    if(stripped[0] === '>'){
        stripped = stripped.substring(stripped.indexOf("\n") + 1);
    }
    // Remove non actg input
    const checkDNA = /[^atcg]/gi;
    stripped = stripped.replace(checkDNA, '');
    return upperCase ? stripped.toUpperCase() : stripped.toLowerCase();
})

/**
 * Extracts the plasmid name from the FASTA header
 * @param  {str} input The FASTA input
 */
export const getFastaName = ((input) => {
    if(input[0] === '>'){
        let stripped = input.split('\n')[0].substring(1,64);
        return stripped;
    }
    return false;
})

/**
 * Returns the information relating to a select number of common restriction enzymes
 */
export const getCommonEnzymes = (() => {
    const enzymes = [ { name: 'HpaII', reg: 'ccgg', len: 4 },
    { name: 'ApoI', reg: '[ag]aatt[ct]', len: 6 },
    { name: 'SacI', reg: 'gagctc', len: 6 },
    { name: 'EcoRI', reg: 'gaattc', len: 6 },
    { name: 'AlwNI', reg: 'cag[actg][actg][actg]ctg', len: 9 },
    { name: 'AluI', reg: 'agct', len: 4 },
    { name: 'AccI', reg: 'gt[ac][gt]ac', len: 6 },
    { name: 'MboI', reg: 'gatc', len: 4 },
    { name: 'Sau3AI', reg: 'gatc', len: 4 },
    { name: 'SfiI',
      reg: 'ggcc[actg][actg][actg][actg][actg]ggcc',
      len: 13 },
    { name: 'HincII', reg: 'gt[ct][ag]ac', len: 6 },
    { name: 'NruI', reg: 'tcgcga', len: 6 },
    { name: 'BglI',
      reg: 'gcc[actg][actg][actg][actg][actg]ggc',
      len: 11 },
    { name: 'AvrI', reg: 'c[ct]cg[ag]g', len: 6 },
    { name: 'XmaI', reg: 'cccggg', len: 6 },
    { name: 'DraI', reg: 'tttaaa', len: 6 },
    { name: 'PvuII', reg: 'cagctg', len: 6 },
    { name: 'HindIII', reg: 'aagctt', len: 6 },
    { name: 'KpnI', reg: 'ggtacc', len: 6 },
    { name: 'NarI', reg: 'ggcgcc', len: 6 },
    { name: 'BglII', reg: 'agatct', len: 6 },
    { name: 'HpaI', reg: 'gttaac', len: 6 },
    { name: 'StuI', reg: 'aggcct', len: 6 },
    { name: 'NcoI', reg: 'ccatgg', len: 6 },
    { name: 'NdeI', reg: 'catatg', len: 6 },
    { name: 'Bsp24I',
      reg: 'gac[actg][actg][actg][actg][actg][actg]tgg',
      len: 12 },
    { name: 'BclI', reg: 'tgatca', len: 6 },
    { name: 'SmaI', reg: 'cccggg', len: 6 },
    { name: 'AvaI', reg: 'c[ct]cg[ag]g', len: 6 },
    { name: 'AvaII', reg: 'gg[at]cc', len: 5 },
    { name: 'PstI', reg: 'ctgcag', len: 6 },
    { name: 'SphI', reg: 'gcatgc', len: 6 },
    { name: 'ApaI', reg: 'gggccc', len: 6 },
    { name: 'EcoRV', reg: 'gatatc', len: 6 },
    { name: 'BamHI', reg: 'ggatcc', len: 6 },
    { name: 'HaeIII', reg: 'ggcc', len: 4 },
    { name: 'NotI', reg: 'gcggccgc', len: 8 },
    { name: 'XhoI', reg: 'ctcgag', len: 6 },
    { name: 'ClaI', reg: 'atcgat', len: 6 },
    { name: 'XbaI', reg: 'tctaga', len: 6 } ]
    return enzymes;
})

/**
 * @param  {array} enzymes The enzymes to be converted
 */
export const getEnzymes = ((enzymes) => {
    const restrictionSymbols = {
        A:"a",
        C:"c",
        T:"t",
        G:"g",
        N:"[actg]",
        M:"[ac]",
        R:"[ag]",
        W:"[at]",
        Y:"[ct]",
        S:"[cg]",
        K:"[gt]",
        H:"[act]",
        B:"[cgt]",
        V:"[acg]",
        D:"[agt]"
    }
    return enzymes.map(v => {
        var parts = v.trim().toLowerCase().split(' ');
        const re = parts[1].split('').map(v => restrictionSymbols[v]).join('');
        return {name:parts[0],reg:re,len:parts[1].length}});
})

/**
 * Searches for the given restriction sites in the DNA sequence
 * @param  {str} sequence The DNA sequence to be checked
 * @param  {array} enzymes The enzymes to check for
 */
export const checkEnzymes = ((sequence, enzymes = getCommonEnzymes()) => {
    var features = [];
    for (var i = 0; i < enzymes.length; i++){
        var tryMatch = sequence.match(new RegExp(enzymes[i].reg));
        if(tryMatch){
            features = [...features,{name:enzymes[i].name,start:tryMatch.index,stop:tryMatch.index + enzymes[i].len,source:"json-feature", legend:"Restriction Sites", show:true}]
        }
    }
    return features;
})

/**
 * Counts the restriction sites in the DNA sequence
 * @param  {str} sequence The DNA sequence to be checked
 * @param  {array} enzymes The enzymes to count
 */
 export const countEnzymes = ((sequence, enzymes) => {
    return enzymes.map((v,i) =>{ 
        let a = new RegExp(v.reg.toUpperCase(), 'g');
        return({...v, count:sequence.match(a)?.length || 0})
    });
})

/**
 * Converts a single enzyme
 * @param  {str} enzyme The enzyme to be converted
 */
 const getRegExp = ((enzyme) => {
    const restrictionSymbols = {
        A:"a",
        C:"c",
        T:"t",
        G:"g",
        N:"[actg]",
        M:"[ac]",
        R:"[ag]",
        W:"[at]",
        Y:"[ct]",
        S:"[cg]",
        K:"[gt]",
        H:"[act]",
        B:"[cgt]",
        V:"[acg]",
        D:"[agt]"
    }
    return enzyme.split('').map(v => restrictionSymbols[v]).join('');
})

export const getNewEnzyme = ((sequence, newName, newMatch) => {
    let newRegExp = getRegExp(newMatch.toUpperCase());
    return countEnzymes(sequence, [{name:newName, reg:newRegExp, len:newRegExp.length}])[0];
})

export const getAllMatches = ((sequence, enzymes) => {
    let features = []
    enzymes.forEach((w,j) => {
        let re = new RegExp(w.reg.toUpperCase(), 'g');
        let matches = [];
        let match;
        while ((match = re.exec(sequence)) != null) {
            matches = [...matches, match];
        }
        console.log(matches);
        if(matches){
            matches.forEach((v,i) => {
                features = [...features,{name:w.name, count:w.count, firstSite: i === 0,start:v.index,stop:v.index + w.len,source:"json-feature", legend:"Restriction Sites", visible:true}]
            })
        }
    });
    return features;
})