import * as React from "react"
import { fetchFeatureTypes } from '../utils/FeatureUtils';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from "gatsby";
import './cgview.css';
import * as style from "./editor.module.css"
const CGV = require('cgview');

const featureData = fetchFeatureTypes();
const legendItems = featureData.map((v,i) => {return {name:v.display,swatchColor:v.color,decoration:"arrow"}});

function MiniEditor(props)  
  {
    const {isEdit} = props;
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
    const {sequence, data, nameSearch} = props;
    
    const json = {
        "cgview": {
          "version": "1.1.0",
          "sequence": {
            seq:sequence
          },
          "features": localData.filter((v, i) => v.show === true && true),
          "legend": {
              // Maps the preset feature data from above into the legend
            "items": []
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
                height: 300,
                width: 300,
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
            <div style={{display:"flex",width:"90%",gap:"20px",flexDirection:"row","backgroundColor":"#fff",padding:"70px 30px",margin:"20px",boxShadow:"10px 10px 35px rgba(0,0,0,0.3)",alignItems:"center",justifyContent:"center"}}>
                <div class={style.drawing}>
                    <div >
                        { tab === 0 ?  
                            <>
                                <div className={style.cgvMyViewer} id='my-viewer'><div></div></div>
                                <div className={style.cgvButtons}>
                                    <div onClick={() => setCgvDownload(true)} class="cgv-btn" id="btn-download" title="Download Map PNG"></div>
                                    <div onClick={() => setCgvFormat((cgvFormat == 'circular') ? 'linear' : 'circular')} class="cgv-btn" id="btn-toggle-format" title="Toggle Linear/Circular Format"></div>
                                </div>
                                <div style={{height:"200px",overflow:"auto",marginBottom:"20px"}}>{`Sequence:\n${sequence}`}</div>
                                <Link to={`/`} state={{ nameSearch: nameSearch }}>Open in Editor</Link>
                                
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

export default MiniEditor