import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { getUsers } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const Dashboard = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const handleTransaction = (type) => {
    setError('');
    setSuccess('');

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (type === 'Withdraw' && numericAmount > user.balance) {
      setError('Insufficient balance!');
      return;
    }

    const newBalance =
      type === 'Deposit' ? user.balance + numericAmount : user.balance - numericAmount;

    const newTransaction = {
      id: Date.now(),
      type,
      amount: numericAmount,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
    };

    const updatedUser = {
      ...user,
      balance: newBalance,
      transactions: [newTransaction, ...(user.transactions || [])],
    };

    const users = getUsers();
    const updatedUsers = users.map((u) => (u.email === user.email ? updatedUser : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    login(updatedUser);
    setAmount('');
    setSuccess(`Successfully ${type.toLowerCase()}ed $${numericAmount}!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6 mt-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <p className="text-blue-200 text-sm font-medium">Available Balance</p>
            <h2 className="text-4xl font-extrabold mt-1">${user.balance?.toFixed(2) || '0.00'}</h2>
          </div>
          <div>
            <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-lg text-xs uppercase font-semibold">
              Active Account
            </span>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

        {/* Deposit / Withdraw Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Transactions</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleTransaction('Deposit')}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Deposit Money
              </button>
              <button
                onClick={() => handleTransaction('Withdraw')}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow"
              >
                Withdraw Money
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
          {user.transactions && user.transactions.length > 0 ? (
            <div className="space-y-3">
              {user.transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800">{tx.type}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <span className={`font-bold text-lg ${tx.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;