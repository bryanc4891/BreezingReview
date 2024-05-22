import { updatePassword, deleteUser } from 'aws-amplify/auth';


export const changePassword = async (oldPassword, newPassword) => {
    try {
        await updatePassword({
            oldPassword: oldPassword,
            newPassword: newPassword
        });
        alert('Password successfully updated.');
    } catch (error) {
        console.error('Error updating password:', error);
        alert('Error updating password');
    }
};

export const deleteAccount = async() => {
    try {
        await deleteUser();
        alert('Your account has been deleted');
        window.location.reload();
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account');
    }
};
