import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from "react"
import * as style from "./inputtabs.module.css"


function InputTabs(props) 
  {
    const {tabs} = props;
    const [tab, setTab] = React.useState(0);
    return(
        <>
            <div class={style.tabholder}>
                <div class={style.tabs}>
                    {tabs.map((v,i) => {
                        return(
                            <div onClick={() => setTab(i)} id={i+"input"} class={tab === i ? style.tabopen : style.tab}>
                                {v.name}
                            </div>
                        )
                    })}
                    <div id="slider" className={style.navBefore} style={{inset:`0rem ${8*tab}rem`}}></div>
                </div>
                
                <div class={style.tabcontent}>
                    {tabs[tab].content}
                </div>
            </div>
        </>
    )
}

export default InputTabs