import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { adminAPI } from '../utils/api';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaUserTie, FaTools, FaCalendarCheck, 
  FaCheckCircle, FaHourglassHalf, FaChartBar,
  FaEdit, FaTrash, FaCheck, FaTimes, FaEye
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Wait for user context to load
    if (userLoading) return;
    
    // Check if user is logged in and is admin
    if (!user.isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (user.userType !== 'admin') {
      console.log('User is not admin, userType:', user.userType, 'isLoggedIn:', user.isLoggedIn);
      navigate('/login');
      return;
    }
    
    loadDashboard();
  }, [activeTab, searchTerm, user.isLoggedIn, user.userType, userLoading, navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      if (activeTab === 'dashboard') {
        const statsData = await adminAPI.getStats();
        setStats(statsData.stats);
      } else if (activeTab === 'users') {
        const usersData = await adminAPI.getUsers({ search: searchTerm });
        setUsers(usersData.users || []);
      } else if (activeTab === 'user-details' && selectedUser && typeof selectedUser === 'number') {
        const userData = await adminAPI.getUserById(selectedUser);
        setSelectedUser(userData.user);
      } else if (activeTab === 'providers') {
        const providersData = await adminAPI.getProviders({ search: searchTerm });
        setProviders(providersData.providers || []);
      } else if (activeTab === 'services') {
        const servicesData = await adminAPI.getServices({ search: searchTerm });
        setServices(servicesData.services || []);
      } else if (activeTab === 'bookings') {
        const bookingsData = await adminAPI.getBookings({ search: searchTerm });
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProvider = async (id, verified) => {
    try {
      await adminAPI.verifyProvider(id, verified);
      loadDashboard();
    } catch (error) {
      alert('Failed to update provider verification');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      loadDashboard();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await adminAPI.deleteService(id);
      loadDashboard();
    } catch (error) {
      alert('Failed to delete service');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      loadDashboard();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading && activeTab === 'dashboard') {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>Super Admin</h2>
          <p>{user.name}</p>
        </div>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartBar /> Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
          <button 
            className={activeTab === 'providers' ? 'active' : ''}
            onClick={() => setActiveTab('providers')}
          >
            <FaUserTie /> Providers
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''}
            onClick={() => setActiveTab('services')}
          >
            <FaTools /> Services
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCalendarCheck /> Bookings
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && stats && (
          <div className="admin-dashboard-view">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaUserTie className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.totalProviders}</h3>
                  <p>Service Providers</p>
                </div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaTools className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.totalServices}</h3>
                  <p>Total Services</p>
                </div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaCalendarCheck className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.totalBookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaHourglassHalf className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.pendingBookings}</h3>
                  <p>Pending Bookings</p>
                </div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaCheckCircle className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.completedBookings}</h3>
                  <p>Completed Bookings</p>
                </div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <FaCheckCircle className="stat-icon" />
                <div className="stat-info">
                  <h3>{stats.verifiedProviders}</h3>
                  <p>Verified Providers</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-table-view">
            <div className="admin-table-header">
              <h1>Users Management</h1>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => loadDashboard(), 500);
                }}
                className="admin-search"
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><code className="password-display">{user.password || 'N/A'}</code></td>
                    <td>{user.phone || '-'}</td>
                    <td><span className={`badge badge-${user.userType}`}>{user.userType}</span></td>
                    <td>{typeof user.location === 'string' ? user.location : (user.location?.address || user.location?.city || '-')}</td>
                    <td>{user.bookings?.length || 0}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-icon" 
                        onClick={() => {
                          setSelectedUser(user.id);
                          setActiveTab('user-details');
                        }}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button className="btn-icon" onClick={() => handleDeleteUser(user.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="admin-table-view">
            <div className="admin-table-header">
              <h1>Providers Management</h1>
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => loadDashboard(), 500);
                }}
                className="admin-search"
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Phone</th>
                  <th>Verified</th>
                  <th>Services</th>
                  <th>Bookings</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider.id}>
                    <td>{provider.id}</td>
                    <td>{provider.name}</td>
                    <td>{provider.businessName || '-'}</td>
                    <td>{provider.email}</td>
                    <td><code className="password-display">{provider.password || 'N/A'}</code></td>
                    <td>{provider.phone || '-'}</td>
                    <td>
                      {provider.verified ? (
                        <span className="badge badge-success">Verified</span>
                      ) : (
                        <span className="badge badge-warning">Unverified</span>
                      )}
                    </td>
                    <td>{provider.services?.length || 0}</td>
                    <td>{provider.bookings?.length || 0}</td>
                    <td>{provider.experience || 0} years</td>
                    <td>
                      <button 
                        className="btn-icon"
                        onClick={() => handleVerifyProvider(provider.id, !provider.verified)}
                        title={provider.verified ? 'Unverify' : 'Verify'}
                      >
                        {provider.verified ? <FaTimes /> : <FaCheck />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="admin-table-view">
            <div className="admin-table-header">
              <h1>Services Management</h1>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => loadDashboard(), 500);
                }}
                className="admin-search"
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td>{service.category}</td>
                    <td>₹{service.price}</td>
                    <td>{service.provider?.name || '-'}</td>
                    <td><span className={`badge badge-${service.status}`}>{service.status}</span></td>
                    <td>
                      <button className="btn-icon" onClick={() => handleDeleteService(service.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'user-details' && selectedUser && (
          <div className="admin-table-view">
            <div className="admin-table-header">
              <button className="back-btn" onClick={() => { setActiveTab('users'); setSelectedUser(null); }}>
                ← Back to Users
              </button>
              <h1>User Details</h1>
            </div>
            {typeof selectedUser === 'object' ? (
              <div className="user-details">
                <div className="details-section">
                  <h2>Personal Information</h2>
                  <div className="details-grid">
                    <div><strong>ID:</strong> {selectedUser.id}</div>
                    <div><strong>Name:</strong> {selectedUser.name}</div>
                    <div><strong>Email:</strong> {selectedUser.email}</div>
                    <div><strong>Password:</strong> <code className="password-display">{selectedUser.password || 'N/A'}</code></div>
                    <div><strong>Phone:</strong> {selectedUser.phone || '-'}</div>
                    <div><strong>User Type:</strong> <span className={`badge badge-${selectedUser.userType}`}>{selectedUser.userType}</span></div>
                    <div><strong>Location:</strong> {typeof selectedUser.location === 'string' ? selectedUser.location : (selectedUser.location?.address || selectedUser.location?.city || '-')}</div>
                    <div><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                
                {selectedUser.userType === 'provider' && (
                  <div className="details-section">
                    <h2>Provider Information</h2>
                    <div className="details-grid">
                      <div><strong>Business Name:</strong> {selectedUser.businessName || '-'}</div>
                      <div><strong>Bio:</strong> {selectedUser.bio || '-'}</div>
                      <div><strong>Experience:</strong> {selectedUser.experience || 0} years</div>
                      <div><strong>Verified:</strong> {selectedUser.verified ? <span className="badge badge-success">Yes</span> : <span className="badge badge-warning">No</span>}</div>
                      <div><strong>Service Areas:</strong> {Array.isArray(selectedUser.serviceAreas) ? selectedUser.serviceAreas.join(', ') : '-'}</div>
                      <div><strong>Services Count:</strong> {selectedUser.services?.length || 0}</div>
                    </div>
                  </div>
                )}

                <div className="details-section">
                  <h2>Orders/Bookings ({selectedUser.bookings?.length || 0})</h2>
                  {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Service</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.bookings.map(booking => (
                          <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.service?.name || '-'}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>{booking.bookingTime || '-'}</td>
                            <td>₹{booking.totalAmount}</td>
                            <td><span className={`badge badge-${booking.status}`}>{booking.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No bookings found.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>Loading user details...</div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-table-view">
            <div className="admin-table-header">
              <h1>Bookings Management</h1>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => loadDashboard(), 500);
                }}
                className="admin-search"
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>User Email</th>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.user?.name || '-'}</td>
                    <td>{booking.user?.email || '-'}</td>
                    <td>{booking.service?.name || '-'}</td>
                    <td>{booking.service?.provider?.name || booking.service?.provider?.businessName || '-'}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td>{booking.bookingTime || '-'}</td>
                    <td>{booking.address || '-'}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-icon" title="View Details">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
