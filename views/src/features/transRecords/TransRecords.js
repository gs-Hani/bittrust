import   React, {useEffect} from 'react';
import { useSelector }      from 'react-redux';
import { useNavigate }      from 'react-router-dom';
import './TransRecords.css';

export const TransRecords = () => {

    const { authenticated,transactions,credit }  = useSelector((state) => state.auth);
    const   navigate        = useNavigate();
    useEffect(() => { if (!authenticated) { navigate('/'); } }, [authenticated, navigate]);
    //===========================================================================
    return (
        <div>
            <p>Your current referral credit : {credit} CA$</p>
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
}

const TableRow = (data) => {
    const { record } = data;
    return (
        <tr>
         <td>{record.date}</td>
         <td>{record.amount}</td>
         <td>{record.dealName}</td>
        </tr>
    )
}