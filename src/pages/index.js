import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
 
import Editor from "../components/editor";
import { stripInput } from '../utils/FeatureUtils';
import { fetchSamplePlasmids } from "../utils/SamplePlasmids";
import * as style from '../styles/index.module.css'

import TextField from '@mui/material/TextField';

import GlobalContext from "../context/optionContext";

import { Link } from "gatsby"
import BackgroundDrawing from "../components/background";

import { fetchFeatures, fetchSequence } from "../utils/FetchUtils";
import SequenceUpload from "../components/sequenceupload";


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
  const [example,setExample] = React.useState(-1);
  const [exampleLoading,setExampleLoading] = React.useState(-1);
  const [sequence, setSequence] = React.useState("");
  const [loading, setLoading] = React.useState(false)
  const [firstLoad, setFirstLoad] = React.useState(false);
  const [data, setData] = React.useState([]);
  const {location} = props
  const [plasmidName, setPlasmidName] = React.useState("Plasmid");
  const [startTab, setStartTab] = React.useState(0);

  React.useEffect(() => {
    /**
     * Only used if the user clicked in from the search page
     * Makes it so it automatically annotates and scrolls to plasmid editor
     */
    if(location.state?.nameSearch){
    console.log(location.state)
    setStartTab(2);
    setPlasmidName(location.state.nameSearch);
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
   * Annotates the example DNA sequence
   */
   const annotateExampleSequence = (i) => {
    {
      console.log(sequence)
      setExampleLoading(i);
      fetchFeatures(sequence)
           .then(featureTemp => {
                          setData(featureTemp)
                          setExampleLoading(-1);
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
      setLoading(true);
      fetchFeatures(seq)
           .then(featureTemp => {
                          setData(featureTemp);
                          setSequence(seq);
                          setLoading(false);
                          document.getElementById('annotate').scrollIntoView();})
           .catch(err => console.log(err))
           
    }
  }
  
  // TODO: Move to separate components
  const TABS = [{name:"Enter Text",
                content:<TextField
                    style={{width:`100%`,backgroundColor:theme['--background'],color:theme['--text']}}
                    id="outlined-multiline-static"
                    label="Paste your sequence here!"
                    multiline
                    rows={4}
                    onChange={e => setSequence(e.target.value)}
                    defaultValue=""></TextField>},
              {name:"Upload File",
              content:<><div style={{color:theme['--text']}}>Upload Sequence File Here</div><input type="file" name="file" /></>},
              {name:"Browse Plasmids", 
              content:<Link style={{color:theme['--text']}} to={`/search`}>Click to Browse Database</Link>}]
  return(
  <div style={{...theme}}>
    <Seo title="Home" />
    <BackgroundDrawing/>
    <div style={{width:"100px", height:"150px"}}></div>
    <p class={style.indexbody}>
    <div class={style.logodiv}><p class={style.logotitle}>PlasMapper <span class={style.logosmall}>3.0</span></p>
      <p class={style.catchphrase}>{language.CATCHPHRASE}</p></div>
      <SequenceUpload annotate={annotateSequenceLoad} loading={loading}/>
      {/* <label style={{color:theme['--text']}}>Try our example plasmids:</label>
      <div class={style.examplecontainer} style={{color:theme['--text']}}>
        {samplePlasmids.map((v, i) => {
          return(<Button  
            onClick={() => {annotateExampleSequence(i);}} 
            onMouseEnter={() => {setExample(i); setSequence(v.sequence);}} onMouseLeave={() => {setExample(-1); setSequence("");}} class={style.indexexamplebutton} variant="contained">{v.name}  {(exampleLoading == i) ? <i class={`${style.rotate} bi bi-arrow-repeat`}></i> : <i style={{right:`12px`,position:`absolute`,transform:`rotate(${(example == i) ? `90deg` : `0deg`})`,transition: `.3s ease-in-out`}} class={"bi bi-chevron-right "}></i>}</Button>)
        })}
      </div>
      <div style={{marginTop:`60px`}}></div>
      <InputTabs start={startTab} tabs={TABS}></InputTabs>
      <a >
        <Button  
        onClick={annotateSequence} 
        onMouseEnter={() => setAnnotate(true)} onMouseLeave={() => setAnnotate(false)} class={style.indexbutton} variant="contained">Annotate!  {loading ? <i class={`${style.rotate} bi bi-arrow-repeat`}></i> : <i style={{right:`12px`,position:`absolute`,transform:`rotate(${annotate ? `90deg` : `0deg`})`,transition: `.3s ease-in-out`}} class={"bi bi-chevron-right "}></i>}</Button>
      </a> */}
      
      <div style={{marginTop:`250px`}}></div>
      <div id="annotate">
        <Editor isEdit={true} data={data} name={plasmidName} sequence={stripInput(sequence)} setSequence={setSequence}></Editor>
      </div>
      
    </p>
  </div>
)}

