import   React, { useEffect } from 'react';
import { useSelector }        from 'react-redux';
import { useNavigate }        from 'react-router-dom';
import './TransRecords.css';
import { Loading }            from '../../components/loading/Loading';
import { is_Auth }            from '../../features/auth/authSlice';

export const TransRecords = () => {
    const   navigate              = useNavigate();
    const { transactions,credit,status1 } = useSelector((state) => state.auth);
    // useEffect (() => {
    //     if(status1 !== 'loading' && !authenticated) { {navigate('/');} }
    // },[status1,authenticated,navigate]);
    //===========================================================================
    if      (status1 === 'loading')   { return (Loading()) }
    else if (status1 === 'succeeded') { return (Transactions(transactions,credit))} 
};

const Transactions = (transactions,credit) => {
    return (
        <div>
            <h3>Your current referral credit : {credit} CA$</h3>
            <div className="table-container">
                <table className='table' id='tablehead'>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td >Amount (CA$)</td>
                            <td>Transaction name</td>
                        </tr>
                    </thead>
                </table>
                <div className="table-wrapper">
                    <table className='table'>
                        <tbody>
                            {transactions.map((record) => (<TableRow key={record.id} record={record}/>)).reverse()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

const TableRow = (data) => {
    const { record } = data;
    return (
        <tr>
         <td>{record.date}</td>
         <td>{record.amount}</td>
         <td>{record.dealName}</td>
        </tr>
    )
};