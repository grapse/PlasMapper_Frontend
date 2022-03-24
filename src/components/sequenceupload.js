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
        fileReader.readAsText(e.target.files[0], "UTF-8");
        console.log(e.target.files[0]);
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
                    InputProps={{input:{color:"white"}}}
                    multiline
                    rows={4}
                    value={sequence}
                    onChange={(e) => changeSequence(e.target.value)}
                    />
                <Typography sx={{color:warning ? "red" : theme['--text']}}>{warning || language.SEQ_DETAILS}</Typography>
                <Or/>
                <div class={style.inputButton}>
                    <input
                        accept="text/*"
                        id="raised-button-file"
                        onChange={(e) => handleFile(e)}
                        type="file"
                    />
                </div>
                <Typography sx={{color:theme['--text']}}>{language.FILE_SPEC}</Typography>
                <Or/>
                <Typography sx={{color:theme['--text']}}>{language.EXAMPLES}</Typography>
                <div class={style.buttonholder}>
                    {samplePlasmids.map((v,i) => {
                        return(<ExampleButton key={`sample-${i}`} 
                                              name={v.name}
                                              selected={sample === i}
                                              onClick={() => {
                                                  setSample(sample === i ? -1 : i);
                                                  setSequence(sample !== i ? v.sequence : "");
                                                  }}
                                              />
                                              )
                    })}
                </div>
                <a >
                    <Button  
                        onClick={() => annotate(sequence)} 
                        variant="contained">
                        {`Annotate!`}
                    </Button>
                </a>
                
            </div>
        </ThemeProvider>
    )
}

export default SequenceUpload