/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.                                                                              *
 ******************************************************************************************************************** */
import { createContext, useContext } from 'react';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

export interface CognitoAuthContextAPI {
    /**
     * AWS region.
     */
    region?: string;
    /**
     * Cognito Identity Pool Id
     */
    identityPoolId?: string;
    /**
     * Cognito User Pool Id
     */
    userPoolId: string;
    /**
     * CognitoUserPool object
     */
    userPool: CognitoUserPool | null;
    /**
     * SignOut event handler
     */
    onSignOut: () => void;
    /**
     * Returns an instance of current authenticated CognitoUser.
     * The returned cognitoUser object does not include session.
     * Use <cognitoUser>.getSession callback to retrieve session tokens.
     */
    getAuthenticatedUser?: () => CognitoUser | null;
}

const initialState = {
    userPoolId: '',
    userPool: null,
    onSignOut: () => {},
    getAuthenticatedUser: () => null,
};

export const CognitoAuthContext = createContext<CognitoAuthContextAPI>(initialState);

export const useCognitoAuthContext = () => useContext(CognitoAuthContext);
