import React, {FC, useContext} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {Context} from '../..';
import {privateRoutes, publicRoutes} from '../routes';


const AppRouter: FC = () => {
    const {user} = useContext(Context)!



    return user ? (
            <Switch>
                {privateRoutes.map(({path, Component}, i) => {
                    return <Route key={i} path={path} component={Component} exact/>
                })}
                <Redirect to={'/search'}/>
            </Switch>
        )
        :
        (
            <Switch>
                {publicRoutes.map(({path, Component}, i) => {
                    return <Route key={i} path={path} component={Component} exact/>
                })}
                <Redirect to={'/login'}/>
            </Switch>
        )
}

export default AppRouter;
