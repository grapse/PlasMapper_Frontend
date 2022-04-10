import * as React from "react"
 
import "../styles/layout.css"
import * as style from "../styles/footer.module.css"
 
import GlobalContext from "../context/optionContext"
 
function LayoutContent({children}){
  const {theme, language} = React.useContext(GlobalContext);

  return(
    <div
        style={{...theme, backgroundColor: theme['--tint']}}
        >
          <main>{children}</main>
          <footer
            class={style.footer}
          >
            {language.FOOTER}<a class={style.link} target="_blank" rel="noopener noreferrer" href={"http://feedback.wishartlab.com/?site=plasmapper"}>here</a>
            <div>{language.FOOTER_CREDIT}</div>
          </footer>
    </div>
  )
}
 

 
export default LayoutContent
 