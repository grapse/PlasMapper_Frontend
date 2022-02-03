import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as style from '../components/index.module.css'
import InputTabs from "../components/inputtabs"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Editor from "../components/editor";




function IndexPage(){
  const [annotate,setAnnotate] = React.useState(false);
  const [sequence, setSequence] = React.useState("");
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
              content:<div>Select From Database Here</div>},
              {name:"Examples",
              content:<div>Examples Here</div>}]
  return(
  <Layout>
    <Seo title="Home" />
    <p class={style.indexbody}>
      <div style={{marginTop:`100px`}}></div>
      <InputTabs tabs={TABS}></InputTabs>
      <a href={'#annotate'}>
        <Button  onMouseEnter={() => setAnnotate(true)} onMouseLeave={() => setAnnotate(false)} class={style.indexbutton} variant="contained">Annotate!  <i style={{right:`9px`,position:`absolute`,transform:`rotate(${annotate ? `90deg` : `-90deg`})`,transition: `.3s ease-in-out`}} class={"bi bi-chevron-right "}></i></Button>
      </a>
      <div style={{marginTop:`250px`}}></div>
      <div id="annotate">
        <Editor sequence={sequence}></Editor>
      </div>
      
    </p>
  </Layout>
)}

export default IndexPage
