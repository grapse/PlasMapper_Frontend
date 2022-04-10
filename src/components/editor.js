import * as React from "react"
import { fetchFeatureTypes } from '../utils/FeatureUtils';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import OptionAccordion from "./accordion";
import GlobalContext from "../context/optionContext";
import Button from "@mui/material/Button";
import '../styles/cgview.css';
import InputAdornment from '@mui/material/InputAdornment';
import SequenceEditor from "./sequenceEditor";
import * as style from "../styles/editor.module.css"
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import PanToolIcon from '@mui/icons-material/PanTool';
import MouseIcon from '@mui/icons-material/Mouse';
import PaletteIcon from '@mui/icons-material/Palette';
import { Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
const CGV = require('cgview');

const tabs = ["Features", "Add Feature", "Restriction Sites","Other"]
const initialDownloadHeight = 500;
const maxDownload = 10000;
const minDownload = 500;
const maxFileSize = 1000000;

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

var cgvHandle = null;

function Editor(props)  
  {
    const targetRef = React.useRef();
    const {theme, setTheme, language, setLanguage} = React.useContext(GlobalContext);
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
    const [legendItems, setLegendItems] = React.useState([]);
    const [isBw, setIsBw] = React.useState(false);

    const [downloadHeight, setDownloadHeight] = React.useState(2000);
    const [downloadWidth, setDownloadWidth] = React.useState(3000);

    const [width, setWidth] = React.useState(700);
    const [height, setHeight] = React.useState(initialDownloadHeight);

    const [fileWarning, setFileWarning] = React.useState(false);

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
    }

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    const handleLegendUpdate = (index, val) => {
        setLegendItems(
            legendItems.map(
                (v,i) => {
                    return i === index ? {v, ...val} : v
                }
            )
        )
    }

    let test = localData.map(w => w.legend);
    let test2 = new Set(test);

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
            "items": legendItems.filter(v => test2.has(v.name)),
            "visible" : showLegend
          },
          "tracks": showOrf ? orfTracks : defaultTracks
        }
      }


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
        const myNode = document.getElementById("my-viewer");
        myNode.removeChild(myNode.childNodes[0]);
        const cgv = new CGV.Viewer('#my-viewer', {
            height: height,
            width: width,
            });
        cgv.on('click', (event) => {
            if (event.elementType === 'feature' && event.element.source === 'json-feature' && event.element?.tags.length) {
                // console.log(event.element.tags[0]);
                let curIndex = event.element.tags[0];
                // handleFeatureUpdate(curIndex, {...localData[curIndex], name:"test"})
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
                    console.log(uploadedFile);
                    if(Object.keys(uploadedFile).length !== 3 || !uploadedFile.name || !uploadedFile.sequence || !uploadedFile.features){
                        setFileWarning("File format error. File must be a JSON file with the following keys: name, sequence, features");
                        return;
                    }
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
                            {featureData.map((v,i) => {return <MenuItem value={v.display}>{v.display}</MenuItem>})}
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
                    <div class={style.restrictionGrid}>
                        {localData.map((v,i) => {return(
                            v.legend === "Restriction Sites" && v?.firstSite &&
                            <div class={v.count === 1 ? "" : style.restrictionInvisible}>
                                <div>{v.name}</div>
                                <div>{v.count}</div>
                                <Checkbox
                                    checked={v.visible}
                                    onChange={(e) => handleRestrictionUpdate(v.name,!v.visible)}
                                />
                            </div>
                        )})}
                    </div>
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