import   React, { useEffect }       from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { loadRecords } from './transRecordsSlice';

export const TransRecord = () => {
    const   dispatch    = useDispatch();
    const { records }   = useSelector(state => state.transRecords);
    const { record_id } = useSelector(state => state.auth);
    //===========================================================================
    useEffect(() =>{
        dispatch(loadRecords(record_id),[record_id]);
    });
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
                {records.map((record) => (<TableRow key={record.hs_object_id} record={record}/>))}
            </tbody>
        </table>
    )
}

const TableRow = (data) => {
    const { record } = data; 
    return (
        <tr>
            <td>{record.closedate}</td>
            <td>{record.amount}</td>
            <td>{record.hs_object_id}</td>
        </tr>
    )
}