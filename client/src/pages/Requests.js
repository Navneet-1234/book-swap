import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Requests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/my-requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSentRequests(res.data.sentRequests);
      setReceivedRequests(res.data.receivedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Failed to fetch requests. Please try again.');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}`, 
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
      navigate('/login');
    }
  };

  return (
    <div className="requests-container">
      <h1>My Requests</h1>
      
      <h2>Sent Requests</h2>
      {sentRequests.map(request => (
        <div key={request._id} className="book-card">
          <h3>{request.book.title}</h3>
          <p>Author: {request.book.author}</p>
          <p>Owner: {request.owner.username}</p>
          <p>Status: {request.status}</p>
        </div>
      ))}

      <h2>Received Requests</h2>
      {receivedRequests.map(request => (
        <div key={request._id} className="book-card">
          <h3>{request.book.title}</h3>
          <p>Author: {request.book.author}</p>
          <p>Requester: {request.requester.username}</p>
          <p>Status: {request.status}</p>
          {request.status === 'pending' && (
            <div>
              <button 
                className="button" 
                onClick={() => handleRequestAction(request._id, 'accepted')}
              >
                Accept
              </button>
              <button 
                className="button" 
                onClick={() => handleRequestAction(request._id, 'declined')}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Requests;