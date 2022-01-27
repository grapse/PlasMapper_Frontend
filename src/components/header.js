import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import * as style from "./header.module.css"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const CATCHPHRASE = "Generate and annotate plasmid maps.\nAll you need is the sequence."
const NAVITEMS = [{name:"About",info:"PlasMapper is a webserver for mapping plasmids."},
                  {name:"Help",info:"Paste your sequence into the box to get a plasmid map."},
                  {name:"Source Code",info:"You can see the source code here:\nInsert Repo Here"},
                  {name:"Citation",info:"You should cite the following:\nInsert Names Here, PlasMapper 3.0"}]

function Header() 
  {
    const [open, setOpen] = React.useState(0);
    return(
  <header
    class={style.headersvg} 
  >
    <svg class={style.insertsvg} viewBox="0 0 500 200">
      <defs>
        <linearGradient id="grad1" gradientUnits="userSpaceOnUse" x1="250.022" y1="-0.724" x2="250.022" y2="257.377" gradientTransform="matrix(0.97363, -0.22813, 0.285984, 1.220547, -67.012777, 0.273607)" >
          <stop offset="0" style={{stopColor: `rgb(133, 195, 228)`}}></stop>
          <stop offset="1" style={{stopColor: `rgb(81, 73, 176)`}}></stop>
        </linearGradient>
      </defs>
      <path style={{paintOrder: `fill`, fillRule: `nonzero`, fill: `url(#grad1)`}} 
                  d="M 0 0 L 500 0 L 500 110 C 500,110 367,60 172,147 S 0,165 0,200 L 0 0 Z">

                  </path>
    </svg>
    <div></div>
    <div class={style.logodiv}>
      <div class={style.navbar}>
        {NAVITEMS.map((v,i) => {
          return(
          <div id={i+"nav"} class={open === i + 1 ? style.navselected : style.navbaritem} onClick={() => setOpen(i+1)}>
            {v.name}
          </div>)
        })}
      </div>
      <p class={style.logotitle}>PlasMapper <span class={style.logosmall}>3.0</span></p>
      <p class={style.catchphrase}>{CATCHPHRASE}</p>
    </div>
    <div style={{position:`relative`}}>
      <Modal
        open={open}
        onClose={() => setOpen(0)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box class={style.modal}>
          <i onClick={() => setOpen(0)} class={"bi bi-x-lg "+style.closebutton}></i>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {open === 0 ? null : NAVITEMS[open - 1].name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {open === 0 ? null : NAVITEMS[open - 1].info}
          </Typography>
        </Box>
      </Modal>
    </div>
  </header>
)}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
