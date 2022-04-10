import * as React from "react"
import { Link } from "gatsby";
import '../styles/cgview.css';
import {fetchFeatures} from '../utils/FetchUtils';
import * as style from "../styles/editor.module.css";
import LinkIcon from '@mui/icons-material/Link';
import GlobalContext from "../context/optionContext";
const CGV = require('cgview');

function CustomLinkIcon(){
  return(<LinkIcon sx={{transform:"rotate(-30deg)", "vertical-align": "middle", "margin-left": "5px"}}/>)
}

function MiniEditor(props)  
  {
    const {theme} = React.useContext(GlobalContext);
    const [localData, setLocalData] = React.useState([]);
    
    const [cgvFormat, setCgvFormat] = React.useState("circular");
    const {sequence, nameSearch} = props;
    
    const json = {
        "cgview": {
          "version": "1.1.0",
          "sequence": {
            seq:sequence
          },
          "features": localData,
          "legend": {
              // Maps the preset feature data from above into the legend
            "items": [],
            "visible" : false
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
      fetchFeatures(sequence)
          .then(featureTemp => {
              setLocalData(featureTemp);
          }
          )
          .catch(err => console.log(err))
    }, [])

    React.useEffect(() => {
            const cgv = new CGV.Viewer('#my-viewer', {
                height: 300,
                width: 600,
              });
              
            cgv.io.loadJSON(json);
            const myNode = document.getElementById("my-viewer");
            myNode.removeChild(myNode.childNodes[0]);
            cgv.settings.update({ format: cgvFormat });

            cgv.draw()
    },[localData, cgvFormat])

    return(
          <div class={style.sidebarholder} style={{...theme}}>
                  <div id='my-viewer'><div></div></div>
                  <div>{`Sequence:`}</div>
                  <div class={style.sequence}>
                      {sequence}
                  </div>
                  <Link to={`/`} state={{ nameSearch: nameSearch }} class={style.openlink}>Open in Editor<CustomLinkIcon/></Link>
          </div>
    )
}

export default MiniEditor