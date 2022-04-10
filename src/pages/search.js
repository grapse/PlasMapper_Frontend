import * as React from "react"
import {Skeleton, Autocomplete, TextField,  Modal, } from '@mui/material';
import Layout from "../components/layout"
import Seo from "../components/seo"
import Drawer from '@mui/material/Drawer';
import * as style from '../styles/search.module.css'
import MiniEditor from '../components/minieditor'
import { DataGrid } from '@mui/x-data-grid';
import GlobalContext from "../context/optionContext";
import { fetchSearchData, fetchSequence, incrementPopularity } from "../utils/FetchUtils";
import { getFeatureNames, getCommonEnzymes, getExpressionTypes } from "../utils/FeatureUtils";
import { TableColumns } from "../utils/SearchUtils";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

/**
 * Makes the rows to display the preview table.
 * Definition of the rows are in SearchUtils
 */

 const formRows = ((data) => {
    return data.map((v, i) => {return({id:i, ...v})});
})

const featureNames = getFeatureNames();
const commonEnzymes = getCommonEnzymes();
const expressionTypes = getExpressionTypes();

function SearchPage(){
    const {theme} = React.useContext(GlobalContext);

    const [firstLoad, setFirstLoad] = React.useState(true);
    const [plasmids, setPlasmids] = React.useState([]);
    const [filteredPlasmids, setFilteredPlasmids] = React.useState([]);
    const [currentPlasmid, setCurrentPlasmid] = React.useState("");
    const [modalState, setModalState] = React.useState(-1);
    const [sequence, setSequence] = React.useState("");
    const [restrictionSearch, setRestrictionSearch] = React.useState([]);
    const [nameSearch, setNameSearch] = React.useState("");
    const [expressionSearch, setExpressionSearch] = React.useState([]);
    const [featureSearch, setFeatureSearch] = React.useState([]);
    const [lengthMin, setLengthMin] = React.useState(0);
    const [lengthMax, setLengthMax] = React.useState(20000);
    const [detailDrawer, setDetailDrawer] = React.useState(false);
    const [filterDrawer, setFilterDrawer] = React.useState(false);
    const [filterAnd, setFilterAnd] = React.useState(false);

    React.useEffect(() => {
        if(firstLoad){
            // Upon loading in, fetch the plasmid metadata database from backend
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

        

        // Filter the data based on user-selected filters
        if(filterAnd){
            // AND search
            setFilteredPlasmids(
                plasmids.filter(plasmid =>
                        `${plasmid.name}`.toLowerCase().indexOf(nameSearch.toLowerCase()) >= 0 
                        &&
                        (expressionSearch.length > 0 ? 
                            expressionSearch.every( r => plasmid.expression.split(',').includes(r)) 
                        : true)
                        &&
                        (featureSearch.length > 0 ? 
                            featureSearch.every( r => plasmid.features.split(',').includes(r)) 
                        : true)
                        &&
                        (restrictionSearch.length > 0 ? 
                            restrictionSearch.every( r => plasmid.features.split(',').includes(r)) 
                        : true)
                        &&
                        (plasmid.sequenceLength > lengthMin)
                        &&
                        (plasmid.sequenceLength < lengthMax)
                    )
            )
            
        }
        else{
            // OR search
            setFilteredPlasmids(
                plasmids.filter(plasmid =>
                        `${plasmid.name}`.toLowerCase().indexOf(nameSearch.toLowerCase()) >= 0 
                        &&
                        (expressionSearch.length > 0 ? 
                            plasmid.expression.split(',').some(r => expressionSearch.includes(r)) 
                        : true)
                        &&
                        (featureSearch.length > 0 ? 
                            plasmid.features.split(',').some(r => featureSearch.includes(r)) 
                        : true)
                        &&
                        (restrictionSearch.length > 0 ? 
                            plasmid.features.split(',').some(r => restrictionSearch.includes(r)) 
                        : true)
                        &&
                        (plasmid.sequenceLength > lengthMin)
                        &&
                        (plasmid.sequenceLength < lengthMax)
                    )
            )
        }
    },
    [firstLoad, nameSearch, featureSearch, lengthMax, lengthMin, expressionSearch, restrictionSearch, filterAnd]
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
                    setDetailDrawer(true)
                }
            )
            .catch(err =>{
                    console.log(err);
                }
            );
        incrementPopularity(name);
    }

    return(
    <Layout>
        <Seo title="Browse Plasmids" />
        <div class={style.searchHolder} style={{...theme}}>
            <div class={style.filterBar}>
                <div style={{fontSize:"1.5em", marginTop:"20px"}}>Filter By:</div>
                <div
                            class={style.searchBar}
                >
                    <TextField  
                            onChange={(e) => setNameSearch(e.target.value)} 
                            value={nameSearch} id="input-name" 
                            label="Plasmid Name" 
                            helperText="Ex: pCRCT"
                            size="small"
                            variant="standard" />
                </div>
                <FormControlLabel 
                    control={<Switch
                                checked={filterAnd}
                                onChange={() => setFilterAnd(!filterAnd)}
                                
                                />} 
                    label={`${filterAnd ? "AND" : "OR"} search`} />
                
                <div
                            class={style.searchBar}
                >
                    <Autocomplete 
                            multiple
                            disablePortal
                            size="small"
                            freeSolo
                            onChange={(e, newVal) => setFeatureSearch(newVal)} 
                            value={featureSearch} 
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
                            disablePortal
                            size="small"
                            freeSolo
                            onChange={(e, newVal) => setRestrictionSearch(newVal)} 
                            value={restrictionSearch}
                            id="input-feature" 
                            options={commonEnzymes.map(v => v.name)}
                            renderInput={(params) => 
                                <TextField {...params} variant="standard" label="Restriction Sites" 
                                />} 
                            />
                </div>
                <div
                            class={style.searchBar}
                >
                    <Autocomplete 
                            multiple
                            disablePortal
                            size="small"
                            freeSolo
                            onChange={(e, newVal) => setExpressionSearch(newVal)} 
                            value={expressionSearch}
                            id="input-feature" 
                            options={expressionTypes}
                            renderInput={(params) => 
                                <TextField {...params} variant="standard" label="Expression Type" 
                                />} 
                            />
                </div>
                <div class={style.numberSearchBar}>
                    <TextField
                        id="outlined-number"
                        value={lengthMin}
                        onChange={(e) => setLengthMin(e.target.value)} 
                        label="Minimum Sequence Length"
                        size="small"
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
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        />
                </div>
                    
                </div>
               
            <div class={style.searchbody}>
                <div style={{height:"12px"}}></div>
                <div style={{padding:"20px", marginTop:"40px", background:"linear-gradient(#e3dff2, #f1f1f1)"}}>
                <div style={{fontWeight:"400px", fontSize:"2.5em", textAlign:"left", marginTop:"30px", marginLeft:"30px"}}>Browse Plasmids</div>
                <p style={{fontSize:"1.2em", margin:"35px", textAlign:"left"}}>Quickly find the plasmid you are looking for in our database by filtering for various fields.<br></br>Click on a column header to view more options for that column, including sorting.</p>
                
                </div>
                
                <div style={{margin:"25px", marginTop:"40px", fontSize:"1.5em"}}>Results:</div>
                <div class={style.plasmidHolder}
                    
                >
                    {firstLoad ? 
                        [...Array(20)].map((v,i) => {
                            return(<Skeleton variant="rectangular" key={`skeleton-${i}`} width={200} height={100} />)
                        })
                    : 
                    <DataGrid
                            sx={{height:52*100+200,backgroundColor:"white",margin:"0 90px"}}
                            rows={formRows(filteredPlasmids)}
                            columns={TableColumns}
                            pageSize={100}
                            onRowClick={(rowData) => openModal(rowData.row.name, rowData.row.id)}
                            rowsPerPageOptions={[100]}
                            initialState={{
                                sorting: {
                                  sortModel: [{ field: 'popularity', sort: 'desc' }],
                                },
                              }}
                        />
                    }
                </div>
                <Drawer
                    anchor={"right"}
                    open={detailDrawer}
                    onClose={() => setDetailDrawer(false)}
                >
                    <div >
                        <MiniEditor isEdit={false} 
                                    sequence={sequence} 
                                    nameSearch={currentPlasmid}>
                                    </MiniEditor>
                    </div>
                </Drawer>
               
            </div>
        </div>
    </Layout>
    )
}

export default SearchPage
