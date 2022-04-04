import * as React from "react"

import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';

import * as style from '../styles/sequenceeditor.module.css'
import { fetchFeatureTypes } from '../utils/FeatureUtils';

import GlobalContext from "../context/optionContext";

import {fetchSamplePlasmids} from "../utils/SamplePlasmids";
import {stripInput} from "../utils/FeatureUtils";
import IconButton from "@mui/material/IconButton";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const featureColors = fetchFeatureTypes(true);
console.log(featureColors)

/**
 * Get the average of a list of hex colors
 * @param  {array} colors The list of hex colors
 */
function averageColors(colors, alpha){
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
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// TODO: For testing purposes
const pageLength = 600;
const rowLength = 60;
// const sample = fetchSamplePlasmids()[0].sequence;
// const TEST = sample.slice(0,1000);
// const TEST_FEATURE = [
//     {start: 50, stop: 100, name: "Feature 1", legend:"Restriction Sites", strand: 1},
//     {start: 110, stop: 200, name: "Feature 2", legend:"Promoters", strand: -1 },
//     {start: 250, stop: 270, name: "Feature 3", legend:"Replication Origins", strand: 1},
//     {start: 460, stop: 467, name: "Feature 4", legend:"Selectable Markers", strand: 1},
//     {start: 450, stop: 470, name: "Feature 5", legend:"Genes", strand: 1},
// ]

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
    const {dna, features, start, stop, setSubstr, substr, reverse, download} = props;
    const [selected, setSelected] = React.useState(false);
    const color = features.length > 0 ? averageColors(features.map(v => featureColors[v.legend]), 0.3) : "rgba(255,255,255,0)";
    const borderColor = features.length > 0 ? averageColors(features.map(v => featureColors[v.legend]), 1) : "rgba(255,255,255,0)";

    return(
        <span
            style={{"--highlight":color,
                    "--border":borderColor,
                    "--offset":reverse ? "-100%" : "100%", 
                    "--line": reverse ? "underline" : "overline"}}
            class={`${style.seqBase} ${(substr?.start === start && substr?.strand === reverse) && style.seqBaseSelected}`}
            onClick={() => {
                            // Deselect if user clicks on same one again, else set to the selected strand
                            if(substr?.start === start && substr?.strand === reverse){
                                setSubstr(null);
                                setSelected(false);
                            }
                            else{
                                setSubstr({dna: dna, start: start, stop: stop, strand: reverse});
                                setSelected(true);
                            }
                            console.log(dna)}}
            >   
                {features.length > 0 && 
                <span class={style.tooltiptext} style={{}}>
                    <div class={style.holdFeatures}>
                        {features.map(v => <span>{v.name}</span>)}
                    </div>
                </span>}
                {dna}
            </span>
    )

}
// `
// Map all features into two "points" each - the start and the stop
// Sort these by their location on the sequence
// Allocate an array to keep current feature data
// Allocate an (html) element to keep the series of spans, and another for the reverse

// For each point:
//     To the html element, append a sequence span from the previous point to this one, 
//                                                          with the feature data array
//     Do the same, but for the reverse strand
//     If it is a "start" point:
//         Push the associated feature to the feature array
//     If it is a "stop" point:
//         Pop the associated feature from the array

// Return the forward and reverse html elements

// `

const splitFeatures = ((sequence, pageStop, pageStart, setSubsequence, substr, features) => {


    // Store the spans
    let spans = []
    let reverseSpans = []

    // Sort by the start point, and only keep features within current page
    let currentFeatures = features
                            .filter(v => (v.start >= pageStart && v.start < pageStop && v.visible) 
                                         || 
                                         (v.stop > pageStart && v.stop <= pageStop && v.visible)
                                         ||
                                         (v.start <= pageStart && v.stop >= pageStop && v.visible))
    console.log(currentFeatures);

    // Store all the starting and ending points
    let points = [];
    currentFeatures.forEach((v,i) => {
        points.push({location: Math.max(v.start, pageStart),index:i,type:"start"});
        points.push({location: Math.min(v.stop, pageStop),index:i,type:"stop"});
    })
    // Sort by their location
    points.sort((a, b) => (a.location > b.location) ? 1 : -1);
    // Store current position on the page
    let currentPos = pageStart;
    // Store array of all current elements
    var currentFeatureElements = [];

    points.forEach((v, i) => {
        if(v.location > currentPos){
            // Do not add anything if exact same spot
            spans.push(<DnaSpan
                            features={currentFeatureElements.filter(w => w.legend === "Restriction Sites" ||  w?.strand !== -1)}
                            substr={substr}
                            setSubstr={setSubsequence}
                            start={currentPos}
                            reverse={false}
                            stop={v.location}
                            dna={sequence.substring(currentPos, v.location)}
                        />);
            reverseSpans.push(<DnaSpan
                            features={currentFeatureElements.filter(w => w.legend === "Restriction Sites" || w.strand === -1)}
                            substr={substr}
                            start={currentPos}
                            stop={v.location}
                            reverse={true}
                            setSubstr={setSubsequence}
                            dna={reverseSequence(sequence.substring(currentPos, v.location))}
                        />);
        }
        if(v.type === "start"){
            // Add to the stack
            let newFeature = {...currentFeatures[v.index], index:v.index};
            currentFeatureElements = [...currentFeatureElements, newFeature];
        }
        else{
            // Remove from stack if stop point
            currentFeatureElements = currentFeatureElements.filter((w) => w.index !== v.index);
        }
        // Increment location
        currentPos = v.location;
    })

    // Catch the remaining portion if applicable
    if(currentPos < pageStop){
        spans.push(<DnaSpan features={[]} 
                            substr={substr}
                            start={currentPos}
                            reverse={false}
                            stop={pageStop}
                            setSubstr={setSubsequence}
                            dna={sequence.substring(currentPos, pageStop)}/>)
        reverseSpans.push(<DnaSpan features={[]} 
                            substr={substr}
                            start={currentPos}
                            reverse={true}
                            stop={pageStop}
                            setSubstr={setSubsequence}
                            dna={reverseSequence(sequence.substring(currentPos, pageStop))}/>)
    }

    return(
        <div class={style.seqHolder}>
            <div class={style.seqBaseHolderAbs} style={{"--offset": "0em"}}>
                {
                    [...Array(Math.floor(pageLength/rowLength))].map((_,i) => {
                        return(<span class={style.spacer} key={i}>{"----+----|----+----|----+----|----+----|----+----|----+----|"}</span>)
                    })
                }
            </div>
            <div class={style.seqBaseHolderAbs} style={{"--offset": "-1em"}}>
                {spans}
            </div>
            <div class={style.seqBaseHolder} style={{"--offset": "1em"}}>
                {reverseSpans}
            </div>
        </div>
    )
})

const TextDisplay = React.forwardRef((props, ref) => {
    const {page, sequence, pageStop, pageStart, handleSubsequenceUpdate, subsequence, features} = props;

    return(
        <div ref={ref} class={style.numberSeqHolder}>
            <div class={style.numHolder}>
                {[...Array(Math.floor(pageLength/rowLength))].map((_,i) => {
                    return(<span key={i}>{`${(page*pageLength)+(i*rowLength)+1}\n`}</span>)
                })}
            </div>
            {splitFeatures(sequence, pageStop, pageStart, handleSubsequenceUpdate, subsequence, features)}
            <div class={style.numHolder}>
                {[...Array(Math.floor(pageLength/rowLength))].map((_,i) => {
                    return(<span key={i}>{`${(page*pageLength)+(i*rowLength)+60}\n`}</span>)
                })}
            </div>
        </div>
    )

})

function PageContent(props){
    /**
     * The textual DNA editor
     */
    const {theme, language} = React.useContext(GlobalContext);
    const componentRef = React.useRef();
    const {sequence, setSequence, features, setFeatures} = props;

    const [reverse, setReverse] = React.useState();
    const [page, setPage]= React.useState(0);
    const [subsequence, setSubsequence] = React.useState(null);
    const [editSub, setEditSub] = React.useState("");
    const [insertSub, setInsertSub] = React.useState("");
    const [pageStart, setPageStart] = React.useState(page * pageLength);
    const [pageStop, setPageStop] = React.useState(page * pageLength + pageLength);
    const [download, setDownload] = React.useState(false);

    React.useEffect(() => {
        // Making the reversed sequence
        setReverse(reverseSequence(sequence))

    }, [sequence, reverse])

    React.useEffect(() => {
        // Set the page
        setPageStart(page * pageLength);
        setPageStop(page * pageLength + pageLength);

    }, [pageLength, page])

    function handleSubsequenceUpdate(sub){
        // Handle subsequence callback
        setSubsequence(sub)
        setEditSub(sub?.dna)
    }

    function insertSequence(dna, start, stop, reverse){
        if(reverse){
            dna = reverseSequence(dna);
        }
        const insertDiff = dna.length - (stop - start);
        console.log(insertDiff)

        // Insert the DNA
        setSequence(`${sequence.substring(0,start)}${dna}${sequence.substring(stop)}`)

        // Modify the features accordingly
        // If insertion
        if(start === stop){
            setFeatures(
                features.map((v,i) => {
                    return({...v, 
                            start: (v.start >= stop) ? v.start + insertDiff : v.start, 
                            stop: (v.stop > stop) ? v.stop + insertDiff : v.stop,
                })
                })
            )
        }
        // If edit/delete
        else{
            setFeatures(
                features
                .filter((v,i) => {
                    return(dna.length === 0 ? (v.start !== start || v.stop !== stop) : true);
                })
                .map((v,i) => {
                    return({...v, 
                            start: (v.start >= stop) ? v.start + insertDiff : v.start, 
                            stop: (v.stop > start) ? v.stop + insertDiff : v.stop,
                })
                })
            )
        }
    }

    return(
        <div class={`${style.editor} ${download ? style.isDownload : style.notDownload}`}>
            <div class={style.insertHolder}>
            <div class={style.alignHoriz}>
                <IconButton
                            onClick={() => page > 0 ? setPage(page - 1) : null}
                            edge="end"
                            >
                            {<NavigateBeforeIcon/>}
                        </IconButton>
                <TextField
                    label="Page"
                    type="number"
                    sx={{width:70}}
                    value={page + 1}
                    onChange={(e) => {
                                let newNum = e.target.value;
                                if(newNum > 0 && newNum <= Math.floor(sequence.length / pageLength) + 1){
                                    setPage(newNum - 1)
                                } }}
                    />
                <IconButton
                            onClick={() => page < Math.floor(sequence.length / pageLength) ? setPage(page + 1) : null}
                            edge="end"
                            >
                            {<NavigateNextIcon/>}
                        </IconButton>
            </div>
                {subsequence ? 
                <div class={style.editorSequence}>
                
                    <TextField
                        label={`Edit ${subsequence.strand ? 'reverse' : 'forward'} strand`}
                        multiline
                        rows={5}
                        value={editSub}
                        onChange={(e) => setEditSub(stripInput(e.target.value, true))}
                        />
                    
                    {`Preview ${!subsequence.strand ? 'reverse' : 'forward'} strand`}
                    <div class={style.reversePreview}>
                        {reverseSequence(editSub)}
                    </div>
                    <div class={style.alignHoriz}>
                        <IconButton
                            onClick={() => handleSubsequenceUpdate({...subsequence, strand: !subsequence.strand, dna: reverseSequence(subsequence.dna)})}
                            edge="end"
                            >
                            {<SwapHorizIcon/>}
                        </IconButton>
                        {"Swap strands"}
                    </div>
                    <div class={style.alignHoriz}>
                        <IconButton
                            onClick={() => {insertSequence("", subsequence.start, subsequence.stop, subsequence.strand)
                                            setSubsequence(null)}}
                            edge="end"
                            >
                            {<DeleteIcon/>}
                        </IconButton>
                        {"Delete entire segment"}
                    </div>
                    <div class={style.alignHoriz}>
                        <IconButton
                            onClick={() => {insertSequence(editSub, subsequence.start, subsequence.stop, subsequence.strand);
                                            setSubsequence(null)}}
                            edge="end"
                            >
                            {<CheckIcon/>}
                        </IconButton>
                        {"Save changes"}
                    </div>
                    {"Or insert a sequence:"}
                    
                    <TextField
                        label={`Edit Insertion`}
                        multiline
                        rows={5}
                        value={insertSub}
                        onChange={(e) => setInsertSub(stripInput(e.target.value, true))}
                        />
                    <div class={style.alignHoriz}>
                        <IconButton
                            onClick={() => insertSequence(insertSub, subsequence.start, subsequence.start, subsequence.strand)}
                            edge="end"
                            >
                            {<NavigateBeforeIcon/>}
                        </IconButton>
                        {"Insert Before"}
                    </div>
                    <div class={style.alignHoriz}>
                        <IconButton
                            onClick={() => insertSequence(insertSub, subsequence.stop, subsequence.stop, subsequence.strand)}
                            edge="end"
                            >
                            {<NavigateNextIcon/>}
                        </IconButton>
                        {"Insert After"}
                    </div>
                </div>
                :
                <div>
                <FormControlLabel
                control={
                    <Switch checked={download} onChange={() => setDownload(!download)} name="download" />
                }
                label="Toggle Downloadable View"
            />
            <button onClick={() => {
                exportComponentAsPNG(componentRef);
                }}
                disabled={!download}
                >
                Export As PNG
            </button>
            <br/>
            {"Click on a segment to open the editor here"}
            </div>
                }
            </div>
            <TextDisplay 
                ref={componentRef}
                page={page}
                features={features}
                sequence={sequence}
                pageStop={pageStop}
                pageStart={pageStart}
                handleSubsequenceUpdate={handleSubsequenceUpdate}
                subsequence={subsequence}
            />
            
        </div>
    )
}

