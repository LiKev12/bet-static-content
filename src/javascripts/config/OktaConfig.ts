export const oktaConfig = {
    clientId: '0oadb8fv4nUIkttfI5d7',
    issuer: 'https://dev-91539213.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email', 'authorization_code'],
    pkce: true,
    disableHttpsCheck: true,
};
