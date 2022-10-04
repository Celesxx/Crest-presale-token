import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";

const ProtectedRoute = ({ component: Component, address , ...rest}) =>
{
    return (
        <Route {...rest} render={ props =>
            address == ""
            ? ( <Redirect to={{pathname:"/home", state: {from: props.location }}}/>) 
            : ( <Component {...props} /> )
        }/>
    );
    
}

const mapStateToProps = (state) => {
    return {
      address: state.login.address,
    };
};

export default connect(mapStateToProps)(ProtectedRoute);