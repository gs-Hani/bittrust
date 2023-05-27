import   React         from 'react';
import { useSelector } from 'react-redux';

export const TransRecords = () => {
    const { transactions } = useSelector(state => state.auth);
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
                {transactions.map((record) => (<TableRow key={record.id} record={record}/>)).reverse()}
            </tbody>
        </table>
    )
}

const TableRow = (data) => {
    const { record } = data; 
    return (
        <tr>
            <td>{record.date}</td>
            <td>{record.amount}</td>
            <td>{record.id}</td>
        </tr>
    )
}