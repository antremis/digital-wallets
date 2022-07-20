import React from "react";
import { useAuthContext } from "../../Context/AuthContext";

const createTableRow = (tx_id, chain, type, from, amount, date, status, txuri, adduri, admin) => {

    return (
        <tr key = {tx_id} >
            <td>
                <span>
                    {
                        txuri && admin
                        ?   (<a href = {txuri} target = "_blank">
                                {`${tx_id.substr(0, 6)}...${tx_id.substr(tx_id.length-4, tx_id.length)}`}
                            </a>)
                        :   `${tx_id}`
                    }
                </span>
            </td>
            <td>
                <span>{chain}</span>
            </td>
            <td>
                <span>
                    {
                        adduri && admin
                        ?   (<a href = {adduri} target = "_blank">
                                {`${from.substr(0, 6)}...${from.substr(from.length-4, from.length)}`}
                            </a>)
                        :   `${from}`
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

    const {admin} = useAuthContext()

  return (
    <tbody>
        {history?.map((tx) => (
            createTableRow(tx.id, tx.chain, tx.type, tx.from, tx.amount, tx.date, tx.status, tx.txuri, tx.adduri, admin)
        ))}
    </tbody>
  );
};

export default TableContent;
