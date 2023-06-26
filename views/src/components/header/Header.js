import   React, { useEffect }       from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link,useNavigate }         from 'react-router-dom';
import './Header.css'
import { sign_out, is_Auth }        from '../../features/auth/authSlice';
import   Bittrust                   from '../../util/Bittrust.svg';

export const Header = () => {
    const   dispatch                = useDispatch();
    const   navigate                = useNavigate();
    const { authenticated,status1 } = useSelector(state => state.auth);

    useEffect (() => { dispatch(is_Auth()) },[dispatch]);

    useEffect (() => { 
        if((status1 === 'failed'||status1 === 'succeeded') && !authenticated) {
            // console.log('header rerouting');
            navigate('/'); 
        }
    },[navigate,status1,authenticated]);

    const Profile = () => {
        if (authenticated) {
            return (
                <nav>
                    <div id='links'>
                        <Link to='/transRecords'>Transactions</Link>
                        <Link to='/profile'>Profile</Link>
                        <Link to='/' onClick={() => dispatch(sign_out())} id="button ">Sign Out</Link>
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