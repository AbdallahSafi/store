# store

## Team Member 
 - Abdullah Safi
 - Ahmed Al-Habrawi
 - Nedal Erekat
 - Ahmad Alhrthani
 - Hidaya Syam

### Oauth website # Paypal

## Workflow
- read the documentation
- create an Oauth repository in Github
- Create the app 
 ### create a PayPal REST API application to receive the credentials, consisting of a client ID and secret, that you need to make API calls.
- Enable Connect with PayPal
### enable Connect with PayPal for that app in the dashboard:
 1. In the Sandbox App Settings section, enter the Return URL (redirect_uri) where your users are redirected after completing the Connect with PayPal flow. You must enter a URL before you can save the Connect with PayPal app settings.
 2. Select Connect with PayPal (formerly Log in with PayPal) 
 3. Store Your Credentials

 ##  The request must include the following:
###     Client ID of your live app
###     Description of your app/site. Include screenshots or site URL and a short explanation of the app/site.
###     Detailed description of how your app will use the Connect with PayPal (formerly Log In with PayPal) feature.
###     List of the scope attributes you’d like to enable.
###     Description of how you will use each scope attribute, how it will benefit your users, and why the scope is needed for app's functionality.

- Build the button

###  Generate a PayPal button :  method is to enter your information into our Connect with PayPal Button Builder which generates JavaScript code that you embed on your website. With this option, you can easily customize the branded Connect with PayPal button and your authorization endpoint and parameters will be dynamically generated.
 1. Configure the button using the Connect with PayPal Button Builder.
 2. Embed the generated button code on your website.
 3. (Optional) Modify the generated javascript code.

- Get authorization code
###  If the customer successfully logs in to PayPal and consents to sharing basic information, PayPal passes an authorization code to the return URL you specified.

-  Get access token
###   In this step, you exchange the authorization code for an access token to call PayPal's user profile service. The following diagram illustrates how the access token is used to receive user information.


![image](https://developer.paypal.com/img/docs/connect-with-paypal/connect-with-paypal-token-flow.png)

## Challenges
- we faced a lot of problem because paypal is a Financial website and there were many type of Requirement to have the ability to work on it such as a Real user account with a card

- documentation is not clear enough