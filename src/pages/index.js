import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
 
import Editor from "../components/editor";
import { stripInput } from '../utils/FeatureUtils';
import { fetchSamplePlasmids } from "../utils/SamplePlasmids";
import * as style from '../styles/index.module.css'

import InputTabs from "../components/inputtabs"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import GlobalContext from "../context/optionContext";

import { Link } from "gatsby"
import BackgroundDrawing from "../components/background";

import { fetchFeatures, fetchSequence } from "../utils/FetchUtils";

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
    /**
     * Only used if the user clicked in from the search page
     * Makes it so it automatically annotates and scrolls to plasmid editor
     */
    if(location.state?.nameSearch){
    console.log(location.state)
    setStartTab(2);
    fetchSequence(location.state.nameSearch)
        .then(data => {
                setSequence(data);
                annotateSequenceLoad(data);
            }
        )
        .catch(err =>{
                console.log(err);
            }
        );
  }
  },[location, firstLoad])

  /**
   * Annotates the provided DNA sequence
   */
  const annotateSequence = () => {
    {
      console.log(sequence)
      setLoading(true);
      fetchFeatures(sequence)
           .then(featureTemp => {
                          setData(featureTemp)
                          setLoading(false);
                          document.getElementById('annotate').scrollIntoView();})
           .catch(err => console.log(err))
           
    }
  }
  /**
   * Annotates the provided DNA sequence (from the search page)
   * @param  {str} seq The sequence provided by the search page
   */
  const annotateSequenceLoad = (seq) => {
    {
      console.log("search")
      console.log(seq)
      setLoading(true);
      fetchFeatures(seq)
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
                    style={{width:`100%`,backgroundColor:theme['--background'],}}
                    id="outlined-multiline-static"
                    label="Paste your sequence here!"
                    sx={{color:theme['--text']}}
                    multiline
                    rows={4}
                    onChange={e => setSequence(e.target.value)}
                    defaultValue=""></TextField>},
              {name:"Upload",
              content:<><div style={{color:theme['--text']}}>Upload File Here</div><input type="file" name="file" /></>},
              {name:"Database", 
              content:<Link style={{color:theme['--text']}} to={`/search`}>Select From Database Here</Link>},
              {name:"Examples",
              content:<FormControl style={{color:theme['--text']}}>
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
  <div style={{...theme}}>
    <Seo title="Home" />
    <BackgroundDrawing/>
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
  </div>
)}

