import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalculateFee from './CalculateFee';

function Commissions() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [feeCashIn, setFeeCashIn] = useState(null);
    const [feeCashOutNatural, setFeeCashOutNatural] = useState(null);
    const [feeCashOutLegal, setFeeCashOutLegal] = useState(null);  

    useEffect(() => {
        const url1 = "http://localhost:3000/commissions";
        const url2 = "https://developers.paysera.com/tasks/api/cash-in";
        const url3 = "https://developers.paysera.com/tasks/api/cash-out-natural";
        const url4 = "https://developers.paysera.com/tasks/api/cash-out-juridical";

        const promise1 = axios.get(url1).then(response => {
            setUsers(response);
        });
        const promise2 = axios.get(url2).then(response => {
            setFeeCashIn(response);
        });
        const promise3 = axios.get(url3).then(response => {
            setFeeCashOutNatural(response);
        });
        const promise4 = axios.get(url4).then(response => {
            setFeeCashOutLegal(response);
        });

        Promise.all([promise1, promise2, promise3, promise4]).then(values => {
            return values;
          }).catch(error => {
            setError(error);
          })
    }, []);   

    if (error) return <h3>An error happened: {error.message}</h3>
    
    let usersArr = [];
    if (users.length !== 0) {
        usersArr = Object.values(users)[0];
    }

    return(
        <table>
            <thead>
                <tr>
                    <th>User Id:</th>
                    <th>Date:</th>
                    <th>Fee EUR:</th>
                </tr>
            </thead>
            <tbody>
                {((usersArr.length > 0) && feeCashIn && feeCashOutNatural && feeCashOutLegal) ?
                    usersArr.map((user, i) => {
                        return <CalculateFee 
                                key={i}
                                index={i}
                                users={usersArr}
                                userId={user.user_id} 
                                type={user.type}
                                user_type={user.user_type}
                                amount={user.operation.amount}
                                date={user.date}
                                feeCashInPercents={feeCashIn.data.percents} 
                                feeCashInMax={feeCashIn.data.max.amount}
                                feeCashOutNaturalPercents={feeCashOutNatural.data.percents}
                                feeCashOutNaturalWeekLimit={feeCashOutNatural.data.week_limit.amount}
                                feeCashOutLegalPercents={feeCashOutLegal.data.percents}
                                feeCashOutLegalMin={feeCashOutLegal.data.min.amount}
                                >
                            </CalculateFee>
                }) : 
                <tr>
                    <td colSpan={2}>Loading...</td>
                </tr>}                
            </tbody>
        </table>
    );
}

export default Commissions;