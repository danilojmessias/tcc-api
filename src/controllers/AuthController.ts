import { Controller, Get, Post, Route, Body, Tags, Response, Request } from 'tsoa';
import { Resident } from '../models';
import { ErrorResponse } from '../interfaces/common';
import { generateToken, addToBlacklist, AuthenticatedRequest, JWTPayload, tokenBlacklist } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  id: string;
  email: string;
  token: string;
}

interface LogoutResponse {
  message: string;
}

interface TokenValidationResponse {
  valid: boolean;
  id?: string;
  email?: string;
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

      // Validate input
      if (!email || !password) {
        console.log('Login error: Email and password are required');
        this.setStatus(400);
        throw new Error('Email and password are required');
      }

      // Find resident by email
      const resident = await Resident.findOne({ email: email.toLowerCase() });
      if (!resident) {
        console.log('Login error: Invalid credentials - resident not found');
        this.setStatus(401);
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, resident.password);
      if (!isPasswordValid) {
        console.log('Login error: Invalid credentials - password mismatch');
        this.setStatus(401);
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = generateToken((resident._id as any).toString(), resident.email);

      return {
        id: (resident._id as any).toString(),
        email: resident.email,
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

      // Validate input
      if (!email || !password) {
        console.log('Register error: Email and password are required');
        this.setStatus(400);
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        console.log('Register error: Password must be at least 6 characters');
        this.setStatus(400);
        throw new Error('Password must be at least 6 characters');
      }

      // Check if resident already exists
      const existingResident = await Resident.findOne({ email: email.toLowerCase() });
      if (existingResident) {
        console.log('Register error: Resident already exists with this email');
        this.setStatus(409);
        throw new Error('Resident already exists with this email');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new resident
      const newResident = new Resident({
        email: email.toLowerCase(),
        password: hashedPassword
      });

      const savedResident = await newResident.save();

      // Generate token
      const token = generateToken((savedResident._id as any).toString(), savedResident.email);

      return {
        id: (savedResident._id as any).toString(),
        email: savedResident.email,
        token
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Email and password are required' ||
        error.message === 'Password must be at least 6 characters' ||
        error.message === 'Resident already exists with this email'
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
      // Find all residents
      const residents = await Resident.find({}).sort({ createdAt: -1 });

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
        const user = await Resident.findById(decoded.userId);
        if (!user) {
          return {
            valid: false,
            message: 'User not found'
          };
        }

        return {
          valid: true,
          id: decoded.userId,
          email: decoded.email
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