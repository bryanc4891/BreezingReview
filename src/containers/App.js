import React from 'react';
import { Authenticator, View, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../styles/App.css';
import configureAmplify from '../config/AmplifyConfig';
import MapComponent from '../components/MapComponent';
import UserSetting from '../components/UserSetting';
import { UserProfileProvider, useUserProfile } from '../contexts/UserContext';

configureAmplify();

const App = () => {
    return (
        <Authenticator
            loginMechanisms={['email']}
            signUpAttributes={['email', 'custom:Username', 'custom:City']}
            formFields={{
                signUp: {
                    email: { order: 1 },
                    'custom:Username': { label: 'Username', placeholder: 'Enter your username', required: true, order: 2 },
                    'custom:City': { label: 'City', placeholder: 'Enter your city', required: false, order: 3 },
                    password: { order: 4 },
                },
            }}
        >
            {({ signOut, user }) => user && (
                <UserProfileProvider user={user}>
                    <AuthenticatedApp signOut={signOut} />
                </UserProfileProvider>
            )}
        </Authenticator>
    );
};

const AuthenticatedApp = ({ signOut }) => {
    const userProfile = useUserProfile();
    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <View className="App">
            <Heading level={3} className="custom-heading">Hello, {userProfile['custom:Username']}!</Heading>
            <UserSetting signOut={signOut} userProfile={userProfile} />
            <div className="map-container">
                <MapComponent />
            </div>
        </View>
    );
};

export default App;
