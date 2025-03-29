import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Retrieve the token from the Authorization header (assumed format: "Bearer <token>")
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {            

        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        // Attach the decoded user data to the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    });
};

export default authMiddleware;
