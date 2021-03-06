import * as React from "react"

import * as style from '../styles/index.module.css'

import GlobalContext from "../context/optionContext";

export default function BackgroundDrawing(props){
  return(
    <PageContent {...props}/>
  )
}

function PageContent(props){
    /**
     * Draws the plasmids used in the background
     */
    const {theme, setTheme, language, setLanguage} = React.useContext(GlobalContext);
  
     return(
    <div class={style.test}>
        <div class={style.circle1}>
            <div class={style.circleinner}>
                <svg class={style.insertsvg} height="100%" viewBox="0 0 100 100">
                    <circle r="22" fill="transparent"
                        class={style.circleI1}
                        stroke={theme['--plasmid1']}
                        transform={`translate(50,50) rotate(90)`} />
                    <circle r="26" fill="transparent"
                        class={style.circleI2}
                        stroke={theme['--plasmid2']}
                        transform={`translate(50,50) rotate(60)`} />
                    <circle r="30" fill="transparent"
                        class={style.circleI2}
                        stroke={theme['--plasmid3']}
                        transform={`translate(50,50) rotate(130)`} />
                    <circle r="18" fill="transparent"
                        class={style.circleI3}
                        stroke={theme['--plasmid4']}
                        transform={`translate(50,50) rotate(10)`} />
                    <polyline points="72,50 80,55 250,55"
                        class={style.label}
                        fill="transparent"
                        stroke={theme['--plasmid1']}
                        stroke-width={1} />
                    <polyline points="50,76 45,81 32,81"
                        class={style.label}
                        fill="transparent"
                        stroke={theme['--plasmid2']}
                        stroke-width={1} />
                </svg>
            </div>
    </div>
        <div class={style.circle2}>
            <div class={style.circleinner}>
                <svg class={style.insertsvg} height="100%" viewBox="0 0 100 100">
                    <circle r="22" fill="transparent"
                        class={style.circleI2}
                        stroke={theme['--plasmid1']}
                        transform={`translate(50,50) rotate(190)`} />
                    <circle r="26" fill="transparent"
                        class={style.circleI1}
                        stroke={theme['--plasmid2']}
                        transform={`translate(50,50) rotate(160)`} />
                    <circle r="30" fill="transparent"
                        class={style.circleI2}
                        stroke={theme['--plasmid3']}
                        transform={`translate(50,50) rotate(-130)`} />
                    <circle r="18" fill="transparent"
                        class={style.circleI3}
                        stroke={theme['--plasmid4']}
                        transform={`translate(50,50) rotate(110)`} />
                    <circle r="14" fill="transparent"
                        class={style.circleI3}
                        stroke={theme['--plasmid5']}
                        transform={`translate(50,50) rotate(100)`} />
                    <polyline points="50,20 40,10 10,10"
                        class={style.label}
                        fill="transparent"
                        stroke={theme['--plasmid3']}
                        stroke-width={0.5} />
                </svg>
            </div>
        </div>
    </div>
      
)}

