import   React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link }                     from 'react-router-dom';
import './Header.css'
import { sign_out }                 from '../../features/auth/authSlice';
import   Bittrust                   from '../../util/Bittrust.svg';

export const Header = () => {
    const   dispatch        = useDispatch();
    const { authenticated } = useSelector(state => state.auth);

    const Profile = () => {
        if (authenticated) {
            return (
                <nav>
                    <div id='links'>
                    <Link to='/transRecords'>Transactions</Link>
                    <Link to='/profile'>Profile</Link>
                    <Link onClick={() => dispatch(sign_out())} id="button ">Sign Out</Link>
                    </div>
                </nav>
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