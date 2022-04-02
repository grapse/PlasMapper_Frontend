import * as React from "react"
import * as style from "../styles/about.module.css"
import Layout from "../components/layout"
import Seo from "../components/seo"
import GlobalContext from "../context/optionContext";
import LinkIcon from '@mui/icons-material/Link';

function AboutPage(){
    return(
    <Layout>
        <Seo title="Plasmapper About" />
        <PageContent/>
    </Layout>
    )
}

function CustomLinkIcon(){
    return(<LinkIcon sx={{transform:"rotate(-30deg)", "vertical-align": "middle", "margin-left": "5px"}}/>)
  }

function PageContent(props){
    const {theme, language} = React.useContext(GlobalContext);
    return(
        <>
            <div style={{height:"60px"}}></div>
            <div style={{...theme}}>
                <div className={style.titleText}>{language.ABOUT.title}</div>
                <div className={style.headerText}>History</div>
                <div className={style.bodyText}>{language.ABOUT.history}</div>
                <a className={style.linkText} href={language.ABOUT.history_link}>PlasMapper 2.0 Publication<CustomLinkIcon/></a>
                <div className={style.headerText}>Architecture</div>
                <div className={style.bodyText}>{language.ABOUT.architecture}</div>
            </div>
        </>
    );
}

export default AboutPage
