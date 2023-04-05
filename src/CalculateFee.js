import React from 'react';
import moment from 'moment';

moment().format();

function CalculateFee(
    { index, 
    users,
    userId, 
    type, 
    user_type, 
    amount, 
    date,
    feeCashInPercents, 
    feeCashInMax, 
    feeCashOutNaturalPercents,
    feeCashOutNaturalWeekLimit, 
    feeCashOutLegalPercents,
    feeCashOutLegalMin }) {
    
    let fee = 0; //the fee to be calculated

    switch (type) {
        case 'cash_in':
            fee = feeCashInPercents * 0.01 * amount;
            
            if (fee > feeCashInMax) {
                fee = feeCashInMax;
            }
            
            break;
        case 'cash_out':
            if (user_type === 'natural') {

                if (amount > feeCashOutNaturalWeekLimit) {
                    fee = (amount - feeCashOutNaturalWeekLimit) * feeCashOutNaturalPercents * 0.01;
                }
                else {

                    const userDate = new Date(date);
                
                    //getting the start of the week to which userDate belongs:
                    let weekStart = moment(userDate).startOf('isoWeek');
                                   
                    let userOperations = [];
                    for (let i = 0; i < index; i++) {

                        if (
                            users[i].user_id === userId && 
                            users[i].type === "cash_out" &&
                            new Date(users[i].date) >= new Date(weekStart) &&
                            new Date(users[i].date) <= userDate
                            ) {
                            userOperations.push(users[i]);
                        }
                    }
                   
                    //get the fees of the current user of the current week before the current date:
                    let userFeesInCurrentWeek = 0;
                    userOperations.forEach(operation => {                      
                        userFeesInCurrentWeek = userFeesInCurrentWeek + operation.operation.amount;    
                    });
                    
                    if ((userFeesInCurrentWeek + amount) > feeCashOutNaturalWeekLimit) {
                        if (userFeesInCurrentWeek < feeCashOutNaturalWeekLimit) {
                            fee = (userFeesInCurrentWeek + amount - feeCashOutNaturalWeekLimit) * feeCashOutNaturalPercents * 0.01;
                        } 
                        //the sum is over the weekly limit:
                        else {
                            fee = amount * feeCashOutNaturalPercents* 0.01;
                        }    
                    }
                }
            } 
            else {
                if (user_type === 'juridical') {
                    fee = feeCashOutLegalPercents* 0.01 * amount;

                    if (fee < feeCashOutLegalMin) {
                        fee = feeCashOutLegalMin;
                    }
                }
                else {
                    throw Error('Unknown user_type');
                }
            }
            break;
        default:
            throw Error('Unknown type');
    } 

    fee = ((Math.ceil(fee.toFixed(3) * 1000)) / 1000).toFixed(2);
  
    return(
        <tr>
            <td>{userId}</td>
            <td>{date}</td>
            <td>{fee}</td>
        </tr>
    );
}

export default CalculateFee;