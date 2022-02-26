import * as React from "react"
import { fetchFeatureTypes } from '../utils/FeatureUtils';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './cgview.css';
import * as style from "./editor.module.css"
const CGV = require('cgview');

const featureData = fetchFeatureTypes();
const legendItems = featureData.map((v,i) => {return {name:v.display,swatchColor:v.color,decoration:"arrow"}});

function Editor(props)  
  {
    const [tab, setTab] = React.useState(0);
    const [initial, setInitial] = React.useState(true);
    const [localData, setLocalData] = React.useState([]);
    const [showData, setShowData] = React.useState([]);
    const [addName, setAddName] = React.useState("New Feature");
    const [addStart, setAddStart] = React.useState(0);
    const [addStop, setAddStop] = React.useState(100);
    const [addCategory, setAddCategory] = React.useState("User-defined");
    const [cgvFormat, setCgvFormat] = React.useState("circular");
    const [cgvDownload, setCgvDownload] = React.useState(false);
    const {sequence, data} = props;
    
    const json = {
        "cgview": {
          "version": "1.1.0",
          "sequence": {
            seq:sequence
          },
          "features": localData.filter((v, i) => v.show === true && true),
          "legend": {
              // Maps the preset feature data from above into the legend
            "items": legendItems
          },
          "tracks": [
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
        }
      }

    React.useEffect(() => {
        // If it is currently getting fed a new plasmid
        if (initial === true){
            setLocalData(data);
            setShowData(data.map(v => true))
            console.log("changed");
        }

    }, [data])

    React.useEffect(() => {
        // If we are currently on the CGV tab, draw CGView
        if (tab === 0){
            const cgv = new CGV.Viewer('#my-viewer', {
                height: 500,
                width: 800,
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
        }

    },[localData, cgvFormat, cgvDownload])



    return(
        <>  
            <h1 class={style.heading}>Editor</h1>
            <div class={style.editor}>
                <div class={style.options}>
                <h2>Options</h2>
                    {localData.map((v, i) => ["ORF","Restriction Sites"].includes(v.legend) ? null : <div>
                                                <input onChange={() => {setLocalData(localData.map((v1,i1) => i === i1 ? {...v1,show:!v1.show} : v1))}} type="checkbox" name={`${v.name}-option`} value="Show" checked={localData[i].show}/>
                                                <label for={`${v.name}-option`}> {`${v.name}`}</label>
                                            </div>)}
                    <div class={style.newFeature}>
                        <button onClick={() => {
                                                setLocalData([...localData,{name:addName,start:addStart,stop:addStop,legend:addCategory,source:"json-feature",show:true}])}}
                                >Add Feature
                        </button>
                        <TextField onChange={(e) => setAddName(e.target.value)} id="add-name" label="Name" variant="standard" value={addName}/>
                        <TextField onChange={(e) => setAddStart(e.target.value)} id="add-start" label="Start" variant="standard" type="number" value={addStart}/>
                        <TextField onChange={(e) => setAddStop(e.target.value)} id="add-stop" label="Stop" variant="standard" type="number" value={addStop}/>
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

                </div>
                <div class={style.drawing}>
                   
                    <div class={style.svgwrap}>
                        { tab === 0 ?  
                            <>
                                <div className={style.cgvMyViewer} id='my-viewer'><div></div></div>
                                <div className={style.cgvButtons}>
                                    <div onClick={() => setCgvDownload(true)} class="cgv-btn" id="btn-download" title="Download Map PNG"></div>
                                    <div onClick={() => setCgvFormat((cgvFormat == 'circular') ? 'linear' : 'circular')} class="cgv-btn" id="btn-toggle-format" title="Toggle Linear/Circular Format"></div>
                                </div>
                                
                            </>
                            
                            :
                            <svg class={style.insertsvg} viewBox="0 0 100 100">
                            <defs>
                                <filter id="shadow">
                                <feDropShadow dx="0" dy="0" stdDeviation="0"
                                    flood-color="black"/>
                                </filter>
                            </defs>
                            <circle cx="50" cy="50" r="35" stroke={"#000"} stroke-width="0.5" fill={"#fff"} />

                            <circle r="35" fill="transparent"
                                stroke={"#00ffff"}
                                stroke-width="10"
                                stroke-dasharray="18.9 202"
                                transform="translate(50,50) rotate(90.7)" />
                            <circle r="35" fill="transparent"
                                stroke={"#ff0000"}
                                stroke-width="10"
                                stroke-dasharray="50 169.9"
                                transform="translate(50,50) rotate(190.7)" />
                            <circle r="35" fill="transparent"
                                stroke={"#ff00ff"}
                                stroke-width="10"
                                stroke-dasharray="30 189.9"
                                transform="translate(50,50) rotate(10.7)" />
                            <text x="37" y="50" style={{fontSize:`7px`}}>Plasmid</text>
                        </svg>
                        }
                        
                    </div>
                    
                    
                </div>
            </div>
        </>
    )
}

export default Editor