import * as React from "react"
import { Link } from "gatsby"
import {Autocomplete, OutlinedInput, InputLabel, Select, MenuItem, TextField, Box, Checkbox, FormControlLabel, FormControl, Modal, Typography, Chip, Radio, RadioGroup, Button } from '@mui/material';
import axios from 'axios'
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as style from '../components/search.module.css'
import MiniEditor from '../components/minieditor'
import { fetchSearchData } from "../utils/FetchUtils";
import { getFeatureNames, getCommonEnzymes } from "../utils/FeatureUtils";

const featureNames = getFeatureNames();
const commonEnzymes = getCommonEnzymes();

function SearchPage(){
    const [firstLoad, setFirstLoad] = React.useState(true);
    const [plasmids, setPlasmids] = React.useState([]);
    const [filteredPlasmids, setFilteredPlasmids] = React.useState([]);
    const [currentPlasmid, setCurrentPlasmid] = React.useState("");
    const [modalState, setModalState] = React.useState(-1);
    const [sequence, setSequence] = React.useState("");
    const [restrictionSearch, setRestrictionSearch] = React.useState([]);
    const [nameSearch, setNameSearch] = React.useState("");
    const [featureSearch, setFeatureSearch] = React.useState([]);
    const [lengthMin, setLengthMin] = React.useState(0);
    const [lengthMax, setLengthMax] = React.useState(20000);

    React.useEffect(() => {
        if(firstLoad){
            // TODO: Change to local file
            fetchSearchData()
                .then(data => {
                        setPlasmids(data);
                        setFilteredPlasmids(data);
                        setFirstLoad(false);
                    }
                )
                .catch(err =>{
                        console.log(err);
                        setFirstLoad(false);
                    }
                );
        }
        console.log(commonEnzymes)
        setFilteredPlasmids(
            plasmids.filter(plasmid =>
                    `${plasmid.name}`.toLowerCase().indexOf(nameSearch.toLowerCase()) >= 0 
                    &&
                    (featureSearch.length > 0 ? 
                        plasmid.features.split(',').some(r => featureSearch.includes(r)) 
                    : true)
                    &&
                    (restrictionSearch.length > 0 ? 
                        plasmid.restriction.split(',').some(r => restrictionSearch.includes(r)) 
                    : true)
                    &&
                    (plasmid.sequenceLength > lengthMin)
                    &&
                    (plasmid.sequenceLength < lengthMax)
                )
        )
    },
    [firstLoad, nameSearch, featureSearch, lengthMax, lengthMin]
    )

    function openModal(name, idx){
        axios.get("http://localhost:3000/plasmids", {params: {name:name}}, {timeout: 1000})
        .then(data => {
                //console.log(data.data.plasmids);
                
                setSequence(data.data.sequence)
                setCurrentPlasmid(name)
                setModalState(idx)
            }
        )
        .catch(err =>{
                console.log(err);
                setModalState(idx)
            }
        );
    }

    return(
    <Layout>
        <Seo title="Plasmid Searcher" />
        
        <div class={style.searchbody}>
            <div style={{fontWeight:"400",fontSize:"3em", marginBottom:"100px"}}>{"Plasmid Searcher"}</div>
            <div style={{display:"flex", margin:"50px",flexWrap:"wrap"}}>
            <div
                        class={style.searchBar}
            >
                <TextField inputProps={{ "data-testid": "search-name" }} 
                        onChange={(e) => setNameSearch(e.target.value)} 
                        value={nameSearch} id="input-name" 
                        label="Search Name" 
                        variant="standard" />
            </div>
            <div
                        class={style.searchBar}
            >
                <Autocomplete 
                        multiple
                        inputProps={{ "data-testid": "search-feature" }} 
                        disablePortal
                        freeSolo
                        onChange={(e, newVal) => setFeatureSearch(newVal)} 
                        value={featureSearch} 
                        sx={{ width: 300 }}
                        id="input-feature" 
                        options={featureNames}
                        renderInput={(params) => 
                            <TextField {...params} variant="standard" label="Features" 
                            />} 
                        />
            </div>
            <div
                        class={style.searchBar}
            >
                <Autocomplete 
                        multiple
                        inputProps={{ "data-testid": "search-restriction" }} 
                        disablePortal
                        freeSolo
                        sx={{ width: 300 }}
                        id="input-feature" 
                        options={commonEnzymes.map(v => v.name)}
                        renderInput={(params) => 
                            <TextField {...params} variant="standard" label="Restriction Sites" 
                            />} 
                        />
            </div>
                <TextField
                    id="outlined-number"
                    value={lengthMin}
                    onChange={(e) => setLengthMin(e.target.value)} 
                    label="Min"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    />
                <TextField
                    id="outlined-number"
                    value={lengthMax}
                    onChange={(e) => setLengthMax(e.target.value)} 
                    label="Max"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    />
            </div>
            
            <div
                        class={style.searchBar}
            >
            </div>
            <div class={style.plasmidHolder}
                 
            >
                {filteredPlasmids.map((plasmid, idx) => {
                    return(
                        <div onClick={() => openModal(plasmid?.name, idx)} class={style.plasmidCard} key={`${idx}-plasmid`}>
                            <div class={style.plasmidTitle}>{plasmid?.name || `Plasmid ${idx}`}</div>
                            {/* <div class={style.plasmidTitle}>{plasmid?.description || "No description"}</div> */}
                            <div class={style.plasmidTitle}>{`Length: ${plasmid?.sequenceLength || "-"} bp`}</div>
                        </div>
                    )
                })}
            </div>
            <Modal
                    open={modalState > -1}
                    onClose={() => setModalState(-1)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div style={{width:"100%",height:"500px"}}>
                        <MiniEditor isEdit={false} data={[]} sequence={sequence} nameSearch={currentPlasmid}></MiniEditor>
                        
                    </div>
            </Modal>
        </div>
    </Layout>
    )
}

export default SearchPage
