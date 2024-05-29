import React, { useState } from 'react';
import { Button } from '@aws-amplify/ui-react';
import Modal from 'react-modal';
import axios from 'axios';
import { changePassword, deleteAccount } from '../utils/AuthUtils';
import '../styles/UserSetting.css';

Modal.setAppElement('#root');

const UserSetting = ({ signOut, userProfile }) => {
    const [dropdownActive, setDropdownActive] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const toggleDropdown = () => {
        setDropdownActive(!dropdownActive);
    };

    const handleUpdatePassword = async () => {
        try {
            await changePassword(oldPassword, newPassword);
            setPasswordModalVisible(false);
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/delete-user`, {
                userid: userProfile.sub
            });

            console.log('Response from server:', response.data);

            await deleteAccount();
            setDeleteModalVisible(false);
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleClosePasswordModal = () => {
        setPasswordModalVisible(false);
        setOldPassword('');
        setNewPassword('');
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalVisible(false);
    };

    return (
        <div className="user-settings">
            <Button variation="link" className="settings-button" onClick={toggleDropdown}>
                Settings
            </Button>
            {dropdownActive && (
                <div className="settings-dropdown">
                    <div className="settings-option" onClick={() => setPasswordModalVisible(true)}>Change Password</div>
                    <div className="settings-option" onClick={() => setDeleteModalVisible(true)}>Delete Account</div>
                    <div className="settings-option" onClick={signOut}>Sign Out</div>
                </div>
            )}

            <Modal
                isOpen={passwordModalVisible}
                onRequestClose={() => setPasswordModalVisible(false)}
                contentLabel="Change Password"
                className="modal"
                overlayClassName="overlay"
            >
                <h3>Change Password</h3>
                <label>
                    Old Password:
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </label>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
                <Button onClick={handleClosePasswordModal}>Cancel</Button>
            </Modal>

            <Modal
                isOpen={deleteModalVisible}
                onRequestClose={handleCloseDeleteModal}
                contentLabel="Confirm Delete Account"
                className="modal"
                overlayClassName="overlay"
            >
                <h3>Confirm Delete Account</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <Button onClick={handleDeleteAccount}>Delete Account</Button>
                <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            </Modal>
        </div>
    );
};

export default UserSetting;
