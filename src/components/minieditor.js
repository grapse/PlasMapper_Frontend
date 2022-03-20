import * as React from "react"

import { Link } from "gatsby";
import '../styles/cgview.css';
import {fetchFeatures} from '../utils/FetchUtils';
import * as style from "../styles/editor.module.css"
const CGV = require('cgview');

function MiniEditor(props)  
  {
    const [tab, setTab] = React.useState(0);
    const [initial, setInitial] = React.useState(true);
    const [localData, setLocalData] = React.useState([]);
    
    const [cgvFormat, setCgvFormat] = React.useState("circular");
    const [cgvDownload, setCgvDownload] = React.useState(false);
    const {sequence, data, nameSearch} = props;
    
    const json = {
        "cgview": {
          "version": "1.1.0",
          "sequence": {
            seq:sequence
          },
          "features": localData,
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
            
          ]
        }
      }

    React.useEffect(() => {
        // If it is currently getting fed a new plasmid
        if (initial === true){
            fetchFeatures(sequence)
                .then(featureTemp => {
                    setLocalData(featureTemp);
                    console.log("changed");
                }
                )
                .catch(err => console.log(err))
        }

    }, [])

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
                        <div className={style.cgvMyViewer} id='my-viewer'><div></div></div>
                        <div style={{height:"200px",overflow:"auto",marginBottom:"20px"}}>
                            {`Sequence:\n${sequence}`}
                        </div>
                        <Link to={`/`} state={{ nameSearch: nameSearch }}>Open in Editor</Link>
                    </div>
                    
                    
                </div>
            </div>
        </>
    )
}

export default MiniEditor