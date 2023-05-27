import   React,     { useEffect }   from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link }                     from 'react-router-dom';
import './Header.css'
import { is_Auth }         from '../../features/auth/authSlice';

import Bittrust from '../../util/Bittrust.svg';

export const Header = () => {

    const   dispatch        = useDispatch();
    const { authenticated } = useSelector(state => state.auth);

    useEffect (() => { dispatch(is_Auth()); },[dispatch,authenticated]);

    const Profile = () => {
        if (authenticated) {
            return (
                <header className='header'>
                <div id='links'>
                  <Link to='/profile'>Profile</Link>
                  <Link to='/transactions'>Transaction</Link>
                  <Link to='/'>Sign Out</Link>
                </div>
                </header>
              );
        }
    }

    return (
        <header className='header'>
            <img src={Bittrust} alt={`Logo`}/>
            {Profile()}
            </header>
         
    )
};