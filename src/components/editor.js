import * as React from "react"
import * as style from "./editor.module.css"
import { SwatchColorPicker } from '@fluentui/react/lib/SwatchColorPicker';

const colorCells = [
    { id: 'a', label: 'red', color: '#ff0000' },
    { id: 'b', label: 'orange', color: '#00ff00' },
    { id: 'c', label: 'orangeYellow', color: '#00ffff' },
    { id: 'd', label: 'yellowGreen', color: '#ff00ff' },
    { id: 'e', label: 'green', color: '#ffff00' },
    { id: 'f', label: 'cyan', color: '#038387' },
    { id: 'g', label: 'cyanBlue', color: '#004e8c' },
    { id: 'h', label: 'magenta', color: '#881798' },
    { id: 'i', label: 'magentaPink', color: '#ec8633' },
    { id: 'j', label: 'black', color: '#cceebb' },
    { id: 'k', label: 'gray', color: '#ccddee' },
    { id: 'l', label: 'gray20', color: '#e6b1b6' },
  ];

function Editor(props)  
  {
    const [color, setColor] = React.useState("#ff0000");
    const [color2, setColor2] = React.useState("#00ff00");
    const [color3, setColor3] = React.useState("#00ffff");
    const {sequence} = props;
    return(
        <>  
            <h1 class={style.heading}>Editor</h1>
            <div class={style.editor}>
                <div class={style.options}>
                <div>Choose the colours:</div>
                <SwatchColorPicker
                    defaultSelectedId="a"
                    columnCount={4}
                    cellShape={'circle'}
                    colorCells={colorCells}
                    onChange={(id, label, color) => setColor(color)}
                />
                <br/>
                <SwatchColorPicker
                    defaultSelectedId="b"
                    columnCount={4}
                    cellShape={'circle'}
                    colorCells={colorCells}
                    onChange={(id, label, color) => setColor2(color)}
                />
                <br/>
                <SwatchColorPicker
                    defaultSelectedId="c"
                    columnCount={4}
                    cellShape={'circle'}
                    colorCells={colorCells}
                    onChange={(id, label, color) => setColor3(color)}
                />
                </div>
                <div class={style.drawing}>
                    <div class={style.svgwrap}>
                        <svg class={style.insertsvg} viewBox="0 0 100 100">
                            <defs>
                                <filter id="shadow">
                                <feDropShadow dx="0" dy="0" stdDeviation="0"
                                    flood-color="black"/>
                                </filter>
                            </defs>
                            <circle cx="50" cy="50" r="35" stroke={"#000"} stroke-width="0.5" fill={"#fff"} />

                            <circle r="35" fill="transparent"
                                stroke={color}
                                stroke-width="10"
                                stroke-dasharray="18.9 202"
                                transform="translate(50,50) rotate(90.7)" />
                            <circle r="35" fill="transparent"
                                stroke={color2}
                                stroke-width="10"
                                stroke-dasharray="50 169.9"
                                transform="translate(50,50) rotate(190.7)" />
                            <circle r="35" fill="transparent"
                                stroke={color3}
                                stroke-width="10"
                                stroke-dasharray="30 189.9"
                                transform="translate(50,50) rotate(10.7)" />
                            <text x="37" y="50" style={{fontSize:`7px`}}>Plasmid</text>
                        </svg>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default Editor