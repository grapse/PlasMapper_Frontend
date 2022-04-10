import * as React from "react"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { fetchFeatureTypes } from "../utils/FeatureUtils";
import '../styles/cgview.css';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import * as style from "../styles/accordion.module.css"

const strands = ["Forward", "Reverse"]

const featureData = fetchFeatureTypes();

export default function OptionAccordion(props){
    const {localData, handleFeatureUpdate, panel, handleClickOption} = props;
    const [currentName, setCurrentName] = React.useState("");
    
    /**
     * Changes the name of a feature for the plasmid
     * @param  {int} index The index of the feature to change
     * @param  {object} item The object associated with the feature 
     * @param  {str} name The new name to change
     */
    const handleClickSave = (index, item, name) => {
        if(name){
            handleFeatureUpdate(index,{name:name});
        }
      };
    
    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    /**
     * Swaps the strand of a given feature
     * @param  {int} index The index of the feature to change
     * @param  {object} item The object associated with the feature
     */
    const handleStrandSwap = (index, item) => {
        handleFeatureUpdate(index,{strand:item.strand === -1 ? 1 : -1});
    }

    return(<div class={style.accordionHolder}>
            {localData.map((v,i) => {
                return(!["ORF","Restriction Sites"].includes(v.legend) && 
                <div class={style.option} key={`accordion-panel-${i}`}>
                    <IconButton
                        onClick={() => handleFeatureUpdate(i, {visible:!v.visible})}
                        onMouseDown={handleMouseDown}
                        sx={{cursor:"pointer"}}
                        >
                        {v.visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                    </IconButton>
                    <div class={style.accordionItem}>
                        <Accordion   expanded={panel === i} 
                                onChange={() => handleClickOption(i)}
                                disableGutters 
                                TransitionProps={{ unmountOnExit: true }} 
                                >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                id="panel2bh-header"
                                sx={{width:"100%"}}
                                >
                                <Typography sx={{width:"80%"}} >{v.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails class={style.optionHolder}>
                                <TextField defaultValue={v.name} 
                                           id="standard-basic" 
                                           label="Name" 
                                           variant="standard" 
                                           size="small"
                                           sx={{width:"80%"}} 
                                           onChange={(event) => setCurrentName(event.target.value)}
                                           InputProps={{endAdornment: 
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleClickSave(i,v,currentName)}
                                                        onMouseDown={handleMouseDown}
                                                        edge="end"
                                                        >
                                                        {<SaveIcon/>}
                                                    </IconButton>
                                                </InputAdornment>,
                                            }}
                                           />
                            <FormControl fullWidth>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    size="small"
                                    labelId="category-label"
                                    id="add-category"
                                    defaultValue={v.legend}
                                    sx={{width:"80%"}} 
                                    label="Category"
                                    onChange={(e) => handleFeatureUpdate(i, {legend:e.target.value})}
                                >
                                {featureData.map((v1,i1) => {return <MenuItem key={i1} value={v1.display}>{v1.display}</MenuItem>})}
                                </Select>
                            </FormControl>
                            <div class={style.location}>
                                <TextField onChange={(e) => handleFeatureUpdate(i, {start:e.target.value})} 
                                           label="Start" 
                                           variant="standard" type="number" 
                                           defaultValue={v.start}/>
                                <TextField onChange={(e) => handleFeatureUpdate(i, {stop:e.target.value})} 
                                           label="Stop" variant="standard" 
                                           type="number" 
                                           defaultValue={v.stop}/>
                            </div>
                            <div class={style.location}>
                                <Typography>{`${v?.strand === -1 ? "Reverse" : "Forward"} Strand`}</Typography>
                                <IconButton
                                    onClick={() => handleStrandSwap(i,v)}
                                    onMouseDown={handleMouseDown}
                                    edge="end"
                                    >
                                    {<SwapHorizIcon/>}
                                </IconButton>
                            </div>
                            
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
                )                
            })}
        </div>)
}
