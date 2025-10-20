import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response, Request } from 'tsoa';
import { Morador } from '../models/Morador';
import { ResidentResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';
import { AuthenticatedRequest } from '../middleware/auth';

interface ResidentCreateRequest {
  name?: string;
  cpf?: string;
  phone?: string;
  email: string;
  password: string;
  block?: string;
  apartment?: string;
}


@Route('resident')
@Tags('Residents')
export class ResidentController extends Controller {

  /**
   * Get resident data by ID
   */
  @Get()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Resident not found')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async getResident(@Query() id: string, @Request() request: AuthenticatedRequest): Promise<ResidentResponse> {
    try {
      const resident = await Morador.findById(id);

      if (!resident) {
        console.log(`Get resident error: Resident not found with ID: ${id}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      return {
        _id: (resident._id as any).toString(),
        name: resident.name,
        cpf: resident.cpf,
        phone: resident.phone,
        email: resident.email,
        block: resident.block,
        apartment: resident.apartment,
        createdAt: resident.createdAt?.toISOString() || '',
        updatedAt: resident.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Resident not found') {
        throw error;
      }

      console.log('Get resident error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Create/register resident
   */
  @Post()
  @Response<ErrorResponse>(400, 'Invalid data')
  @Response<ErrorResponse>(409, 'Resident already exists')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async createResident(
    @Body() requestBody: ResidentCreateRequest
  ): Promise<ResidentResponse> {
    try {
      const { name, cpf, phone, email, password, block, apartment } = requestBody;

      // Validate required fields
      if (!email || !password) {
        console.log('Create resident error: Email and password are required');
        this.setStatus(400);
        throw new Error('Email and password are required');
      }

      // Validate password strength
      if (password.length < 6) {
        console.log('Create resident error: Password too short');
        this.setStatus(400);
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log(`Create resident error: Invalid email format: ${email}`);
        this.setStatus(400);
        throw new Error('Invalid email format');
      }

      // Check if resident already exists
      const existingResident = await Morador.findOne({ email: email.toLowerCase() });
      if (existingResident) {
        console.log(`Create resident error: Email already registered: ${email}`);
        this.setStatus(409);
        throw new Error('Email already registered');
      }

      // Check if CPF already exists (only if provided)
      if (cpf) {
        const existingCpf = await Morador.findOne({ cpf });
        if (existingCpf) {
          console.log(`Create resident error: CPF already registered: ${cpf}`);
          this.setStatus(409);
          throw new Error('CPF already registered');
        }
      }

      // Check if block/apartment already exists (only if both provided)
      if (block && apartment) {
        const existingApartment = await Morador.findOne({ block, apartment });
        if (existingApartment) {
          console.log(`Create resident error: Apartment already occupied: Block ${block}, Apartment ${apartment}`);
          this.setStatus(409);
          throw new Error('Apartment already occupied');
        }
      }

      const residentData: any = {
        email: email.toLowerCase(),
        password
      };

      // Add optional fields only if provided
      if (name) residentData.name = name;
      if (cpf) residentData.cpf = cpf;
      if (phone) residentData.phone = phone;
      if (block) residentData.block = block;
      if (apartment) residentData.apartment = apartment;

      const resident = new Morador(residentData);

      const savedResident = await resident.save();
      this.setStatus(201);
      return {
        _id: (savedResident._id as any).toString(),
        name: savedResident.name,
        cpf: savedResident.cpf,
        phone: savedResident.phone,
        email: savedResident.email,
        block: savedResident.block,
        apartment: savedResident.apartment,
        createdAt: savedResident.createdAt?.toISOString() || '',
        updatedAt: savedResident.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Email and password are required' ||
        error.message === 'Password must be at least 6 characters long' ||
        error.message === 'Invalid email format' ||
        error.message === 'Email already registered' ||
        error.message === 'CPF already registered' ||
        error.message === 'Apartment already occupied'
      )) {
        throw error;
      }

      console.log('Create resident error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Delete resident
   */
  @Delete()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Resident not found')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async deleteResident(@Query() id: string, @Request() request: AuthenticatedRequest): Promise<{ message: string }> {
    try {
      const deletedResident = await Morador.findByIdAndDelete(id);

      if (!deletedResident) {
        console.log(`Delete resident error: Resident not found with ID: ${id}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      return { message: 'Resident deleted successfully' };
    } catch (error) {
      if (error instanceof Error && error.message === 'Resident not found') {
        throw error;
      }

      console.log('Delete resident error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }
}