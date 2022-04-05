import * as React from "react"
import * as style from "../styles/sequenceupload.module.css"
import { Link } from "gatsby";
import LinkIcon from '@mui/icons-material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { fetchSamplePlasmids } from "../utils/SamplePlasmids";
import GlobalContext from "../context/optionContext";
import { FileUploader } from "react-drag-drop-files";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const samplePlasmids = fetchSamplePlasmids();

const WARNING_LENGTH = 200000;
const MAX_LENGTH = 500000;

function CustomLinkIcon(){
    return(<LinkIcon sx={{transform:"rotate(-30deg)", "vertical-align": "middle", "margin-left": "5px"}}/>)
}

function Or(){
    return(
    <>
        <div class={style.divholder}>
            <div class={style.connect}></div>
            <div class={style.or}>{"OR"}</div>
            <div class={style.connect}></div>
        </div>
        
    </>)
}

function ExampleButton(props){
    const {selected, name} = props;
    return(
        <button {...props} class={`${style.exampleButton} ${selected && style.exampleSelected}`}>{name}</button>
    )
}

function SequenceUpload(props) 
  {
    const {loading, annotate} = props;
    const {theme, language} = React.useContext(GlobalContext);
    const [file, setFile] = React.useState("");
    const [sample, setSample] = React.useState(-1);
    const [sequence, setSequence] = React.useState("");
    const [plasmidName, setPlasmidName] = React.useState("Plasmid");
    const [warning, setWarning] = React.useState(false);

    const MUItheme = createTheme({
        palette: {
          primary: {
            main: theme['--plasmid3'],
          },
          secondary: {
            main: theme['--plasmid3'],
          },
        },
    });

    function handleFile(e){
        const fileReader = new FileReader();
        fileReader.readAsText(e, "UTF-8");
        fileReader.onload = e => {
            changeSequence(e.target.result);
        }
    }

    /**
     * Takes the user input and updates the internal state accordingly, including warning messages.
     * @param  {str} seq The user input
     */
    function changeSequence(seq){
        setSample(-1);
        if(seq.length > WARNING_LENGTH){
            setWarning(language.SEQ_WARNING);
        }
        if(seq.length > MAX_LENGTH){
            setWarning(language.SEQ_ERROR);
            return setSequence(seq.substring(0, MAX_LENGTH));
        }
        if(seq.length <= WARNING_LENGTH){
            setWarning(false);
        }
        setSequence(seq);
    }

    return(
        <ThemeProvider theme={MUItheme}>
            <div class={style.box} style={{...theme}}>
                <Link to={'/search'} class={style.linkref}>
                    <div>{language.OPEN_LINK}<CustomLinkIcon/></div>
                </Link>
                <Or/>
                <TextField
                    style={{width:`100%`,backgroundColor:theme['--background']}}
                    id="outlined-multiline-static"
                    label={language.PASTE_SEQ}
                    InputProps={{
                        classes:{input:style.input}
                        }}
                    multiline
                    maxRows={3}
                    value={sequence}
                    onChange={(e) => changeSequence(e.target.value)}
                    />
                <Typography sx={{color:warning ? "red" : theme['--text'], fontSize: "1em"}}>{warning || language.SEQ_DETAILS}</Typography>
                <Or/>
                <FileUploader
                    children={
                        <div class={style.downloadBox}><UploadFileIcon />{"Drag & drop or click to upload .txt or .fasta DNA File (no protein)"}</div>
                    }
                    types={['txt','fasta','fna','ffn','faa','frn','fa']}
                    handleChange={(e) => handleFile(e)}
                    name="file"
                    id="raised-button-file"
                />
                <Or/>
                <Typography sx={{color:theme['--text'], fontSize: "1em"}}>{language.EXAMPLES}</Typography>
                <div class={style.buttonholder}>
                    {samplePlasmids.map((v,i) => {
                        return(<ExampleButton key={`sample-${i}`} 
                                              name={v.name}
                                              selected={sample === i}
                                              onClick={() => {
                                                  setPlasmidName(v.name);
                                                  setSample(sample === i ? -1 : i);
                                                  setSequence(sample !== i ? v.sequence : "");
                                                  }}
                                              />
                                              )
                    })}
                </div>
                <button  
                    class={style.annotateButton}
                    onClick={() => {console.log("CLICKED EXAMPLE", plasmidName); annotate(plasmidName, sequence)}} 
                    >
                    {`Annotate!`}
                </button>
                
            </div>
        </ThemeProvider>
    )
}

export default SequenceUpload