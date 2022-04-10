import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
 
import Editor from "../components/editor";
import * as style from '../styles/index.module.css'

import GlobalContext from "../context/optionContext";

export default function EditorPage(props){
  return(
    <Layout>
      <PageContent {...props}/>
    </Layout>
  )
}

function PageContent(props){
  const {location} = props;
  const {theme, language} = React.useContext(GlobalContext);
  const [sequence, setSequence] = React.useState("");
  const [data, setData] = React.useState([]);
  const [plasmidName, setPlasmidName] = React.useState("");

  React.useEffect(() => {
    /**
     * Gets location data from main page
     */
    if(typeof location.state !== "undefined"){
        console.log(location.state)
        setData(location.state.editorData.data);
        setSequence(location.state.editorData.sequence);
        setPlasmidName(location.state.editorData.name);
    }
  },[location])

    return(
        <div style={{...theme}}>
            <Seo title="Editor" />
            <div style={{width:"100px", height:"70px"}}></div>
            <div class={style.indexbody}>    
                <div id="annotate">
                    <Editor isEdit={true} 
                            data={data} 
                            name={plasmidName} 
                            sequence={sequence} 
                            setSequence={setSequence}
                    ></Editor>
                </div>
            </div>
        </div>
)}