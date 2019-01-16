import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import Amplify from 'aws-amplify';
//import amplify from './aws-exports';

platformBrowserDynamic().bootstrapModule(AppModule);

Amplify.configure({
    Auth: {
        identityPoolId: 'YOUR POOL ID', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'YOUR REGION', // REQUIRED - Amazon Cognito Region
        //userPoolId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito User Pool ID
        //userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
    },
    Storage: {
        bucket: 'YOUR BUCKET NAME', //REQUIRED -  Amazon S3 bucket
        region: 'YOUR REGION', //OPTIONAL -  Amazon service region
    },
    API: {
        endpoints: [
            {
                name: "YOUR LAMBDA API NAME",
                endpoint: "YOUR API ENDPOINT"
            },
        ]
    }
});
