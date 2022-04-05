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
import { Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
const CGV = require('cgview');

const tabs = ["Features", "Add Feature", "Restriction Sites","Other"]

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

    function handleFeatureUpdate(index, val){
        setLocalData(
            localData.map(
                (v,i) => {
                    return i === index ? {...v, ...val} : v
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
            console.log("changed");
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
            height: 500,
            width: width,
            });
        cgv.on('click', (event) => {
            if (event.elementType === 'feature' && event.element.source === 'json-feature' && event.element?.tags.length) {
                // console.log(event.element.tags[0]);
                let curIndex = event.element.tags[0];
                console.log(curIndex);
                console.log(event.element);
                // handleFeatureUpdate(curIndex, {...localData[curIndex], name:"test"})
                handleClickOption(curIndex);
            }
            else if(event.elementType === 'backbone' && isAddStart){
                console.log("start")
                setIsAddStart(false);
                setAddStart(event.bp);
            }
            else if(event.elementType === 'backbone' && isAddStop){
                console.log("stop")
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
            console.log("NEW", orfLegendItem);
            console.log("NEW2", cgv.legend.items());
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

    },[localData, cgvReset, cgvZoomIn, cgvZoomOut, cgvMoveLeft, cgvMoveRight, cgvToggleLabels, cgvInvertColors, cgvFormat, cgvDownload, panel, isAddStart, isAddStop, plasmidName, showLegend, showOrf, legendItems])

    React.useLayoutEffect(() => {
        // Set the width of the viewer based on the width of the screen
        if (targetRef.current) {
          setWidth(targetRef.current.offsetWidth);
        }
      }, []);

    // TODO: move tabs to separate components
    return(
        <>  
            <h1 class={style.heading}>Editor</h1>
            <div style={{...theme}} class={style.editor}>
                {isEdit && <div class={style.options}>
                {<div class={style.optionTabs}>{
                    tabs.map((v,i) => <div class={`${style.option} ${tab === i && style.select}`} 
                                           key={i} onClick={() => setTab(i)}>{v}</div>)}
                </div>}
                    {tab === 0 ? <OptionAccordion localData={localData} 
                                     handleClickOption={handleClickOption}
                                     panel={panel}
                                     handleFeatureUpdate={handleFeatureUpdate}></OptionAccordion>
                    :
                    tab === 1 ?
                    <div class={style.newFeature}>
                        <button onClick={() => {
                                                setLocalData([...localData,{name:addName,start:addStop < addStart ? addStop : addStart,stop:addStop < addStart ? addStart : addStop,legend:addCategory,source:"json-feature",tags:localData.length,visible:true,strand:addStop < addStart ? -1 : 1}])}}
                                >Add Feature
                        </button>
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
                                onChange={(e) => setAddCategory(e.target.value)}
                            >
                            {featureData.map((v,i) => {return <MenuItem value={v.display}>{v.display}</MenuItem>})}
                            </Select>
                        </FormControl>
                    
                    </div>
                    :
                    tab === 2 ?
                    <div class={style.restrictionGrid}>
                        {localData.map((v,i) => {return(
                            v.legend === "Restriction Sites" &&
                            <div class={v.count === 1 ? "" : style.restrictionInvisible}>
                                <div>{v.name}</div>
                                <div>{v.count}</div>
                                <Checkbox
                                    checked={v.visible}
                                    onChange={(e) => handleFeatureUpdate(i,{visible:!v.visible})}
                                />
                            </div>
                        )})}
                    </div>
                    :
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
                         <TextField onChange={(e) => setDownloadHeight(e.target.value)} 
                            id="add-height" label="Set Download Height" type="number"
                            endAdornment={<InputAdornment position="end">px</InputAdornment>}
                            value={downloadHeight}
                            />
                         <TextField onChange={(e) => setDownloadWidth(e.target.value)} 
                            id="add-width" label="Set Download Width" type="number"
                            endAdornment={<InputAdornment position="end">px</InputAdornment>}
                            value={downloadWidth}
                            />
                            <Typography>{"Download"}</Typography>
                        <IconButton
                                onClick={() => setCgvDownload(true)}
                                onMouseDown={handleMouseDown}
                                edge="end"
                                >
                                {<DownloadIcon/>}
                            </IconButton>
                    </div>
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