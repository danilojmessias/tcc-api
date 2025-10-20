import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Morador } from '../models/Morador';

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        email: string;
    };
}

export interface JWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

// Blacklist for storing invalidated tokens (in production, use Redis or database)
export const tokenBlacklist = new Set<string>();

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            console.log('Auth middleware error: Access token required');
            res.status(401).json({ message: 'Access token required' });
            return;
        }

        // Check if token is blacklisted
        if (tokenBlacklist.has(token)) {
            console.log('Auth middleware error: Token has been invalidated');
            res.status(401).json({ message: 'Token has been invalidated' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.log('Auth middleware error: JWT secret not configured');
            res.status(500).json({ message: 'JWT secret not configured' });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Verify user still exists
        const user = await Morador.findById(decoded.userId);
        if (!user) {
            console.log(`Auth middleware error: User not found with ID: ${decoded.userId}`);
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = {
            _id: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.log('Auth middleware error: Invalid token -', error.message);
            res.status(401).json({ message: 'Invalid token' });
            return;
        }

        console.log('Auth middleware error - Internal server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addToBlacklist = (token: string): void => {
    tokenBlacklist.add(token);
};

export const generateToken = (userId: string, email: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.log('Generate token error: JWT secret not configured');
        throw new Error('JWT secret not configured');
    }

    return jwt.sign(
        { userId, email },
        jwtSecret,
        { expiresIn: '24h' }
    );
};