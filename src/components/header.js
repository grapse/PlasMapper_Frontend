import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import * as style from "./header.module.css"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const CATCHPHRASE = "Generate and annotate plasmid maps.\nAll you need is the sequence."
const NAVITEMS = [
                  {name:"Home",info:<Link to="/">Home</Link>},
                  {name:"Search",info:<Link to="/search">Search</Link>},
                  {name:"About",info:"PlasMapper is a webserver for mapping plasmids."},
                  {name:"Help",info:"Paste your sequence into the box to get a plasmid map."},
                  {name:"Source Code",info:"You can see the source code here:\nInsert Repo Here"},
                  {name:"Citation",info:"You should cite the following:\nInsert Names Here, PlasMapper 3.0"}]

function Header(props) 
  {
    const {isIndex} = props
    const [open, setOpen] = React.useState(0);
    return(
  <header
    class={style.headersvg} 
  >

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
      {<><p class={style.logotitle}>PlasMapper <span class={style.logosmall}>3.0</span></p>
      <p class={style.catchphrase}>{CATCHPHRASE}</p></>}
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
