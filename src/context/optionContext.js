import React, {createContext, useState} from "react";
import writing from "../config/writing";
import colors from "../config/colors";

const GlobalContext = createContext({});

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(colors.light);
    const [language, setLanguage] = useState(writing.en);

    return(
        <GlobalContext.Provider value={{theme, setTheme, language, setLanguage}}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;
