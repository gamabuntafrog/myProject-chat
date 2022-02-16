import React, { useContext } from 'react';
import {Route, Redirect, Switch } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Context } from '../..';
import { privateRoutes, publicRoutes } from '../routes';




const AppRouter = () => {
    const {auth} = useContext(Context)

    const [user, isLoading, error] = useAuthState(auth)
    
    return user ? (
        <Switch>
            {privateRoutes.map(({ path, Component }, i) => {
                return <Route key={i} path={path} component={Component} exact/>
            })}
            <Redirect to={'/search'} />
        </Switch>
    ) 
    :
    (
        <Switch>
            {publicRoutes.map(({ path, Component }) => {
                return <Route key={path} path={path} component={Component} exact/>
            })}
            <Redirect to={'/login'}/>
        </Switch>        
    )
}

export default AppRouter;
