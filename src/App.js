import React, { useEffect, Suspense} from 'react'
import { Route, Switch , withRouter, Redirect} from "react-router-dom"
import {connect} from 'react-redux'
// import {withSuspense} from './hoc/withSuspense/withSuspense'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
// import Checkout from './containers/Checkout/Checkout'
// import Orders from './containers/Orders/Orders'
// import Auth from './containers/Auth/Auth'
import Layout from './hoc/Layout/Layout'
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'



const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'))
const Orders = React.lazy(() => import('./containers/Orders/Orders'))
const Auth = React.lazy(() => import('./containers/Auth/Auth'))

const App = props =>  {

  const {onTryAutoSignUp} = props

  useEffect(() => {

      onTryAutoSignUp()
  }, [onTryAutoSignUp])




    let routes = (
      <Switch>
          <Route path="/auth" render={(props) => <Auth {...props}/>}/>
          <Route path="/" exact component={BurgerBuilder}/>
          <Redirect to="/"/>
      </Switch>
    
    )

    if(props.isAuthenticated) {

      routes = (
       
        <Switch>
            <Route path="/checkout" render={(props) => <Checkout {...props}/>}/>
            <Route path="/orders" render={(props) => <Orders {...props}/>}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/auth" render={(props) => <Auth {...props}/>}/>
            <Route path="/" exact component={BurgerBuilder}/>
            <Redirect to="/"/>
        </Switch>
       
        )
    }
    
    return (
      <div>
        <Layout>
          <Suspense fallback={<div>Загрузка...</div>}>
         {routes}
         </Suspense>
        </Layout>
      </div>
    );
    
  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
