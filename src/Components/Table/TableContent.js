import React from "react";

const createTableRow = (tx_id, chain, type, from, amount, date, status, txuri, adduri) => {

    return (
        <tr key = {tx_id} >
            <td>
                <span>
                    {
                        txuri 
                        ?   (<a href = {txuri} target = "_blank">
                                {`${tx_id.slice(0, 10)}....${tx_id.slice(tx_id.length-4, tx_id.length)}`}
                            </a>)
                        :   `${tx_id.slice(0, 10)}....${tx_id.slice(tx_id.length-4, tx_id.length)}`
                    }
                </span>
            </td>
            <td>
                <span>{chain}</span>
            </td>
            <td>
                <span>
                    {
                        adduri 
                        ?   (<a href = {adduri} target = "_blank">
                                {`${from.slice(0, 10)}....${from.slice(from.length-4, from.length)}`}
                            </a>)
                        :   `${from.slice(0, 10)}....${from.slice(from.length-4, from.length)}`
                    }
                </span>
            </td>
            <td>
                {
                    amount > 0
                    ? type === "Sent"
                        ? <span style = {{color : "red", textAlign : "right"}}>{`-${amount}`}</span>
                        : <span style = {{color : "green", textAlign : "right"}}>{`+${amount}`}</span>
                    : <span style = {{color : "green", textAlign : "right"}}>{amount}</span>
                }
            </td>
            <td>
                <span>{date.slice(0, date.length-4)}</span>
            </td>
            <td>
                {
                    status === "Completed"
                    ? <span style = {{color : "green"}} >{status}</span>
                    : <span style = {{color : "red"}} >{status}</span>
                }
            </td>
        </tr>
    )
}

const TableContent = ({history, txuri, adduri}) => {

  return (
    <tbody>
        {history?.map((tx) => (
            createTableRow(tx.id, tx.chain, tx.type, tx.from, tx.amount, tx.date, tx.status, tx.txuri, tx.adduri)
        ))}
    </tbody>
  );
};

export default TableContent;
