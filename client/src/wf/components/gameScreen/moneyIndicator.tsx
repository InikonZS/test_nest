import React, { useEffect, useMemo, useRef, useState } from "react";
import './moneyIndicator.css';
import { Delay } from "../../core/delay";
import { randomKey } from "../../core/utils";

interface ITransactionProps {
    sum: number;
    onClosed: ()=>void;
}

function Transaction({sum, onClosed}: ITransactionProps){
    useEffect(()=>{
        const delay = new Delay(()=>{
            onClosed();
        }, 2000);
        return ()=>delay.cancel();
    }, []);
    return <div className={`wf_transaction ${sum < 0  ? 'wf_transaction_negative' : 'wf_transaction_positive'}`}>
        {(sum < 0 ? '' : '+') + sum}
    </div>
}


interface IMoneyIndicatorProps {
    money: number;
}

export function MoneyIndicator({money}: IMoneyIndicatorProps){
    const [lastMoney, setLastMoney] = useState<number>(0);
    const [transactions, setTransactions] = useState<Array<{id: number, sum: number}>>([]);
    useEffect(()=>{
        setTransactions(last=> [...last, {id: randomKey(), sum: money - lastMoney }]);
        setLastMoney(money);
    }, [money]);
    return <div className="wf_moneyIndicator_wrapper">
        <div className="wf_moneyIndicator_baseSum">money: {money}</div>
        {
            transactions.map(transaction=>{
                return <Transaction key={transaction.id} sum={transaction.sum} onClosed={()=>{
                    setTransactions(last=> last.filter(jt=>jt.id != transaction.id));
                }} />
            })
        }
    </div>
}