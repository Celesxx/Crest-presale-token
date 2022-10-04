import { dashboard } from 'store/reducers/dashboard.reducer.js'


const DashboardActions = (data) => 
{
    return (dispatch) => { dispatch(dashboard(data)); }
};

export { DashboardActions };