import React from "react";

const createTableRow = (tx_id, type, from, amount, date, status, txuri, adduri) => {

    return (
        <tr key = {tx_id} >
            <td>
                <span>
                    <a href = {`${txuri}${tx_id}`} target = "_blank">
                        {`${tx_id.slice(0, 10)}....${tx_id.slice(tx_id.length-4, tx_id.length)}`}
                    </a>
                </span>
            </td>
            <td>
                <span>{type}</span>
            </td>
            <td>
                <span>
                    <a href = {`${adduri}${from}`} target = "_blank">
                        {`${from.slice(0, 10)}....${from.slice(from.length-4, from.length)}`}
                    </a>
                </span>
            </td>
            <td>
                <span>{amount}</span>
            </td>
            <td>
                <span>{date.slice(0, date.length-4)}</span>
            </td>
            <td>
                <span>{status}</span>
            </td>
        </tr>
    )
}

const TableContent = ({history, txuri, adduri}) => {

  return (
    <tbody>
        {history?.map((tx) => (
            createTableRow(tx.id, tx.type, tx.from, tx.amount, tx.date, tx.status, txuri, adduri)
        ))}
    </tbody>
  );
};

export default TableContent;
