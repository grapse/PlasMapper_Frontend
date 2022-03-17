import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import * as style from "./header.module.css"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GlobalContext from "../context/optionContext";
import colors from "../config/colors";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const MaterialUISwitch = styled(Switch)(({ theme, palette }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#000',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: "#888",
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: "var(--bg3)",
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: "#888",
    borderRadius: 20 / 2,
  },
}));

const CIRCUMFERENCE = 219.91;



function Header(props) 
  {
    const {theme, setTheme, language, setLanguage} = React.useContext(GlobalContext);

    const NAVITEMS = [
      {name:"Help",info:language.HELP},
      {name: "About",info:language.ABOUT},
      {name:"Source Code",info:language.SOURCE_CODE},
      {name:"Citation",info:language.CITATION}]

    const [open, setOpen] = React.useState(0);
    const [pageProgress, setPageProgress] = React.useState(0);
    const [darkMode, setDarkMode] = React.useState(false);

    React.useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
          // On unmount
          window.removeEventListener('scroll', handleScroll);
      }
    }, [])

    const handleScroll = (event) => {
      // Calculates the progress to be used in the progress plasmid
      let scrollTop = window.scrollY;
      let docHeight = document.body.offsetHeight;
      let winHeight = window.innerHeight;
      let scrollPercent = scrollTop / (docHeight - winHeight);
      setPageProgress(CIRCUMFERENCE * scrollPercent);
    }

    const handleChange = (event) => {
      setTheme(darkMode ? colors.light : colors.dark);
      setDarkMode(!darkMode);
    }

    return(
  <header
    class={style.header} style={{"--bg": theme.background}}
  >
    <div class={style.svgholder}>
    <svg class={style.insertsvg} height="100%" viewBox="0 0 100 100">
                            <defs>
                                <filter id="shadow">
                                <feDropShadow dx="0" dy="0" stdDeviation="0"
                                    flood-color="black"/>
                                </filter>
                            </defs>
                            <circle r="22" fill="transparent"
                                stroke={theme.plasmid1}
                                stroke-width="9"
                                stroke-dasharray={`35 ${CIRCUMFERENCE}`}
                                transform={`translate(50,50) rotate(${pageProgress*2})`} />
                            <circle r="9" fill="transparent"
                                stroke={theme.plasmid2}
                                stroke-width="9"
                                stroke-dasharray={`44 ${CIRCUMFERENCE}`}
                                transform={`translate(50,50) rotate(${10+pageProgress/2})`} />
                            
                            <circle r="35" fill="transparent"
                                stroke={theme.plasmid3}
                                stroke-width="9"
                                stroke-dasharray={`${20+pageProgress} ${CIRCUMFERENCE}`}
                                transform="translate(50,50) rotate(-90)" />
                            
                        </svg>
    </div>
      
    <div class={style.navbar} style={{"--font-color": theme.text}}>
    <div class={style.navbaritem} key={"search-link"}><Link to="/search">Search</Link></div>
      {NAVITEMS.map((v,i) => {
        return(
        <div id={i+"nav"} class={open === i + 1 ? style.navselected : style.navbaritem} onClick={() => setOpen(i+1)}>
          {v.name}
        </div>)
      })}
      <div><MaterialUISwitch 
            checked={darkMode}
            onChange={handleChange}
            style={{"--bg1": theme.text, "--bg3": theme.text, "--bg2": theme.mid}}></MaterialUISwitch></div>
    </div>
    <div style={{position:`relative`}}>
      <Modal
        open={open}
        onClose={() => setOpen(0)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{"--bg": theme.background, "--text": theme.text}}
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
