import { Amplify } from 'aws-amplify';


const configureAmplify = () => {
    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
                userPoolId: process.env.REACT_APP_USER_POOL_ID,
                loginWith: {
                    oauth: {
                        domain: process.env.REACT_APP_OAUTH_DOMAIN,
                        scopes: ['openid','email','phone','profile','aws.cognito.signin.user.admin'],
                        redirectSignIn: [process.env.REACT_APP_REDIRECT_SIGN_IN],
                        redirectSignOut: [process.env.REACT_APP_REDIRECT_SIGN_OUT],
                        responseType: 'code',
                    },
                    email: 'true',
                }
            }
        }
    });
};

export default configureAmplify;
