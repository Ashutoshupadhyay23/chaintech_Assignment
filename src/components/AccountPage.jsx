import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccountPage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedPhone = localStorage.getItem('userPhone');

    if (isLoggedIn && storedName && storedEmail && storedPhone) {
      setUserDetails({
        name: storedName,
        email: storedEmail,
        phone: storedPhone,
      });
      setEmail(storedEmail);
      setPhone(storedPhone);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
  
    if (!email) {
      setError('Email is required.');
      return;
    }
  
    const oldPassword = localStorage.getItem('userPassword');
  
    // Handle password update logic only if new password fields are provided
    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        setError('Both new password and confirm password fields must be filled.');
        return;
      }
  
      if (password === oldPassword) {
        setError('New password cannot be the same as the old one.');
        return;
      }
  
      if (password !== confirmPassword) {
        setError('New password and confirm password did not match.');
        return;
      }
  
      // Update password if validation passes
      localStorage.setItem('userPassword', password);
    } else {
      // If no new password is provided, ensure no old password is set
      if (oldPassword && !password && !confirmPassword) {
        setError('To update, please provide new password.');
        return;
      }
    }
  
    // Update email and phone regardless of password changes
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhone', phone);
  
    setUserDetails(prevDetails => ({
      ...prevDetails,
      email,
      phone
    }));
  
    alert('Account information updated!');
    setEditMode(false);
  };
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <h2>Account Information</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Details</h5>
          <p className="card-text"><strong>Name:</strong> {userDetails.name}</p>
          <p className="card-text"><strong>Email:</strong> {userDetails.email}</p>
          <p className="card-text"><strong>Phone:</strong> {userDetails.phone}</p>
          <button className="btn btn-secondary me-2" onClick={() => setEditMode(true)}>Edit</button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {editMode && (
        <form onSubmit={handleUpdate} className="mt-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              id="phone"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      )}
    </div>
  );
};

export default AccountPage;