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
            color:'#ff0000'
        },
        {
            id:'terminators',
            display:'Terminators',
            color:'#ffff00'
        },
        {
            id:'regulatorySequences',
            display:'Regulatory Sequences',
            color:'#ff00ff'
        },
        {
            id:'replicationOrigins',
            display:'Replication Origins',
            color:'#00ff00'
        },
        {
            id:'selectableMarkers',
            display:'Selectable Markers',
            color:'#0000ff'
        },
        {
            id:'reporterGenes',
            display:'Reporter Genes',
            color:'#00ffff'
        },
        {
            id:'affinityTags',
            display:'Affinity Tags',
            color:'#f86dba'
        },
        {
            id:'localizationSequences',
            display:'Localization Sequences',
            color:'#976df8'
        },
        {
            id:'twoHybridGenes',
            display:'Two Hybrid Genes',
            color:'#6df8b7'
        },
        {
            id:'genes',
            display:'Genes',
            color:'#82aecc'
        },
        {
            id:'primers',
            display:'Primers',
            color:'#b2cc82'
        },
        {
            id:'misc',
            display:'Miscallaneous',
            color:'#af7736'
        },
        {
            id:'restrictionSites',
            display: 'Restriction Sites',
            color:'000'
        },
        {   
            id:'user',
            display: 'User-defined',
            color: '#ffcc00'
        }

    ];
    return features;
})

export const stripInput = ((input) => {
    /**
     * Returns the DNA input of the user with excess information removed
     *  If it is a FASTA file, removes the first line
     *  Removes all non ATCG characters from the body
     */

    var stripped = input.trim();
    if(stripped[0] === '>'){
        stripped = stripped.substring(stripped.indexOf("\n") + 1);
    }
    const checkDNA = /[^atcg]/gi;
    stripped = stripped.replace(checkDNA, '');
    return stripped.toLowerCase();
})

const getCommonEnzymes = (() => {
    const str = ` HpaII CCGG (1/3)
    ApoI RAATTY (1/5)
    SacI GAGCTC (5/1)
    EcoRI GAATTC (1/5)
    AlwNI CAGNNNCTG (6/3)
    AluI AGCT (2/2)
    AccI GTMKAC (2/4)
    MboI GATC (0/4)
    Sau3AI GATC (0/4)
    SfiI GGCCNNNNNGGCC (8/5)
    HincII GTYRAC (3/3)
    NruI TCGCGA (3/3)
    BglI GCCNNNNNGGC (7/4)
    AvrI CYCGRG (1/1)
    XmaI CCCGGG (1/5)
    DraI TTTAAA (3/3)
    PvuII CAGCTG (3/3)
    HindIII AAGCTT (1/5)
    KpnI GGTACC (5/1)
    NarI GGCGCC (2/4)
    BglII AGATCT (1/5)
    HpaI GTTAAC (3/3)
    StuI AGGCCT (3/3)
    NcoI CCATGG (1/5)
    NdeI CATATG (2/4)
    Bsp24I GACNNNNNNTGG (1/1)
    BclI TGATCA (1/5)
    SmaI CCCGGG (3/3)
    AvaI CYCGRG (1/5)
    AvaII GGWCC (1/4)
    PstI CTGCAG (5/1)
    SphI GCATGC (5/1)
    ApaI GGGCCC (5/1)
    EcoRV GATATC (3/3)
    BamHI GGATCC (1/5)
    HaeIII GGCC (2/2)
    NotI GCGGCCGC (2/6)
    XhoI CTCGAG (1/5)
    ClaI ATCGAT (2/4)
    XbaI TCTAGA (1/5)`
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
    return str.split('\n').map(v => {
        var parts = v.trim().split(' ');
        const re = parts[1].split('').map(v => restrictionSymbols[v]).join('');
        return {name:parts[0],reg:re,len:parts[1].length}});
})

export const checkCommonEnzymes = ((sequence) => {
    /**
     * Find occurences of the most common enzymes.
     * TODO: make it display more than the first one
     */
    const commonEnzymes = getCommonEnzymes();
    var features = [];
    for (var i = 0; i < commonEnzymes.length; i++){
        var tryMatch = sequence.match(new RegExp(commonEnzymes[i].reg));
        if(tryMatch){
            features = [...features,{name:commonEnzymes[i].name,start:tryMatch.index,stop:tryMatch.index + commonEnzymes[i].len,source:"json-feature", legend:"Restriction Sites", show:true}]
        }
    }
    return features;
})

export const checkOrfs = ((sequence) => {
    /**
     * Find ORFs
     */
    return;
})