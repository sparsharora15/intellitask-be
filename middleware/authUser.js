const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const UserModel = require('../models/userModel');


const validateToken = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    // Create a JWKS client to fetch keys from your JWKS endpoint
    const client = jwksClient({
        jwksUri: process.env.JWKS_KEY_URL
    });

    // Function to retrieve a signing key based on the JWT's header
    function getKey(header, callback) {
        client.getSigningKey(header.kid, (err, key) => {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    }
    try {
        // Verify JWT token using the retrieved public key from JWKS
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err);
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                const user = await UserModel.findOne({ userId: decoded.id })
                req.userId = user._id; // Attach decoded payload to request object
                next();
            }
        });
    } catch(err) {
        console.log(err)
    }
};
module.exports = { validateToken };
