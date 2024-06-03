import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Authenticator, View, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../styles/App.css';
import configureAmplify from '../config/AmplifyConfig';
import MapComponent from '../components/MapComponent';
import UserSetting from '../components/UserSetting';
import MeetingList from '../components/MeetingList';
import { UserProfileProvider, useUserProfile } from '../contexts/UserContext';
import { MeetingComponent } from '../components/MeetingComponent';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


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
            <Box>
                <AppBar sx={{ bgcolor: "white" }} position="static">
                    <Toolbar>
                    <Button component={Link} to="/">
                            Map
                        </Button>
                        <Button component={Link} to="/meetings/">
                            Meetings
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <Routes>
                <Route path="/" element={<MapComponent />}/>
                <Route path="/meeting" element={<MeetingComponent />}/>
                <Route path="/meetings" element={<MeetingList />}/>
            </Routes>
        </View>
    );
};

export default App;
