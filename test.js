const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({ secretKey: 'sk_test_4iX9Q6jsjSXW2xYo5RXiigXzuTakt6emPtsdhIEp1i' });

exports.validateToken = async (req,res,next)=> {
    try {
        // Extract token from authorization header
        // Verify client using Clerk SDK
        const { isSignedIn } = await clerkClient.authenticateRequest(req);



        // Handle successful verification
    } catch (error) {
        // if (error instanceof UnauthorizedError) {
        //   return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        // } else {
        //   console.error('Error verifying client:', error);
        //   return res.status(500).json({ error: 'Internal Server Error' });
        // }
        console.log(error)
    }
}