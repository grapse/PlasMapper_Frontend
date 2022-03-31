import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
 
import Editor from "../components/editor";
import { stripInput } from '../utils/FeatureUtils';
import { fetchSamplePlasmids } from "../utils/SamplePlasmids";
import * as style from '../styles/index.module.css'

import Button from "@mui/material/Button";

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
                setSequence(stripInput(data, true));
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
                          setSequence(stripInput(seq,true));
                          setLoading(false);
                          document.getElementById('annotate').scrollIntoView();
                        }
                          
                          )
           .catch(err => console.log(err))
           
    }
  }
  
  return(
    <div style={{...theme}}>
      <Seo title="Home" />
      <BackgroundDrawing/>
      <div style={{width:"100px", height:"150px"}}></div>
      <p class={style.indexbody}>
      <div class={style.logodiv}><p class={style.logotitle}>PlasMapper <span class={style.logosmall}>3.0</span></p>
        <p class={style.catchphrase}>{language.CATCHPHRASE}</p></div>
        <SequenceUpload annotate={annotateSequenceLoad} loading={loading}/>
        
        <div style={{marginTop:`250px`}}></div>
        <Link to={`editor`}
              state={{
                editorData:{
                  name:plasmidName,
                  data:data,
                  sequence:sequence
                }
              }}
              >
          <Button >{"Open Page"}</Button>
        </Link>
        <div id="annotate">
          <Editor isEdit={true} data={data} name={plasmidName} sequence={sequence} setSequence={setSequence}></Editor>
        </div>
        
      </p>
    </div>
)}

