import   React, { useEffect }       from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { loadRecords } from './transRecordsSlice';

export const TransRecords = () => {
    const   dispatch    = useDispatch();
    const { records }   = useSelector(state => state.transRecords);
    const { trans_ids }  = useSelector(state => state.auth);
    //===========================================================================
    useEffect(() =>{
        console.log('dispatching');
        dispatch(loadRecords(trans_ids));
    },[dispatch]);
    //===========================================================================
    return (
        <table>
            <thead>
                <tr>
                    <td>Date</td>
                    <td>Amount (CA$)</td>
                    <td>Transaction ID</td>
                </tr>
            </thead>
            <tbody>
                {records.map((record) => (<TableRow key={record.hs_object_id} record={record}/>)).reverse()}
            </tbody>
        </table>
    )
}

const TableRow = (data) => {
    const { record } = data; 
    return (
        <tr>
            <td>{record.closedate.split('T')[0]}</td>
            <td>{record.amount}</td>
            <td>{record.hs_object_id}</td>
        </tr>
    )
}