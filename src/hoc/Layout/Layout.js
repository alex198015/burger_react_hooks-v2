import React, { useState } from "react"
import Auxilliary from '../Auxilliary/Auxilliary'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import {connect} from 'react-redux'

const Layout = props => {

    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false)

    const sideDrawerCloseHandler = () => {
        setSideDrawerIsVisible(false)
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible)
      
    }

    
        return (
            <Auxilliary>
                <Toolbar 
                    isAuth={props.isAuthenticated}
                    drawerToggleClicked={sideDrawerToggleHandler}/>
                <SideDrawer 
                    isAuth={props.isAuthenticated}
                    closed={sideDrawerCloseHandler}
                    open={sideDrawerIsVisible}/>
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Auxilliary>
        )
}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.token
    }
}

export default connect(mapStateToProps)(Layout);