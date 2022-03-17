import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
 
import Editor from "../components/editor";
import { fetchFeatureTypes, stripInput, checkCommonEnzymes } from '../utils/FeatureUtils';
import { fetchSamplePlasmids } from "../utils/SamplePlasmids";
import * as style from '../components/index.module.css'

import InputTabs from "../components/inputtabs"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import LoopIcon from '@mui/icons-material/Loop';
import GlobalContext from "../context/optionContext";

import { Link } from "gatsby"

import axios from 'axios'
import { fetchFeatures, fetchSequence } from "../utils/FetchUtils";

const featureData = fetchFeatureTypes();
const samplePlasmids = fetchSamplePlasmids();

export default function IndexPage(props){
  return(
    <Layout>
      <PageContent {...props}/>
    </Layout>
  )
}

function PageContent(props){
  const {theme, setTheme, language, setLanguage} = React.useContext(GlobalContext);
  const [annotate,setAnnotate] = React.useState(false);
  const [sequence, setSequence] = React.useState("");
  const [loading, setLoading] = React.useState(false)
  const [firstLoad, setFirstLoad] = React.useState(false);
  const [data, setData] = React.useState([]);
  const {location} = props
  const [startTab, setStartTab] = React.useState(0);

  React.useEffect(() => {
    if(location.state?.nameSearch){
    setStartTab(2);
    fetchSequence(location.state.nameSearch)
        .then(data => {
                //console.log(data.data.plasmids);
                
                setSequence(data);
                annotateSequence(data);
            }
        )
        .catch(err =>{
                console.log(err);
            }
        );
  }
  },[location, firstLoad])

  const annotateSequence = (sequence) => {
    {
      setLoading(true);
      fetchFeatures(sequence)
           .then(featureTemp => {
                          setData(featureTemp)
                          setLoading(false);
                          document.getElementById('annotate').scrollIntoView();})
           .catch(err => console.log(err))
           
    }
  }
  
  // TODO: Move to separate components
  const TABS = [{name:"Sequence",
                content:<TextField
                    style={{width:`100%`,backgroundColor:`#fbfbfb`}}
                    id="outlined-multiline-static"
                    label="Paste your sequence here!"
                    multiline
                    rows={4}
                    onChange={e => setSequence(e.target.value)}
                    defaultValue=""></TextField>},
              {name:"Upload",
              content:<div>Upload File Here</div>},
              {name:"Database", 
              content:<Link to={`/search`}>Select From Database Here</Link>},
              {name:"Examples",
              content:<FormControl>
                        <FormLabel >Sequence</FormLabel>
                        <RadioGroup
                          value={sequence}
                          onChange={e => setSequence(e.target.value)}
                        >
                          {samplePlasmids.map(v => {
                            return(<FormControlLabel id={`sample-plasmid-${v.name}`} value ={v.sequence} control={<Radio sx={{color:'#5149b0','&.Mui-checked':{color: '#5149b0'}}} />} label={v.name}/>)
                          })}
                        </RadioGroup>
                      </FormControl>}]
  return(
  <>
    <Seo title="Home" />
    <div class={style.test}>
      <div class={style.circle1}>
      <div class={style.circleinner}>
        <svg class={style.insertsvg} height="100%" viewBox="0 0 100 100">
                                <circle r="22" fill="transparent"
                                    class={style.circleI1}
                                    stroke={theme.plasmid1}
                                    transform={`translate(50,50) rotate(90)`} />
                                <circle r="26" fill="transparent"
                                    class={style.circleI2}
                                    stroke={theme.plasmid2}
                                    transform={`translate(50,50) rotate(60)`} />
                                <circle r="30" fill="transparent"
                                    class={style.circleI2}
                                    stroke={theme.plasmid3}
                                    transform={`translate(50,50) rotate(130)`} />
                                <circle r="18" fill="transparent"
                                    class={style.circleI3}
                                    stroke={theme.plasmid4}
                                    transform={`translate(50,50) rotate(10)`} />
                            </svg>
      </div>
    </div>
    <div class={style.circle2}>
      <div class={style.circleinner}>
        <svg class={style.insertsvg} height="100%" viewBox="0 0 100 100">
                                <circle r="22" fill="transparent"
                                    class={style.circleI2}
                                    stroke={theme.plasmid1}
                                    transform={`translate(50,50) rotate(190)`} />
                                <circle r="26" fill="transparent"
                                    class={style.circleI1}
                                    stroke={theme.plasmid2}
                                    transform={`translate(50,50) rotate(160)`} />
                                <circle r="30" fill="transparent"
                                    class={style.circleI2}
                                    stroke={theme.plasmid3}
                                    transform={`translate(50,50) rotate(-130)`} />
                                <circle r="18" fill="transparent"
                                    class={style.circleI3}
                                    stroke={theme.plasmid4}
                                    transform={`translate(50,50) rotate(110)`} />
                                <circle r="14" fill="transparent"
                                    class={style.circleI3}
                                    stroke={theme.plasmid5}
                                    transform={`translate(50,50) rotate(100)`} />
                            </svg>
      </div>
    </div>
    </div>
    
    <div style={{width:"100px", height:"150px"}}></div>
    
    <p class={style.indexbody}>
    <div class={style.logodiv}><p class={style.logotitle}>PlasMapper <span class={style.logosmall}>3.0</span></p>
      <p class={style.catchphrase}>{language.CATCHPHRASE}</p></div>
      <div style={{marginTop:`100px`}}></div>
      <InputTabs start={startTab} tabs={TABS}></InputTabs>
      <a >
        <Button  
        onClick={annotateSequence} 
        onMouseEnter={() => setAnnotate(true)} onMouseLeave={() => setAnnotate(false)} class={style.indexbutton} variant="contained">Annotate!  {loading ? <i class={`${style.rotate} bi bi-arrow-repeat`}></i> : <i style={{right:`12px`,position:`absolute`,transform:`rotate(${annotate ? `90deg` : `0deg`})`,transition: `.3s ease-in-out`}} class={"bi bi-chevron-right "}></i>}</Button>
      </a>
      <div style={{marginTop:`250px`}}></div>
      <div id="annotate">
        <Editor isEdit={true} data={data} sequence={stripInput(sequence)}></Editor>
      </div>
      
    </p>
  </>
)}

