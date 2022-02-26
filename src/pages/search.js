import * as React from "react"
import { Link } from "gatsby"

import axios from 'axios'
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as style from '../components/search.module.css'

function SearchPage(){
    const [firstLoad, setFirstLoad] = React.useState(true);
    const [plasmids, setPlasmids] = React.useState([]);

    React.useEffect(() => {
        if(firstLoad){
            // TODO: Change to local file
            axios.get("http://localhost:3000/plasmids/meta", {timeout: 1000})
                .then(data => {
                        //console.log(data.data.plasmids);
                        setPlasmids(data.data.plasmids);
                        setFirstLoad(false);
                    }
                )
                .catch(err =>{
                        console.log(err);
                        setFirstLoad(false);
                    }
                );
        }
    },
    [firstLoad]
    )

    return(
    <Layout>
        <Seo title="Plasmid Searcher" />
        
        <div class={style.searchbody}>
            {"Plasmid Searcher"}
            <div class={style.plasmidHolder}>
                {plasmids.map((plasmid, idx) => {
                    return(
                        <div class={style.plasmidCard} key={`${idx}-plasmid`}>
                            <div class={style.plasmidTitle}>{plasmid?.name || `Plasmid ${idx}`}</div>
                            <div class={style.plasmidTitle}>{plasmid?.description || "No description"}</div>
                            <div class={style.plasmidTitle}>{`Length: ${plasmid?.sequenceLength || "-"} bp`}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    </Layout>
    )
}

export default SearchPage
