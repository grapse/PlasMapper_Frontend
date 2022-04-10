/**
 * Configures the written prompts.
 * 
 * To modify any text on the site:
 *      - Find it in this file and edit it here. You will have to full reload the page if you curently have it open in development mode.
 * 
 * To add a new language:
 *      - Add it to the languages list with a reference name (ref) and display name (name)
 *      - Add it to the default object by copying one of the existing ones and translating all the phrases
 * 
 * To modify the help page:
 *      - Go to the array under the comment that says "HELP PAGE HERE"
 *      - Add an entry in the same style as the others, with the following attributes:
 *          -  title: The displayed title on the sidebar and page
 *          -  content: The displayed text
 *          -  image: (Optional) The displayed image (must be an image URL)
 */

 export const languages = [
    {name:"English", ref:"en"}    
]

export default({
    en:{
        CATCHPHRASE: "Generate and annotate plasmid maps.",
        ABOUT: "The PlasMapper server automatically generates and annotates plasmid maps using only the plasmid DNA sequence as input. \n\
                Automatically annotated features are taken from a curated database of common plasmid features and users can add their own custom features to any map. The server also provides an interface to search for commercial plasmids based on numerous criteria such as desired features, sequence length, expression type, and supplier. Plasmid maps are downloadable in PNG and SVG format.",
        SEARCH: "Quickly find the plasmid you are looking for in our database by filtering for various fields.\nClick on a column header to view more options for that column, including sorting.",
        HELPBLURB: "Paste your sequence directly, or search our database for the plasmid you need.\n\n\
                Click on the features to change visibility, name, category, location, or strand. You can also click directly on the map to open feature options.\n\n\
                You can add features by clicking directly on the map.\n\n\
                Only restriction sites that appear once are shown by default, but you optionally show others.\n\n\
                You can change the map name, or toggle ORFs, the legend, or greyscale mode in the Other tab.",
        CITATION: "Coming Soon",
        SOURCE_CODE_FRONTEND: "https://github.com/grapse/PlasMapper_Frontend",
        SOURCE_CODE_BACKEND: "https://github.com/Jacques857/PlasMapper_API",
        OPEN_LINK: "Browse Plasmid Database",
        OPEN_FILE: "Choose File",
        EXAMPLES: "Try our example plasmids:",
        PASTE_SEQ: "Paste your plasmid DNA sequence here",
        SEQ_DETAILS: "FASTA or raw DNA sequence. Non-ACTG inputs will be ignored.",
        SEQ_WARNING: "Load times may be slow for sequences >200kb",
        SEQ_ERROR: "Sequences that exceed 500kb will be truncated to 500kb",
        FILE_SPEC: "Plaintext or FASTA only. DNA sequences only (no protein).",
        FOOTER: "Please direct any questions or feedback ",
        FOOTER_CREDIT: "PlasMapper 3.0 is a project made for the Wishart Lab at the University of Alberta.",
        ABOUT: {
            title:"About PlasMapper 3.0",
            history:`PlasMapper 3.0 is the new and upgraded version of PlasMapper 2.0, which was built in 2004.\n
            Version 3.0 aims to modernize the look and feel of the website while maintaining its overall purpose.\n
            Many new features have been added in version 3.0, including the ability to filter a plasmid database and interact with the plasmid map in real time.`,
            history_link:"https://sites.ualberta.ca/~stothard/papers/nar_plasmapper.pdf",
            architecture:`PlasMapper 3.0 consists of a Python Django Rest Framework API and a Gatsby React frontend.\n
            The plasmid database exists as a set of JSON files compiled specifically for PlasMapper 3.0.\n
            Both the API and the frontend are served out of the David Wishart lab at the University of Alberta.`,
            credits1:`UI Elements: `,
            credits2:`Genome Viewer: `,
            credits3:`And a special thanks to David Wishart and the Wishart Lab at the University of Alberta for the guidance on this project.`,
        },
        HELP: [
            {
                title:"Choosing a Sequence",
                image: "https://i.imgur.com/P4XguNh.png",
                content:`The PlasMapper 3.0 server provides several ways to generate a plasmid map.\n
            1. If you don't already have a plasmid in mind, browse the plasmid database to find one.\n
            2. You can enter a plasmid DNA sequence as text. This can be pasted into the text box, where any characters other than 'a', 'A', 't', 'T', 'g', 'G', 'c', or 'C' will be removed before annotation.\n
            3. Another option is to upload a FASTA or raw sequence file containing your plasmid DNA sequence.\n
            4. You can also choose from annotated example plasmids to conveniently test out the plasmid editor.`,
        
            },
            {
                title:"Using the Search Page",
                image:    'https://i.imgur.com/AnJ53y3.png',
                content:`The PlasMapper 3.0 database allows users to filter plasmids by plasmid name, sequence features, restriction sites, expression type, and sequence length.
                A table of results will be displayed beside the filtering options.
                
                Sequence features, restriction sites, and expression type can be searched for multiple values at a time.
                There is a dropdown menu that autofills suggestions as you type. By default, it searches for any plasmid with at least one of the selected attributes per field.
                If you click on the toggle that says "OR Search", it will switch to "AND Search" and instead search for all plasmids with all of the chosen attributes.`
            },
            {
                title:"Search Preview",
                image:'https://i.imgur.com/ecqq4QY.png',
                content:`Click on any table row to open up a preview.\n
                        1. A visual preview of the features
                        2. The DNA sequence
                        3. Click here to open it up in the main editor`
            },
            {
                title: "Plasmid Editor",
                image: "https://i.imgur.com/WoGV96F.png",
                content:   `There are many esthetic and feature related customizations that can be made in the plasmid editor.
                On the left hand side, there are 4 tabs.`
            },
            {
                title: "Features Tab",
                image: "https://i.imgur.com/AutHsM0.png",
                content:   `The "Features" tab allows users to quickly hide or reveal specific features by clicking the eye icon. Users can also open feature details by clicking on the feature name or dropdown arrow. From the feature details, users can edit a feature's display name, category, start/stop indices, and forward/reverse strand. Once changes have been made to a feature, click the hard drive/save icon to save changes.`
            },
            {
                title: "Add Features Tab",
                image: "https://i.imgur.com/6bFFVRl.png",
                content:   `The "Add Feature" tab allows users to add their own custom features to their plasmid maps. Simply fill out the feature details and then click the "Add Feature" button to update the map.`
            },
            {
                title: "Restriction Sites Tab",
                image: "https://i.imgur.com/NCg242y.png",
                content:   `The "Restriction Sites" tab allows users to select which restriction sites will be shown on the map.
                 By default, restriction sites that appear once are shown. 
                 Simply check or uncheck any box to show or hide the corresponding restriction site. This tab also shows the number of occurrences of each restriction site in the given plasmid DNA sequence.`
            },
            {
                title: "Other Tab",
                image: "https://i.imgur.com/eH3v6iD.png",
                content:   `The "Other" tab allows users to change miscellaneous esthetic properties.
                            1. Show/hide open reading frames
                            2. Show/hide legend
                            3. Toggle greyscale mode
                            4. Change the name
                            5. Set download dimensions. The visual map will automatically resize to fit the dimensions
                            6. Download map as a PNG file
                            7. Download map JSON file (so you can save and edit it later)
                            8. Upload JSON file (downloaded from the above)`
            },
            {
                title: "Saving Edits for Later",
                image: "https://i.imgur.com/NbrcQjl.png",
                content: `If you would like to come back to a map later, but have already made edits to the sequence or features via our editor, you can save it as a JSON using the "Download JSON" button.
                You can then upload that JSON file using the "Upload JSON" button below when you come back to it another time.
                If there are any issues with the file, PlasMapper will not accept it and show an approrpiate error message (example in image). To ensure such issues do not occur, please make sure that you are uploading a JSON file that was generated by PlasMapper.`
            },
            {
                title: "Map View",
                image: "https://i.imgur.com/TEwNxUf.png",
                content:   `The map view on the right hand side of the page supports click and drag movement of the plasmid map around the viewport, clicking on a feature arrow to open that feature's details in the "Features" tab, scroll wheel zoom in/out, and customizing the legend colors by clicking on the colored box to the left of each legend entry.

                Just under the map view, there are several buttons you can use to manipulate the map:
                    - "Download Map PNG" will download a PNG file of the map
                    - "Toggle Linear/Circular Format" will toggle between linear and circular format
                    - "Reset Map" will reset the map view to its original state (i.e. zoomed out and centered)
                    - "Zoom In" will zoom in on the map
                    - "Zoom Out" will zoom out on the map
                    - "Move Left/Counterclockwise" will move the map left
                    - "Move Right/Clockwise" will move the map right
                    - "Toggle Labels" will toggle the feature labels
                    - "Invert Map Colors" will invert the map colors
                    `
            },
            {
                title: "Text Editor",
                image: "https://i.imgur.com/3qloYcm.png" ,
                content:   `Use the text editor to view and edit the sequence. You can find it directly below the visual map.\n
                            1. The sequence is divided into segments based on the features. Click on one to open it up on the left.
                            2. The sequence is split into pages of 1000 bp each. Use the arrows or type in a page to switch pages.
                            3. You can edit the selected segment, on the selected strand using this. There is a preview of the complementary strand beneath.
                            4. Click "Swap Strands" to change the strand you are editing.
                            5. Click "Delete entire segment" to remove the segment you are editing.
                            6. Click "Save changes" to save any edits you made to the segment. This will reflect in both the textual and visual editors.
                            7. You can also insert novel features here. Use this box and click "Insert Before" to insert it directly before the selected segment, or "Insert After" to insert directly after.`
            },
            {
                title: "Download Text Map",
                image: "https://i.imgur.com/Wz1hbL1.png" ,
                content:   `You can click on the "Toggle Downloadable View" to change the view of the text editor to a download-friendly format. Then you can click "Export As PNG" to download the text editor as a PNG file.
                If you would like to keep the original coloured box format, we recommend using your computer's screenshot tool (e.g. "Windows + Shift + S" on Windows or "Shift + Command + 4" on Mac) to take a screenshot of the text editor.`
            },
            {
                title: "Header",
                image: "https://i.imgur.com/Uq2BpPj.png",
                content:   `The header bar contains several helpful links and utilities.

                By clicking the PlasMapper 3.0 icon, a user is returned to the homepage of the server.
                By clicking the "Search" button, a user is redirected to the "Browse Plasmids" page.
                By clicking the "Help" button, a user is redirected to the help page you are currently viewing.
                By clicking the "About" button, a user is shown the details about the PlasMapper 3.0 server.
                By clicking the "Source Code" button, a user is shown a link to the source code for the webserver, hosted on GitHub.
                By clicking the "Citation" button, a user is given details about how to cite the PlasMapper 3.0 webserver.
                By toggling the light/dark mode switch in the top right corner, a user can switch between light and dark themes of the website.`
            },
        ],
    },
})


