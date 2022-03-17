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
        CATCHPHRASE: "Generate and annotate plasmid maps.\nProvide a sequence or browse our database.",
    },
})

