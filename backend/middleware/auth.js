import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; 
const auth = async (req, res, next) => {
  try {
    const userIdFromHeader = req.headers['x-user-id'];
    const token = req.headers.authorization?.split(" ")[1];
    if (!token && !userIdFromHeader) {
      return res.status(401).json({ message: "No token or user ID provided. Authentication required." });
    }
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, JWT_SECRET);
      req.userId = decodedData?.id; 
    } else if (userIdFromHeader) {
      req.userId = userIdFromHeader;
    } else {
      return res.status(401).json({ message: "Authentication failed: Invalid headers." });
    }
    next(); 
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication failed: Token expired.' });
    }
    return res.status(401).json({ message: 'Authentication failed: Invalid token or user ID.', details: error.message });
  }
};

export default auth;