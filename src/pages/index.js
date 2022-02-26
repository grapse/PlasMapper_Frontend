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
import { Link } from "gatsby"

import axios from 'axios'

const featureData = fetchFeatureTypes();
const samplePlasmids = fetchSamplePlasmids();

function IndexPage(){
  const [annotate,setAnnotate] = React.useState(false);
  const [sequence, setSequence] = React.useState("");
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([]);
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
  <Layout>
    <Seo title="Home" />
    <p class={style.indexbody}>
      <div style={{marginTop:`100px`}}></div>
      <InputTabs tabs={TABS}></InputTabs>
      <a >
        <Button  
        onClick={() => {
          // TODO: Move to util file
          setLoading(true);
          const strippedSequence = stripInput(sequence);
          //axios.get("http://localhost:3000/plasmids/meta").then(data => console.log(data));
          axios.post("http://localhost:3000/features",{sequence:strippedSequence}, {timeout: 1000})
               .then(data => {
                              // Map into desired array format for CGView
                              const convert = data.data;
                              var featureTemp = [];
                              convert.user = [];
                              convert.restrictionSites = [];
                              for (let i = 0; i < featureData.length; i++){
                                  featureTemp = [...featureTemp,...convert[featureData[i].id].map((v) => {
                                                      return {name:v.name,start:v.start,stop:v.stop,legend:featureData[i].display,source:"json-feature",show:true}
                                                  })
                                                ]
                              }
                              console.log(strippedSequence);
                              featureTemp = [...featureTemp, ...checkCommonEnzymes(strippedSequence)]
                              setData(featureTemp)
                              setLoading(false);
                              document.getElementById('annotate').scrollIntoView();})
               .catch(err => console.log(err))
               
        }} 
        onMouseEnter={() => setAnnotate(true)} onMouseLeave={() => setAnnotate(false)} class={style.indexbutton} variant="contained">Annotate!  {loading ? <i class={`${style.rotate} bi bi-arrow-repeat`}></i> : <i style={{right:`12px`,position:`absolute`,transform:`rotate(${annotate ? `90deg` : `0deg`})`,transition: `.3s ease-in-out`}} class={"bi bi-chevron-right "}></i>}</Button>
      </a>
      <div style={{marginTop:`250px`}}></div>
      <div id="annotate">
        <Editor data={data} sequence={stripInput(sequence)}></Editor>
      </div>
      
    </p>
  </Layout>
)}

export default IndexPage
