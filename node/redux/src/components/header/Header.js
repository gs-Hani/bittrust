import   React,     { useEffect }   from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link }                     from 'react-router-dom';

import { is_Auth }         from '../../features/auth/authSlice';

import Bittrust from '../../util/Bittrust.svg';

export const Header = () => {

    const   dispatch        = useDispatch();
    const { authenticated } = useSelector(state => state.auth);

    // useEffect (() => { dispatch(is_Auth()); },[dispatch,authenticated]);

    const Profile = () => {
        if (authenticated) {
            return (<Link to='/profile'>Profile</Link>)
        }
    }

    return (
        <header>
            <img src={Bittrust} alt={`Logo`}/>
            {Profile()}
        </header>
    )
};