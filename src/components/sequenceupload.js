import * as React from "react"
import * as style from "../styles/sequenceupload.module.css"

import GlobalContext from "../context/optionContext";

function SequenceUpload(props) 
  {
    const {theme} = React.useContext(GlobalContext);
    const [file, setFile] = React.useState(start);
    return(
        <>
            <div class={style.box} style={{...theme}}>
                Test
            </div>
        </>
    )
}

export default SequenceUpload