import   React, {useEffect} from 'react';
import { useSelector }      from 'react-redux';
import { useNavigate }      from 'react-router-dom';

export const TransRecords = () => {
    const { transactions } = useSelector(state => state.auth);
    const { authenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(authenticated);
        if (!authenticated) {
          navigate('/');
        }
      }, [authenticated, navigate]);
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