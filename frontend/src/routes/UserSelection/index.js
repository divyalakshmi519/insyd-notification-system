import React, { useState } from 'react';
import './index.css';

const UserSelection = ({ onUserSelect, users, loading, error }) => {
    const [username, setUsername] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');

    const handleCreateUser = async () => {
        if (username.trim()) {
            setIsCreating(true);
            try {
                const response = await fetch('https://insyd-notification-system-0rnr.onrender.com/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username.trim() })
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    onUserSelect(userData);
                    setUsername('');
                } else {
                    const errorData = await response.json();
                    console.error('Failed to create user:', errorData);
                }
            } catch (error) {
                console.error('Error creating user:', error);
            }
            setIsCreating(false);
        }
    };

    const handleSelectUser = () => {
        if (selectedUserId) {
            const user = users.find(u => u.id.toString() === selectedUserId);
            if (user) {
                onUserSelect(user);
            }
        }
    };

    return (
        <div className="user-selection">
            <h2>Welcome to Social Dashboard</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            {/* Create User Section */}
            <div className="create-user-section">
                <h3>Create New User</h3>
                <div className="input-group">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username..."
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
                        disabled={isCreating}
                    />
                    <button
                        onClick={handleCreateUser}
                        disabled={isCreating || !username.trim()}
                        className="create-btn"
                    >
                        {isCreating ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>

            {/* Select Existing User */}
            <div className="select-user-section">
                <h3>Select Existing User</h3>
                <div className="select-group">
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="user-select"
                        disabled={loading || users.length === 0}
                    >
                        <option value="">Choose a user...</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                @{user.username} (ID: {user.id})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSelectUser}
                        disabled={!selectedUserId || loading}
                        className="select-btn"
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Loading users...</div>}
        </div>
    );
};

export default UserSelection;
