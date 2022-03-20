import * as React from "react"
import {Skeleton, Autocomplete, TextField,  Modal, } from '@mui/material';
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as style from '../styles/search.module.css'
import MiniEditor from '../components/minieditor'
import GlobalContext from "../context/optionContext";
import { fetchSearchData, fetchSequence } from "../utils/FetchUtils";
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
            // Upon loading in, fetch the plasmid metadata database from backend
            fetchSearchData()
                .then(data => {
                        setPlasmids(data);
                        setFilteredPlasmids(data);
                        console.log(data);
                        setFirstLoad(false);
                    }
                )
                .catch(err =>{
                        console.log(err);
                        setFirstLoad(false);
                    }
                );
        }
        // Filter the data based on user-selected filters
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

    /**
     * Opens the modal
     * @param  {str} name Name of plasmid to query backend with
     * @param  {int} idx Index of the plasmid to open modal with
     */
    function openModal(name, idx){
        fetchSequence(name)
            .then(data => {
                    setSequence(data)
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
        <Seo title="Browse Plasmids" />
        <div class={style.searchbody}>
            <div style={{height:"12px"}}></div>
            <div style={{padding:"20px", marginTop:"40px", background:"linear-gradient(#e3dff2, #f1f1f1)"}}>
            <div style={{fontWeight:"400px", fontSize:"2.5em", textAlign:"left", marginTop:"30px", marginLeft:"30px"}}>Browse Plasmids</div>
            <p style={{fontSize:"1.2em", margin:"35px", textAlign:"left"}}>Quickly find the plasmid you are looking for in our database by filtering for various fields.</p>
            <div style={{fontSize:"1.5em", marginTop:"20px"}}>Filter By:</div>
            <div style={{display:"flex", margin:"10px", flexWrap:"wrap", justifyContent:"center"}}>
            <div
                        class={style.searchBar}
            >
                <TextField inputProps={{ "data-testid": "search-name" }} 
                        onChange={(e) => setNameSearch(e.target.value)} 
                        value={nameSearch} id="input-name" 
                        label="Plasmid Name" 
                        size="small"
                        variant="standard" />
            </div>
            <div
                        class={style.searchBar}
            >
                <Autocomplete 
                        multiple
                        inputProps={{ "data-testid": "search-feature" }} 
                        disablePortal
                        size="small"
                        freeSolo
                        onChange={(e, newVal) => setFeatureSearch(newVal)} 
                        value={featureSearch} 
                        sx={{ width: 300 }}
                        id="input-feature" 
                        options={featureNames}
                        renderInput={(params) => 
                            <TextField {...params} variant="standard" label="Sequence Features" 
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
                        size="small"
                        freeSolo
                        sx={{ width: 300 }}
                        id="input-feature" 
                        options={commonEnzymes.map(v => v.name)}
                        renderInput={(params) => 
                            <TextField {...params} variant="standard" label="Restriction Sites" 
                            />} 
                        />
            </div>
                
            </div>
            <div style={{display:"flex", margin:"10px", flexWrap:"wrap", justifyContent:"center"}}>
            <div class={style.numberSearchBar}>
                <TextField
                    id="outlined-number"
                    value={lengthMin}
                    onChange={(e) => setLengthMin(e.target.value)} 
                    label="Minimum Sequence Length"
                    size="small"
                    sx={{ width: 300 }}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    />
            </div>
            <div class={style.numberSearchBar}>
                <TextField
                    id="outlined-number"
                    value={lengthMax}
                    onChange={(e) => setLengthMax(e.target.value)} 
                    label="Maximum Sequence Length"
                    size="small"
                    sx={{ width: 300 }}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    />
            </div>
            </div>
            </div>
            
            <div style={{margin:"25px", marginTop:"40px", fontSize:"1.5em"}}>Results:</div>
            <div class={style.plasmidHolder}
                 
            >
                {firstLoad ? 
                    <Skeleton variant="rectangular" width={210} height={118} />
                 : filteredPlasmids.map((plasmid, idx) => {
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
                    sx={{overflow:"auto"}}
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
