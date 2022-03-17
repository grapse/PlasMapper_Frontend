/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

import writing from "../config/writing"
import colors from "../config/colors"

import {ThemeProvider, GlobalContext} from "../context/optionContext"
import LayoutContent from "./layoutContent"

const Layout = ({ children }) => {  
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <ThemeProvider>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&family=Roboto&display=swap" rel="stylesheet"/>
      </head>
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <LayoutContent>{children}</LayoutContent>
      </ThemeProvider>
  )
}


Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
