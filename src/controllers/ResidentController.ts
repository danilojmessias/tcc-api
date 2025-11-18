import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response, Request } from 'tsoa';
import { Resident } from '../models';
import { ResidentResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';
import { AuthenticatedRequest } from '../middleware/auth';

interface ResidentCreateRequest {
  name?: string;
  cpf?: string;
  phone?: string;
  block?: string;
  apartment?: string | number;
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
      const resident = await Resident.findById(id);

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
   * Update resident profile information
   */
  @Post()
  @Response<ErrorResponse>(400, 'Invalid data')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Resident not found')
  @Response<ErrorResponse>(409, 'Data conflict')
  @Response<ErrorResponse>(500, 'Internal server error')
  public async createResident(
    @Body() requestBody: ResidentCreateRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<ResidentResponse> {
    try {
      const { name, cpf, phone, block, apartment } = requestBody;

      // Get user ID from authenticated request
      const userId = request.user?._id;
      if (!userId) {
        console.log('Update resident error: User not authenticated');
        this.setStatus(401);
        throw new Error('User not authenticated');
      }

      // Find existing resident by user ID
      const existingResident = await Resident.findById(userId);
      if (!existingResident) {
        console.log(`Update resident error: Resident not found with ID: ${userId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      // Check if CPF already exists (only if provided and different from current)
      if (cpf && cpf !== existingResident.cpf) {
        const existingCpf = await Resident.findOne({ cpf, _id: { $ne: existingResident._id } });
        if (existingCpf) {
          console.log(`Update resident error: CPF already registered by another resident: ${cpf}`);
          this.setStatus(409);
          throw new Error('CPF already registered by another resident');
        }
      }

      // Check if block/apartment already exists (only if both provided and different from current)
      if (block && apartment) {
        const currentBlockApt = existingResident.block === block && existingResident.apartment === apartment;
        if (!currentBlockApt) {
          const existingApartment = await Resident.findOne({
            block,
            apartment,
            _id: { $ne: existingResident._id }
          });
          if (existingApartment) {
            console.log(`Update resident error: Apartment already occupied by another resident: Block ${block}, Apartment ${apartment}`);
            this.setStatus(409);
            throw new Error('Apartment already occupied by another resident');
          }
        }
      }

      // Update fields only if provided
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (cpf !== undefined) updateData.cpf = cpf;
      if (phone !== undefined) updateData.phone = phone;
      if (block !== undefined) updateData.block = block;
      if (apartment !== undefined) updateData.apartment = apartment;

      const updatedResident = await Resident.findByIdAndUpdate(
        existingResident._id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedResident) {
        console.log('Update resident error: Failed to update resident');
        this.setStatus(500);
        throw new Error('Failed to update resident');
      }

      this.setStatus(200);
      return {
        _id: (updatedResident._id as any).toString(),
        name: updatedResident.name,
        cpf: updatedResident.cpf,
        phone: updatedResident.phone,
        block: updatedResident.block,
        apartment: updatedResident.apartment,
        createdAt: updatedResident.createdAt?.toISOString() || '',
        updatedAt: updatedResident.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'User not authenticated' ||
        error.message === 'Resident not found' ||
        error.message === 'CPF already registered by another resident' ||
        error.message === 'Apartment already occupied by another resident' ||
        error.message === 'Failed to update resident'
      )) {
        throw error;
      }

      console.log('Update resident error - Internal server error:', error);
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
      const deletedResident = await Resident.findByIdAndDelete(id);

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