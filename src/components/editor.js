import * as React from "react"
import { fetchFeatureTypes, getAllMatches, countEnzymes, getNewEnzyme } from '../utils/FeatureUtils';
import {getAllEnzymes} from '../utils/AllEnzymes';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import Modal from '@mui/material/Modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import OptionAccordion from "./accordion";
import GlobalContext from "../context/optionContext";
import '../styles/cgview.css';
import InputAdornment from '@mui/material/InputAdornment';
import SequenceEditor from "./sequenceEditor";
import * as style from "../styles/editor.module.css"
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import PanToolIcon from '@mui/icons-material/PanTool';
import PaletteIcon from '@mui/icons-material/Palette';
import { Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
const CGV = require('cgview');

const tabs = ["Features", "Add Feature", "Restriction Sites","Other"]
const initialDownloadHeight = 500;
const maxDownload = 10000;
const minDownload = 500;
const maxFileSize = 1000000;
const maxEnzymes = 40;

const orfTracks = [
    {
        "name": "Features",
        "position": 'both',
        "dataType": 'feature',
        "dataMethod": 'source',
        "dataKeys": 'json-feature'
    },
    {
        name: "ORFs",
        position: 'both',
        dataType: 'feature',
        dataMethod: 'sequence',
        dataKeys: 'orfs',
        dataOptions: {
            start: 'ATG',
            stop: 'TAA,TAG,TGA',
            minORFLength: 100
        }
    }
  ]

const defaultTracks = [
    {
      "name": "Features",
      "position": 'both',
      "dataType": 'feature',
      "dataMethod": 'source',
      "dataKeys": 'json-feature'
    },
  ]

const featureData = fetchFeatureTypes();
const allEnzymes = getAllEnzymes();

var cgvHandle = null;

/**
 * Handles the restriction site tool
 */
function RestrictionAdd(props){
    const {setLocalData, sequence} = props;
    const {theme} = React.useContext(GlobalContext);

    const [nameSearch, setNameSearch] = React.useState("");
    const [originalEnzymes, setOriginalEnzymes] = React.useState(allEnzymes);
    const [filteredEnzymes, setFilteredEnzymes] = React.useState(allEnzymes);
    const [addList, setAddList] = React.useState([]);
    const [checked, setChecked] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [counted, setCounted] = React.useState(false);
    const [max, setMax] = React.useState(2);
    const [min, setMin] = React.useState(1);
    const [enzymes, setEnzymes] = React.useState([]);

    const [newName, setNewName] = React.useState("");
    const [newMatch, setNewMatch] = React.useState("");

    const [warning, setWarning] = React.useState(false);

    React.useEffect(() => {
        if(open){
            countSites();
            setCounted(true);
            setAddList([]);
            setChecked({});
            setNewMatch("");
            setNewName("");
            setNameSearch("");
            setMax(2);
            setMin(1);
            setWarning(false);
        }
    },[open])

    React.useEffect(() => {
        setFilteredEnzymes(
            originalEnzymes.filter(enzyme =>
                    (nameSearch ? `${enzyme.name}`.toLowerCase().indexOf(nameSearch.toLowerCase()) >= 0 : true)
                    &&
                    (counted ? enzyme?.count <= max : true)
                    &&
                    (counted ? enzyme?.count >= min : true)
                )
        )
    },[nameSearch, max, min, counted])

    const handleUpdateList = (data) => {
        if (addList.length >= maxEnzymes){
            setWarning(`You can only add up to ${maxEnzymes} enzymes at a time!`);
            return;
        }
        else{
            setAddList([...addList, data])
            setChecked({...checked, [data.name]: true});
            setWarning(false);
        }
    };

    const handleRemoveList = (data) => {
        setAddList(addList.filter(item => item.name !== data.name));
        setChecked({...checked, [data.name]: false});
        setWarning(false);
    };

    const countSites = () => {
        const countSites = countEnzymes(sequence, originalEnzymes);
        setCounted(true);
        setOriginalEnzymes(countSites);
        setFilteredEnzymes(countSites);
        setNameSearch("");
        setMin(1);
    }

    const updateEnzymes = () => {
        if(!/^[actgnmrwyskhbvd]+$/.test(newMatch.toLowerCase())){
            setWarning("The pattern must use the following: A, C, T, G, N (any), M (a|c), R (a|g), W (a|t), S (c|g), Y (c|t), K (g|t), V (a|c|g), H (a|c|t), D (a|g|t), B (c|g|t)");
            return;
        }
        if(newName.length > 32 || newMatch.length > 32){
            setWarning("The name and pattern must be less than 32 characters long");
            return;
        }
        let newEnzyme = getNewEnzyme(sequence, newName, newMatch);
        setOriginalEnzymes([...originalEnzymes, newEnzyme]);
    }

    const addSites = () => {
        let newMatches = getAllMatches(sequence, addList);
        console.log(newMatches);
        setLocalData(newMatches);
        setOpen(false);
    }

    return(
        <div class={style.restrictionAdder}>
        <button onClick={() => setOpen(true)}>Add Enzymes</button>
            <Modal  style={{...theme}} open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
                <Box class={style.modal + " " + style.restrictionAdder}>
                <div class={`${style.restrictionOptions} ${style.restrictionOptionsAdd}`}>
                    <div class={style.addRow}>
                        <Typography>{"Add these enzymes:"}</Typography>
                    </div>
                    <div class={style.addRow}>
                        {warning && <Typography sx={{color:"red"}}>{warning}</Typography>}
                    </div>
                    {addList.map((v,i) => {return(
                        <div class={style.restrictionItem} key={i}>
                            <Checkbox size="small"
                                checked={true}
                                onChange={(e) => handleRemoveList(v)}
                            />
                            <div>{v.name}{counted && <span>{` (${v.count})`}</span>}</div>
                        </div>
                    )})}
                </div>
                <div class={style.addRow}>
                    <TextField onChange={(e) => setNewName(e.target.value)} 
                        value={newName} id="input-enzyme" 
                        label="Add Enzyme Name" 
                        size="small"
                        variant="standard" />
                    <TextField onChange={(e) => setNewMatch(e.target.value)} 
                        value={newMatch} id="input-enzyme" 
                        label="Add Cutting Pattern" 
                        size="small"
                        variant="standard" />
                    <button disabled={newMatch.length < 3 || newName.length < 1} onClick={() => updateEnzymes()}>Add Custom</button>
                </div>
                <div class={style.addRow}>
                    <TextField onChange={(e) => setNameSearch(e.target.value)} 
                        value={nameSearch} id="input-enzyme" 
                        label="Search Enzyme Name" 
                        size="small"
                        variant="standard" />
                    {counted ?
                    <>
                        <TextField
                            type="number"
                            label="Min"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                        />
                        <TextField
                            type="number"
                            label="Max"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                        />
                    </>
                    :
                    <div>{"Counting..."}</div>
                    }
                </div>
                <div class={style.restrictionOptions}>
                    {filteredEnzymes.map((v,i) => {return(
                        <div class={style.restrictionItem} key={i}>
                            <Checkbox size="small"
                                disabled={v?.count < 1}
                                checked={checked?.[v.name] ? true : false}
                                onChange={(e) => checked[v.name] ? handleRemoveList(v) : handleUpdateList(v)}
                            />
                            <div>{v.name}{counted && <span>{` (${v.count})`}</span>}</div>
                        </div>
                    )})}
                </div>
                <div class={style.addRow}>
                    <button onClick={() => setOpen(false)}>Cancel</button>
                    <button disabled={addList.length < 1} onClick={() => addSites()}>Add Selected</button>
                </div>
                </Box>
            </Modal>
        </div>
    )
}

function Editor(props)  
  {
    const targetRef = React.useRef();
    const {theme} = React.useContext(GlobalContext);
    const {isEdit} = props;
    const {sequence, data, name, setSequence} = props;
    
    const [tab, setTab] = React.useState(0);
    const [initial, setInitial] = React.useState(true);
    const [localData, setLocalData] = React.useState([]);
    const [addName, setAddName] = React.useState("New Feature");
    const [addStart, setAddStart] = React.useState(0);
    const [addStop, setAddStop] = React.useState(100);
    const [addCategory, setAddCategory] = React.useState("User-defined");
    const [cgvFormat, setCgvFormat] = React.useState("circular");
    const [cgvDownload, setCgvDownload] = React.useState(false);
    const [cgvReset, setCgvReset] = React.useState(() => {});
    const [cgvZoomIn, setCgvZoomIn] = React.useState(() => {});
    const [cgvZoomOut, setCgvZoomOut] = React.useState(() => {});
    const [cgvMoveLeft, setCgvMoveLeft] = React.useState(() => {});
    const [cgvMoveRight, setCgvMoveRight] = React.useState(() => {});
    const [cgvToggleLabels, setCgvToggleLabels] = React.useState(() => {});
    const [cgvInvertColors, setCgvInvertColors] = React.useState(() => {});
    const [showOrf, setShowOrf] = React.useState(false);
    const [showLegend, setShowLegend] = React.useState(true);
    const [panel, setPanel] = React.useState(false);
    const [plasmidName, setPlasmidName] = React.useState(name || "Plasmid");
    const [isAddStart, setIsAddStart] = React.useState(false);
    const [isAddStop, setIsAddStop] = React.useState(false);
    const [legendItems, setLegendItems] = React.useState(featureData.map((v,i) => {return {name:v.display,swatchColor:v.color,bwColor:v.bwColor,decoration:v.decoration}}));
    const [isBw, setIsBw] = React.useState(false);

    const [downloadHeight, setDownloadHeight] = React.useState(2000);
    const [downloadWidth, setDownloadWidth] = React.useState(3000);

    const [width, setWidth] = React.useState(700);
    const [height, setHeight] = React.useState(initialDownloadHeight);

    const [fileWarning, setFileWarning] = React.useState(false);

    const [restrictionDetails, setRestrictionDetails] = React.useState(true);

    let allLegendItems = localData.map(w => w.legend);
    let allLegendItemsSet = new Set(allLegendItems);
    const json = {
        "cgview": {
        "version": "1.1.0",
        "name": plasmidName,
        "captions": [
            {
                "backgroundColor": "rgba(255,255,255,0.4)",
                "font": "sans-serif,plain,18",
                "fontColor": "rgba(163,107,6,1)",
                "name": plasmidName,
                "position": "bottom-center",
                "textAlignment": "left"
            }],
        "sequence": {
            seq:sequence
        },
        "features": localData,
        "legend": {
            // Maps the preset feature data from above into the legend
            "items": legendItems.filter(v => allLegendItemsSet.has(v.name)),
            "visible" : showLegend
        },
        "tracks": showOrf ? orfTracks : defaultTracks
        }
    }

    /**
     * Updates the feature at a specified index with the specified values
     * @param  {int} index The index of the feature to update
     * @param  {obj} val The attribute(s) to be updated in the feature
     */
    function handleFeatureUpdate(index, val){
        setLocalData(
            localData.map(
                (v,i) => {
                    return i === index ? {...v, ...val} : v
                }
            )
        );
    }

    /**
     * Updates the features array with new features
     * @param  {array} newFeatures The new features to be added
     */
    function addNewFeatures(newFeatures){
        setLocalData(
            [...localData, ...newFeatures]
        );
    }

    /**
     * Updates the visibility of a specified restriction site
     * @param  {str} enzyme The name of the restriction site
     * @param  {bool} visible The visibility to change it to
     */
     function handleRestrictionUpdate(enzyme, visible){
        setLocalData(
            localData.map(
                (v,i) => {
                    return v.legend === "Restriction Sites" && v.name === enzyme ? {...v, visible: visible} : v
                }
            )
        );
    }
    
    function handleClickOption(option){
        setPanel(panel === option ? false : option)
        setTab(0);
    }

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    React.useEffect(() => {
        // If it is currently getting fed a new plasmid
        if (initial === true){
            setLocalData(data);
            setLegendItems(featureData.map((v,i) => {return {name:v.display,swatchColor:v.color,bwColor:v.bwColor,decoration:v.decoration}}))
        }

    }, [data])

    React.useEffect(() => {
        // Modify legend colours
        setLegendItems(legendItems.map((v,i) => {return {...v, swatchColor:v.bwColor, bwColor:v.swatchColor}}))
    }, [isBw])

    React.useEffect(() => {
        // Change the name based on the inputted prop
        setPlasmidName(name);
    }, [name])

    React.useEffect(() => {
        // If we are currently on the CGV tab, draw CGView
        const cgv = new CGV.Viewer('#my-viewer', {
            height: height,
            width: width,
            });
        cgv.on('click', (event) => {
            if (event.elementType === 'feature' && event.element.source === 'json-feature' && event.element?.tags.length) {
                let curIndex = event.element.tags[0];
                handleClickOption(curIndex);
            }
            else if(event.elementType === 'backbone' && isAddStart){
                setIsAddStart(false);
                setAddStart(event.bp);
            }
            else if(event.elementType === 'backbone' && isAddStop){
                setIsAddStop(false);
                setAddStop(event.bp);
            }
        });
        cgv.io.loadJSON(json);
        const myNode = document.getElementById("my-viewer");
        myNode.removeChild(myNode.childNodes[0]);
        
        cgv.settings.update({ format: cgvFormat });

        if (isBw == true){
            setTimeout(function (){
            var orfLegendItem = cgv.legend.items()[cgv.legend.items().length - 1];
            orfLegendItem["swatchColor"] = "#001";
            cgv.legend.updateItems(orfLegendItem);
            cgv.draw();
            }, 1000)
        } else{
            cgv.draw();
        }
        
        // Viewer buttons
        if(cgvDownload){
            // Download the map
            setCgvDownload(false);
            cgv.io.downloadImage(downloadWidth, downloadHeight, 'cgview_map.png');
        }

        cgvHandle = cgv;

    },[localData, cgvReset, cgvZoomIn, cgvZoomOut, cgvMoveLeft, cgvMoveRight, cgvToggleLabels, cgvInvertColors, cgvFormat, cgvDownload, panel, isAddStart, isAddStop, plasmidName, showLegend, showOrf, legendItems, height, width])

    React.useLayoutEffect(() => {
        // Set the width of the viewer based on the width of the screen
        if (targetRef.current) {
          setWidth(targetRef.current.offsetWidth);
          setDownloadWidth(targetRef.current.offsetWidth*2);
          setDownloadHeight(initialDownloadHeight*2);
        }
      }, []);

    /**
     * Downloads the current map in JSON format in case the user wants to come back later
     */
    function downloadJSON(){
        let json = {}
        json.name = plasmidName;
        json.sequence = sequence;
        json.features = localData;
        const a = document.createElement('a');
        a.href = URL.createObjectURL( new Blob([JSON.stringify(json)], { type:`application/json` }) );
        a.download = `${plasmidName}-json.json`;
        a.click();
    }

    /**
     * Uploads a JSON file to the current map
     * @param  {file} file The file to upload
     */
    function uploadJSON(file){
        if(file.type !== "application/json"){
            setFileWarning("File must be a JSON file");
            return;
        }
        if(file.size > maxFileSize){
            setFileWarning("File is over 1mb. File may be incorrect.");
            return;
        }
        setFileWarning(false);

        try{
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = file => {
                try{
                    let uploadedFile = JSON.parse(file.target.result);
                    if(Object.keys(uploadedFile).length !== 3 || !uploadedFile.name || !uploadedFile.sequence || !uploadedFile.features){
                        setFileWarning("File format error. File must be a JSON file with the following keys: name, sequence, features");
                        return;
                    }
                    setLegendItems(featureData.map((v,i) => {return {name:v.display,swatchColor:v.color,bwColor:v.bwColor,decoration:v.decoration}}));
                    setPlasmidName(uploadedFile.name);
                    setSequence(uploadedFile.sequence);
                    setLocalData(uploadedFile.features);
                }
                catch(err){
                    setFileWarning("File is not a valid JSON file");
                    return;
                }
            }
        }
        catch(err){
            setFileWarning("File is not a valid JSON file");
            return;
        }
        
    }

    return(
        <>  
            <h1 class={style.heading}>Editor</h1>
            <div style={{...theme}} class={style.editor}>
                {isEdit && <div class={style.options}>
                {<div class={style.optionTabs}>{
                    tabs.map((v,i) => <div class={`${style.option} ${tab === i && style.select}`} 
                                           key={i} onClick={() => setTab(i)}>{v}</div>)}
                </div>}
                    {[<OptionAccordion localData={localData} 
                                     handleClickOption={handleClickOption}
                                     panel={panel}
                                     handleFeatureUpdate={handleFeatureUpdate}></OptionAccordion>
                    ,
                    <div class={style.newFeature}>
                        
                        <TextField onChange={(e) => setAddName(e.target.value)} 
                                   id="add-name" label="Name" variant="standard" 
                                   value={addName}
                                   
                                   />
                        <TextField onChange={(e) => setAddStart(e.target.value)} 
                                   id="add-start" label="Start" variant="standard" type="number" 
                                   value={addStart}
                                   InputProps={{endAdornment: 
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setIsAddStart(true)}
                                                onMouseDown={handleMouseDown}
                                                edge="end"
                                                >
                                                {<TouchAppIcon/>}
                                            </IconButton>
                                        </InputAdornment>,
                                    }}
                                   />
                        <TextField onChange={(e) => setAddStop(e.target.value)} id="add-stop" label="Stop" 
                                    variant="standard" type="number" value={addStop}
                                    InputProps={{endAdornment: 
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setIsAddStop(true)}
                                                onMouseDown={handleMouseDown}
                                                edge="end"
                                                >
                                                {<TouchAppIcon/>}
                                            </IconButton>
                                        </InputAdornment>,
                                    }}
                                    />
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="add-category"
                                value={addCategory}
                                label="Category"
                                size="small"
                                onChange={(e) => setAddCategory(e.target.value)}
                            >
                            {featureData.map((v,i) => {return <MenuItem key={i} value={v.display}>{v.display}</MenuItem>})}
                            </Select>
                        </FormControl>
                        <button     
                                class={style.addFeatureButton}
                                onClick={() => {
                                                setLocalData([...localData,{name:addName,start:addStop < addStart ? addStop : addStart,stop:addStop < addStart ? addStart : addStop,legend:addCategory,source:"json-feature",tags:localData.length,visible:true,strand:addStop < addStart ? -1 : 1}])}}
                                >Add
                        </button>
                    
                    </div>
                    ,
                    <>

                    <div class={style.restrictionGrid}>
                        {localData.map((v,i) => {return(
                            v.legend === "Restriction Sites" && v?.firstSite &&
                            <div key={i} class={v.count === 1 ? "" : style.restrictionInvisible}>
                                <div>{v.name}</div>
                                <div>{v.count}</div>
                                <Checkbox
                                    checked={v.visible}
                                    onChange={(e) => handleRestrictionUpdate(v.name,!v.visible)}
                                />
                            </div>
                        )})}
                    </div>
                    {restrictionDetails && <RestrictionAdd sequence={sequence} setLocalData={addNewFeatures}/>}
                    </>
                     ,
                    <div class={style.optionOther}>
                        <FormControlLabel control={
                            <Checkbox
                                checked={showOrf}
                                onChange={() => setShowOrf(!showOrf)}
                            />
                        } label="Show ORFs" />
                        <FormControlLabel control={
                            <Checkbox
                            checked={showLegend}
                            onChange={() => setShowLegend(!showLegend)}
                        />
                        } label="Show Legend" />
                        <FormControlLabel control={
                            <Checkbox
                            checked={isBw}
                            onChange={() => setIsBw(!isBw)}
                        />
                        } label="Greyscale Mode" />
                        <TextField onChange={(e) => setPlasmidName(e.target.value)} 
                            id="add-name" label="Plasmid Name" variant="standard" 
                            value={plasmidName}
                            />
                         <TextField onChange={(e) => {
                                let newVal = e.target.value;
                                if(newVal < minDownload){newVal = minDownload}
                                if(newVal > maxDownload){newVal = maxDownload}
                                setDownloadHeight(newVal);
                                setHeight(width/(downloadWidth/newVal));
                                }} 
                            id="add-height" label="Set Download Height" type="number"
                            InputProps={{endAdornment: 
                                <InputAdornment position="end">px</InputAdornment>
                                    }}
                            value={downloadHeight}
                            />
                         <TextField onChange={(e) => {
                                let newVal = e.target.value;
                                if(newVal < minDownload){newVal = minDownload}
                                if(newVal > maxDownload){newVal = maxDownload}
                                setDownloadWidth(newVal);
                                setHeight(width/(newVal/downloadHeight));
                                }} 
                            id="add-width" label="Set Download Width" type="number"
                            InputProps={{endAdornment: 
                                <InputAdornment position="end">px</InputAdornment>
                                    }}
                            value={downloadWidth}
                            />
                        <div class={style.downloadHolder}>
                            <Typography >{"Download PNG"}</Typography>
                            <IconButton
                                    onClick={() => setCgvDownload(true)}
                                    onMouseDown={handleMouseDown}
                                    edge="end"
                                    >
                                    {<DownloadIcon/>}
                                </IconButton>
                        </div>
                        <div class={style.downloadHolder}>
                            <Typography >{"Download JSON"}</Typography>
                            <IconButton
                                    onClick={() => downloadJSON()}
                                    onMouseDown={handleMouseDown}
                                    edge="end"
                                    >
                                    {<DownloadIcon/>}
                                </IconButton>
                        </div>
                        <div class={style.downloadHolder}>
                            <Typography >{"Upload JSON"}</Typography>
                            <input
                                type="file"
                                accept="application/json"
                                onChange={(e) => uploadJSON(e.target.files[0])}
                                />
                        </div>
                        {fileWarning && <Typography sx={{color:"red"}}>{fileWarning}</Typography>}
                    </div>].map((v,i) => tab === i && v)
                    }
                </div>}
                <div class={style.drawing} ref={targetRef}>
                    <div class={style.svgwrap}>
                            <>
                                <span class={style.cgvbuttonholder}>
                                    <ZoomInIcon sx={{height:'0.75em', width:'0.75em', marginLeft:'5px'}}></ZoomInIcon>
                                    <Typography sx={{fontSize:'small', marginLeft:'2px'}}>Zoom by scrolling</Typography>
                                    <PanToolIcon sx={{height:'0.75em', width:'0.75em', marginLeft:'10px'}}></PanToolIcon>
                                    <Typography sx={{fontSize:'small', marginLeft:'3px'}}>Drag to change position</Typography>
                                    <PaletteIcon sx={{height:'0.75em', width:'0.75em', marginLeft:'10px'}}></PaletteIcon>
                                    <Typography sx={{fontSize:'small', marginLeft:'3px'}}>Click legend to change colours</Typography>
                                </span>
                                <div id='my-viewer'><div></div></div>
                                <div className={style.cgvButtons}>
                                    <div onClick={() => setCgvDownload(true)} class="cgv-btn" id="btn-download" title="Download Map PNG"></div>
                                    <div onClick={() => setCgvFormat((cgvFormat == 'circular') ? 'linear' : 'circular')} class="cgv-btn" id="btn-toggle-format" title="Toggle Linear/Circular Format"></div>
                                    <div onClick={() => cgvHandle.reset()} class="cgv-btn" id="btn-reset" title="Reset Map"></div>
                                    <div onClick={() => cgvHandle.zoomIn()} class="cgv-btn" id="btn-zoom-in" title="Zoom In"></div>
                                    <div onClick={() => cgvHandle.zoomOut()} class="cgv-btn" id="btn-zoom-out" title="Zoom Out"></div>
                                    <div onClick={() => cgvHandle.moveLeft()} class="cgv-btn" id="btn-move-left" title="Move Left/Counterclockwise"></div>
                                    <div onClick={() => cgvHandle.moveRight()} class="cgv-btn" id="btn-move-right" title="Move Right/Clockwise"></div>
                                    <div onClick={() => {cgvHandle.annotation.update({visible: !cgvHandle.annotation.visible}); cgvHandle.draw();}} class="cgv-btn" id="btn-toggle-labels" title="Toggle Labels"></div>
                                    <div onClick={() => cgvHandle.invertColors()} class="cgv-btn" id="btn-invert-colors" title="Invert Map Colors"></div>
                                </div>
                            </>
                    </div>
                </div>
                <SequenceEditor sequence={sequence} setSequence={setSequence} features={localData} setFeatures={setLocalData}/>
            </div>
        </>
    )
}

export default Editor