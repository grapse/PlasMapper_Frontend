/**
 * Configures the written prompts.
 * 
 * To add a new language:
 *      - Add it to the languages list with a reference name (ref) and display name (name)
 *      - Add it to the default object by copying one of the existing ones and translating all the phrases
 */

export const languages = [
    {name:"English", ref:"en"}    
]

export default({
    en:{
        CATCHPHRASE: "Generate and annotate plasmid maps.",
        ABOUT: "The PlasMapper server automatically generates and annotates plasmid maps using only the plasmid DNA sequence as input. \n\
                Automatically annotated features are taken from a curated database of common plasmid features and users can add their own custom features to any map. The server also provides an interface to search for commercial plasmids based on numerous criteria such as desired features, sequence length, expression type, and supplier. Plasmid maps are downloadable in PNG and SVG format.",
        SEARCH: "Quickly find the plasmid you are looking for in our database by filtering for various fields.\n",
        HELP: "Paste your sequence directly, or search our database for the plasmid you need.\n\n\
                Click on the features to change visibility, name, category, location, or strand. You can also click directly on the map to open feature options.\n\n\
                You can add features by clicking directly on the map.\n\n\
                Only restriction sites that appear once are shown by default, but you optionally show others.\n\n\
                You can change the map name, or toggle ORFs, the legend, or greyscale mode in the Other tab.",
        CITATION: "Credit the following:",
        SOURCE_CODE: "Frontend: https://github.com/grapse/PlasMapper_Frontend\nBackend: https://github.com/Jacques857/PlasMapper_API",


    },
})

