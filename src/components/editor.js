import * as React from "react"
import { fetchFeatureTypes } from '../utils/FeatureUtils';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import InputAdornment from '@mui/material/InputAdornment';
import OptionAccordion from "./accordion";
import './cgview.css';
import * as style from "./editor.module.css"
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

function Editor(props)  
  {
    const {isEdit} = props;
    const [tab, setTab] = React.useState(0);
    const [initial, setInitial] = React.useState(true);
    const [localData, setLocalData] = React.useState([]);
    const [addName, setAddName] = React.useState("New Feature");
    const [addStart, setAddStart] = React.useState(0);
    const [addStop, setAddStop] = React.useState(100);
    const [addCategory, setAddCategory] = React.useState("User-defined");
    const [cgvFormat, setCgvFormat] = React.useState("circular");
    const [cgvDownload, setCgvDownload] = React.useState(false);
    const [showOrf, setShowOrf] = React.useState(false);
    const [showLegend, setShowLegend] = React.useState(true);
    const [panel, setPanel] = React.useState(false);
    const [plasmidName, setPlasmidName] = React.useState("Plasmid");
    const [isAddStart, setIsAddStart] = React.useState(false);
    const [isAddStop, setIsAddStop] = React.useState(false);
    const {sequence, data} = props;
    const [legendItems, setLegendItems] = React.useState([]);
    const [isBw, setIsBw] = React.useState(false);

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
          "name": "Plasmid",
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
        // If we are currently on the CGV tab, draw CGView
        const cgv = new CGV.Viewer('#my-viewer', {
            height: 500,
            width: 800,
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

        cgv.draw()
        if(cgvDownload){
            setCgvDownload(false);
            const height = 2000;
            // Here we adjust the width to be proportional to the height
            const width = cgv.width / cgv.height * height;
            cgv.io.downloadImage(width, height, 'cgview_map.png');
        }

    },[localData, cgvFormat, cgvDownload, panel, isAddStart, isAddStop, plasmidName, showLegend, showOrf, legendItems])



    return(
        <>  
            <h1 class={style.heading}>Editor</h1>
            <div class={style.editor}>
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
                        <Typography>Legend</Typography>
                        <div class={style.legendMap}>
                            {legendItems.map((v,i) => {
                                return(
                                    <TextField onChange={(e) => handleLegendUpdate(i,{name:e.target.value})} 
                                    id="add-name" label="Legend Name" variant="standard" 
                                    value={legendItems[i].name}
                                    />
                                )
                            })} 
                        </div>
                        
                    </div>
                    }
                </div>}
                <div class={style.drawing}>
                    <div class={style.svgwrap}>
                            <>
                                <div className={style.cgvMyViewer} id='my-viewer'><div></div></div>
                                <div className={style.cgvButtons}>
                                    <div onClick={() => setCgvDownload(true)} class="cgv-btn" id="btn-download" title="Download Map PNG"></div>
                                    <div onClick={() => setCgvFormat((cgvFormat == 'circular') ? 'linear' : 'circular')} class="cgv-btn" id="btn-toggle-format" title="Toggle Linear/Circular Format"></div>
                                </div>
                            </>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Editor