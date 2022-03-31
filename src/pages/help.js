import * as React from "react"
import * as style from "../styles/help.module.css"
import Layout from "../components/layout"
import Seo from "../components/seo"
import GlobalContext from "../context/optionContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const images = [
    'https://i.imgur.com/P4XguNh.png',
    'https://i.imgur.com/IGz3tWY.png',
    'https://i.imgur.com/ecqq4QY.png'
]

function HelpPage(){
    return(
    <Layout>
        <Seo title="Plasmapper Help" />
        <PageContent/>
    </Layout>
    )
}

function CustomArrowIcon(){
    return(<ArrowForwardIcon sx={{"vertical-align": "middle", "margin": "0 5px"}}/>)
}

function TitleText(props){
    const {text} = props;
    return(
        <div class={style.title}>{text}</div>)
}

function TutorialItem(props){
    const {title, text, image} = props;
    return(
        <div class={style.tutorialholder} {...props}>
            <TitleText text={title} />
            <div class={style.sideholder}>
                <img
                    src={image}
                    height={500}
                ></img>
                {text} 
            </div>
        </div>
    )
}

function PageContent(props){
    const {theme, language} = React.useContext(GlobalContext);
    return(
        <div style={{...theme}} class={style.help}>
                <div class={style.filterBar}>
                    {`Help Navigation`}
                    {language.HELP.map((v,i) => {
                        return(
                            <a href={`#tutorial-${i}`} class={style.helplink}>
                                <CustomArrowIcon/>
                                {v.title}
                            </a>
                        )
                    })}
                </div>
                <div class={style.holder}>
                    {language.HELP.map((v,i) => {
                        return(
                            <>
                            <div id={`tutorial-${i}`} class={style.spacer}></div>
                            <TutorialItem
                                title={v.title}
                                text={v.content}
                                image={images[i]}
                            />
                            </>
                        )
                    })}
                    
                </div>
        </div>
    )

}

export default HelpPage
