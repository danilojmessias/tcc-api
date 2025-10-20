import { Controller, Get, Post, Route, Body, Tags, Response, Request } from 'tsoa';
import { Morador } from '../models/Morador';
import { ErrorResponse } from '../interfaces/common';
import { generateToken, addToBlacklist, AuthenticatedRequest, JWTPayload, tokenBlacklist } from '../middleware/auth';
import jwt from 'jsonwebtoken';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  resident: {
    _id: string;
    email: string;
  };
  token: string;
}

interface LogoutResponse {
  message: string;
}

interface TokenValidationResponse {
  valid: boolean;
  resident?: {
    _id: string;
    email: string;
  };
  message?: string;
}

interface UserListResponse {
  users: {
    _id: string;
    email: string;
    name?: string;
    cpf?: string;
    phone?: string;
    block?: string;
    apartment?: string;
    createdAt: string;
  }[];
  total: number;
}

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {

  /**
   * Resident login
   */
  @Post('login')
  @Response<ErrorResponse>(400, 'Invalid data')
  @Response<ErrorResponse>(401, 'Invalid credentials')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async login(@Body() requestBody: LoginRequest): Promise<AuthResponse> {
    try {
      const { email, password } = requestBody;

      // Validate required fields
      if (!email || !password) {
        console.log('Login error: Email and password are required');
        this.setStatus(400);
        throw new Error('Email and password are required');
      }

      // Find resident by email
      const resident = await Morador.findOne({ email: email.toLowerCase() }).select('+password');

      if (!resident) {
        console.log(`Login error: No resident found with email: ${email}`);
        this.setStatus(401);
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await resident.comparePassword(password);
      if (!isPasswordValid) {
        console.log(`Login error: Invalid password for email: ${email}`);
        this.setStatus(401);
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = generateToken((resident._id as any).toString(), resident.email);

      return {
        resident: {
          _id: (resident._id as any).toString(),
          email: resident.email
        },
        token
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Email and password are required' ||
        error.message === 'Invalid credentials'
      )) {
        throw error;
      }

      console.log('Login error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Register new resident
   */
  @Post('register')
  @Response<ErrorResponse>(400, 'Invalid data')
  @Response<ErrorResponse>(409, 'Resident already exists')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async register(@Body() requestBody: RegisterRequest): Promise<AuthResponse> {
    try {
      const { email, password } = requestBody;

      // Validate required fields
      if (!email || !password) {
        console.log('Register error: Email and password are required');
        this.setStatus(400);
        throw new Error('Email and password are required');
      }

      // Validate password strength
      if (password.length < 6) {
        console.log('Register error: Password too short');
        this.setStatus(400);
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log(`Register error: Invalid email format: ${email}`);
        this.setStatus(400);
        throw new Error('Invalid email format');
      }

      // Check if resident already exists
      const existingResident = await Morador.findOne({ email: email.toLowerCase() });
      if (existingResident) {
        console.log(`Register error: Email already registered: ${email}`);
        this.setStatus(409);
        throw new Error('Email already registered');
      }

      // Create new resident
      const resident = new Morador({
        email: email.toLowerCase(),
        password
      });

      const savedResident = await resident.save();

      // Generate JWT token
      const token = generateToken((savedResident._id as any).toString(), savedResident.email);

      this.setStatus(201);
      return {
        resident: {
          _id: (savedResident._id as any).toString(),
          email: savedResident.email
        },
        token
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Email and password are required' ||
        error.message === 'Password must be at least 6 characters long' ||
        error.message === 'Invalid email format' ||
        error.message === 'Email already registered'
      )) {
        throw error;
      }

      console.log('Register error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * List all users created for login
   */
  @Get('users')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async listUsers(@Request() request: AuthenticatedRequest): Promise<UserListResponse> {
    try {
      // Find all residents and exclude password from response
      const residents = await Morador.find({}).select('-password').sort({ createdAt: -1 });

      const users = residents.map(resident => ({
        _id: (resident._id as any).toString(),
        email: resident.email,
        name: resident.name,
        cpf: resident.cpf,
        phone: resident.phone,
        block: resident.block,
        apartment: resident.apartment,
        createdAt: resident.createdAt?.toISOString() || new Date().toISOString()
      }));

      return {
        users,
        total: users.length
      };
    } catch (error) {
      console.log('List users error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Logout user and invalidate token
   */
  @Post('logout')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async logout(@Request() request: AuthenticatedRequest): Promise<LogoutResponse> {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        console.log('Logout error: Access token required');
        this.setStatus(401);
        throw new Error('Access token required');
      }

      // Add token to blacklist
      addToBlacklist(token);

      return {
        message: 'Successfully logged out'
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Access token required') {
        throw error;
      }

      console.log('Logout error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Verify token validity for automatic login
   */
  @Post('verify-token')
  @Response<ErrorResponse>(401, 'Invalid or expired token')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async verifyToken(@Request() request: any): Promise<TokenValidationResponse> {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return {
          valid: false,
          message: 'No token provided'
        };
      }

      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        return {
          valid: false,
          message: 'Token has been invalidated'
        };
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.log('Verify token error: JWT secret not configured');
        this.setStatus(500);
        throw new Error('JWT secret not configured');
      }

      try {
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        // Verify user still exists
        const user = await Morador.findById(decoded.userId);
        if (!user) {
          return {
            valid: false,
            message: 'User not found'
          };
        }

        return {
          valid: true,
          resident: {
            _id: decoded.userId,
            email: decoded.email
          }
        };
      } catch (jwtError) {
        if (jwtError instanceof jwt.JsonWebTokenError) {
          return {
            valid: false,
            message: 'Invalid or expired token'
          };
        }
        throw jwtError;
      }
    } catch (error) {
      console.log('Verify token error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }
}