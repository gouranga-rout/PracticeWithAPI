import React from 'react';

const TransactionsTable = ({ transactions, month }) => {
  return (
    <div className="content">
      <h2 className="title">Transactions - {month}</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="7">No transactions found.</td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="data">{transaction.title}</td>
                <td>{transaction.description}</td>
                <td className="data">${transaction.price}</td>
                <td className="data">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                <td className="data">{transaction.category}</td>
                <td className="data">{transaction.isSold ? 'Sold' : 'Unsold'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;

