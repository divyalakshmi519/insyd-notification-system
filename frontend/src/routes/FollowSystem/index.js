import React, { useState } from 'react';
import './index.css';

const FollowSystem = ({ users, currentUser, loading, onFollow, follows }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);

    const alreadyFollowing = (followeeId) =>
        follows.some(f => f.followerId === currentUser.id && f.followeeId === followeeId);

    const handleFollow = async () => {
        const followeeId = parseInt(selectedUser);
        
        if (!followeeId || followeeId === currentUser.id) {
            console.error('Invalid followee ID or cannot follow yourself');
            return;
        }

        if (alreadyFollowing(followeeId)) {
            console.error('Already following this user');
            return;
        }

        setIsFollowing(true);
        try {
            await onFollow({
                followerId: currentUser.id,
                followeeId: followeeId
            });
            setSelectedUser('');
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setIsFollowing(false);
        }
    };

    const handleQuickFollow = async (followeeId) => {
        if (!followeeId || followeeId === currentUser.id || alreadyFollowing(followeeId)) {
            return;
        }

        setIsFollowing(true);
        try {
            await onFollow({
                followerId: currentUser.id,
                followeeId: followeeId
            });
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setIsFollowing(false);
        }
    };

    const otherUsers = users.filter(user => user.id !== currentUser.id);

    // Get the user object for the selected ID
    const selectedUserObj = users.find(user => user.id === parseInt(selectedUser));

    return (
        <div className="card follow-system-card">
            <h3>👥 Follow Users</h3>

            {/* Follow dropdown */}
            <div className="follow-controls">
                <select
                    className="follow-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    disabled={isFollowing}
                >
                    <option value="">Select a user to follow...</option>
                    {otherUsers.map(user => (
                        <option key={user.id} value={user.id} disabled={alreadyFollowing(user.id)}>
                            @{user.username} {alreadyFollowing(user.id) ? '(Already Followed)' : ''}
                        </option>
                    ))}
                </select>
                <button
                    className="follow-btn"
                    onClick={handleFollow}
                    disabled={!selectedUser || alreadyFollowing(parseInt(selectedUser)) || isFollowing}
                >
                    {isFollowing ? 'Following...' : 'Follow'}
                </button>
            </div>

            {selectedUser && selectedUserObj && (
                <div className="selected-user-info">
                    <h4>Selected: @{selectedUserObj.username}</h4>
                    <p>{selectedUserObj.bio || 'No bio available'}</p>
                </div>
            )}

            {/* All Users Grid */}
            <div className="users-section">
                <h4>All Users ({otherUsers.length})</h4>
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <div className="users-grid">
                        {otherUsers.map(user => (
                            <div key={user.id} className="user-card">
                                <div className="user-card-content">
                                    <img
                                        src={user.avatar_url || 'https://placehold.co/50x50'}
                                        alt={user.username}
                                        className="user-avatar"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/50x50';
                                        }}
                                    />
                                    <div className="user-info">
                                        <h4>@{user.username}</h4>
                                        <p className="user-bio">{user.bio || 'No bio available'}</p>
                                        <p className="user-id">ID: {user.id}</p>
                                        <button
                                            className={`mini-follow-btn ${alreadyFollowing(user.id) ? 'following' : ''}`}
                                            onClick={() => handleQuickFollow(user.id)}
                                            disabled={alreadyFollowing(user.id) || isFollowing}
                                        >
                                            {alreadyFollowing(user.id) 
                                                ? '✔ Following' 
                                                : isFollowing 
                                                    ? '...' 
                                                    : 'Follow'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowSystem;
