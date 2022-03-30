import * as React from "react"

import * as style from '../styles/sequenceeditor.module.css'

import GlobalContext from "../context/optionContext";

import {fetchSamplePlasmids} from "../utils/SamplePlasmids";
import {stripInput} from "../utils/FeatureUtils";

/**
 * Get the average of a list of hex colors
 * @param  {array} colors The list of hex colors
 */
function averageColors(colors){
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < colors.length; i++){
      r += parseInt(colors[i].substring(1,3), 16);
      g += parseInt(colors[i].substring(3,5), 16);
      b += parseInt(colors[i].substring(5,7), 16);
    }
    r = Math.floor(r / colors.length);
    g = Math.floor(g / colors.length);
    b = Math.floor(b / colors.length);
    return `rgb(${r}, ${g}, ${b})`;
}

// TODO: For testing purposes
const pageLength = 1000;
const sample = fetchSamplePlasmids()[0].sequence;
const TEST = sample.slice(0,1000);
const TEST_FEATURE = [
    {start: 50, stop: 100, name: "aaa", color:"#ff00ff"},
    {start: 110, stop: 200, name: "bbb", color:"#f2002f"},
    {start: 250, stop: 270, name: "ccc", color:"#00ff00"},
    {start: 460, stop: 467, name: "ddd", color:"#0100f1"},
]

/**
 * Reverses the DNA strand
 * @param  {str} seq The single-stranded sequence
 */
const reverseSequence = (seq) => {
    const code = {
        "A": "T",
        "T": "A",
        "C": "G",
        "G": "C",
    }

    return seq.replace(/[ACTG]/g, function($1) {return code[$1]});
}

export default function SequenceEditor(props){
  return(
    <PageContent {...props}/>
  )
}

function DnaSpan(props){
    const {dna, features, highlight} = props;
    // TODO: Don't use highlight, just add one highlight for each feature

    return(
        <span
            testFeature={features}
            style={{"--highlight":highlight}}
            class={style.seqBase}
            >
                {dna}
            </span>
    )

}

function PageContent(props){
    /**
     * The textual DNA editor
     */
    const {theme, language} = React.useContext(GlobalContext);
    const [sequence, setSequence] = React.useState(stripInput(TEST).toUpperCase());
    const [reverse, setReverse] = React.useState();
    const [page, setPage]= React.useState(0);
    const pageStart = page * pageLength;
    const pageStop = page * pageLength + pageLength;

    React.useEffect(() => {
        // Making the reversed sequence
        setReverse(reverseSequence(sequence))

    }, [sequence, reverse])

    /**
     * Splits a sequence, given the list of features with start and stop 
     * into a series of spans that makes up the viewer
     */
    const splitFeatures = (() => {
        console.log(sequence)
        // Store the spans
        let spans = []
        let reverseSpans = []

        // Sort by the start point, and only keep features within current page
        let currentFeatures = TEST_FEATURE
                                .filter(v => (v.start >= pageStart && v.start <= pageStop) 
                                             || 
                                             (v.stop >= pageStart && v.stop <= pageStop))

        console.log("c",currentFeatures);
        // Store all the starting and ending points
        let points = [];
        currentFeatures.forEach((v,i) => {
            points.push({location: Math.max(v.start, pageStart),index:i,type:"start"});
            points.push({location: Math.min(v.stop, pageStop),index:i,type:"stop"});
        })
        // Sort by their location
        points.sort((a, b) => (a.location > b.location) ? 1 : -1);
        // Store current position on the page
        let currentPos = 0;
        // Store array of all current elements
        let currentElements = [];

        points.forEach((v, i) => {
            console.log(v)
            if(v.location > currentPos){
                // Do not add anything if exact same spot
                console.log(currentPos, v.location);
                console.log(sequence.substring(currentPos, v.location))
                spans.push(<DnaSpan
                                features={currentElements}
                                highlight={currentElements.length > 0 ? currentFeatures[v.index].color : "#000000"}
                                dna={sequence.substring(currentPos, v.location)}
                            />);
                reverseSpans.push(<DnaSpan
                    features={currentElements}
                    highlight={currentElements.length > 0 ? currentFeatures[v.index].color : "#000000"}
                    dna={reverseSequence(sequence.substring(currentPos, v.location))}
                />);
            }
            if(v.type === "start"){
                // Add to the stack
                currentElements.push({...currentFeatures[v.index], index:v.index});
            }
            else{
                // Remove from stack if stop point
                console.log("stop")
                currentElements = currentElements.filter((w) => w.index !== v.index);
            }
            console.log(currentElements);
            // Increment location
            currentPos = v.location;
            console.log(currentPos);
            console.log('-----')
        })

        // Catch the remaining portion if applicable
        if(currentPos < pageStop){
            spans.push(<DnaSpan features={[]} dna={sequence.substring(currentPos, pageStop)}/>)
            reverseSpans.push(<DnaSpan features={[]} dna={reverseSequence(sequence.substring(currentPos, pageStop))}/>)
        }
    
        return(
            <>
                <div class={style.seqBaseHolder}>
                    {spans}
                </div>
                <div class={style.seqBaseHolderAbs} style={{"--offset": "1em"}}>
                    {reverseSpans}
                </div>
            </>
        )
    })

    return(
        <div class={style.seqHolder} >
            {splitFeatures()}
            {/* <div class={style.seqBase} reverse={reverse} style={{"--offset":"1em","--order":"1"}}>
                {sequence}
            </div> */}
            {/* <div class={style.seqPosition}
                style={{"--offset":"-1em","--order":"2"}}
                 contenteditable="true"
                 onBlur={e => setSequence(stripInput(e.currentTarget.textContent).toUpperCase() || sequence)}>
                {sequence}
            </div> */}
        </div>
    )
}

