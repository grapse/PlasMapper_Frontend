import * as React from "react"
import * as style from "../styles/about.module.css"
import Layout from "../components/layout"
import Seo from "../components/seo"
import GlobalContext from "../context/optionContext";

function AboutPage(){
    const {theme} = React.useContext(GlobalContext);
    return(
    <Layout>
        <Seo title="Plasmapper About" />
        <div style={{...theme}} class={style.help}>
            {"eee"}
           <div style={{marginTop:"300px"}}>e</div>
        </div>
    </Layout>
    )
}

export default AboutPage
