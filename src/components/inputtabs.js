import * as React from "react"
import * as style from "../styles/inputtabs.module.css"

import GlobalContext from "../context/optionContext";

function InputTabs(props) 
  {
    const {theme} = React.useContext(GlobalContext);
    const {tabs, start} = props;
    const [tab, setTab] = React.useState(start);
    return(
            <div class={style.tabholder} style={{...theme}}>
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
    )
}

export default InputTabs