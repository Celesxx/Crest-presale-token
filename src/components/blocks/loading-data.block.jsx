import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/blocks/loadingData.assets.css';
import 'assets/css/blocks/mobile/loadingDataMobile.assets.css';
import React from "react";
import { connect } from 'react-redux'

const MapStateToProps = (state) => {
  return { 
    loading: state.dashboard.loading,
    loadingMax: state.dashboard.loadingMax,
  }; 
};

class LoadingData extends React.Component 
{

    constructor(props) 
    {
        super(props);

        this.state = 
        {
            loadingDiv: [],
            loading: this.props.loading,
            loadingMax: this.props.loadingMax,
        };
    }

    UNSAFE_componentWillMount() { document.querySelectorAll('.home').forEach((element) => { element.classList.add("menu-toggle") })}
    componentWillUnmount() { document.querySelectorAll('.home').forEach((element) => { element.classList.remove("menu-toggle") })}

    async componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key] && this.state[key] != undefined)
            {   
                this.state[key] = this.props[key]
                if(key == "loading")
                {
                    let loadingBar = document.getElementById('loading-bar-inner-data')
                    loadingBar.classList.value = ""
                    loadingBar.style.setProperty('--widthMin',`${(parseFloat(this.state.loading - 1) / parseFloat(this.state.loadingMax) * 100)}%`);
                    loadingBar.style.setProperty('--widthMax',`${(parseFloat(this.state.loading) / parseFloat(this.state.loadingMax) * 100)}%`);
                    loadingBar.classList.add("loading-bar-inner")
                    if(this.state.loading === this.state.loadingMax) loadingBar.style.setProperty('widthMaxEnd', '100%')
                    
                }
                this.forceUpdate();
            }
        }
    }


    render()
    {
        return(
            <div className="loading-bar-core flex column center">
                <h1 className="loading-bar-title">Loading</h1>
                <div className="loading-bar-base border-gradient-bluePink flex">
                    <div className="loading-bar-inner" id="loading-bar-inner-data"></div>
                </div>
            </div>
        )
    }
}

export default connect(MapStateToProps)(LoadingData);
