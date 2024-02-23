import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import AuthenticationModel from 'src/javascripts/models/AuthenticationModel';

import type { IRootState } from 'src/javascripts/store';

const PrivateRoutes: React.FC = () => {
    const sliceAuthenticationState = useSelector((state: IRootState) => state.authentication);
    const sliceAuthenticationStateData = new AuthenticationModel(sliceAuthenticationState.data);
    return sliceAuthenticationStateData.hasJwtToken() ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
