import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
 
import "./layout.css"

 
import GlobalContext from "../context/optionContext"
 
 
 function LayoutContent({children}){
   const {theme, setTheme, language, setLanguage} = React.useContext(GlobalContext);
 
   return(
     <div
         style={{background: theme.tint}}
         >
           <main>{children}</main>
           <footer
             style={{
               textAlign:'center',
               marginTop: `400px`,fontSize:`0.7em`
             }}
           >
             © {new Date().getFullYear()}, University of Alberta
           </footer>
     </div>
   )
 }
 

 
 export default LayoutContent
 