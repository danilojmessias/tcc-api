import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response, Request } from 'tsoa';
import { Types } from 'mongoose';
import { Guest } from '../models/Guest';
import { ListaGuests } from '../models/ListaGuests';
import { Resident } from '../models/Resident';
import { GuestListResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';
import { AuthenticatedRequest } from '../middleware/auth';

interface GuestCreateRequest {
    cpf: string;
    nome: string;
    descricao?: string;
    tipo: 1 | 2; // 1 = social, 2 = serviço
}

interface ListaGuestsRequest {
    guests: GuestCreateRequest[];
}

@Route('guests')
@Tags('Guests')
export class GuestController extends Controller {

    /**
     * Buscar lista de guests por ID do resident
     */
    @Get()
    @Response<ErrorResponse>(401, 'Unauthorized')
    @Response<ErrorResponse>(404, 'Lista de guests não encontrada')
    @Response<ErrorResponse>(500, 'Erro interno do servidor')
    public async getGuests(@Query() residentId: string, @Request() request: AuthenticatedRequest): Promise<GuestListResponse> {
        try {
            // Check if resident exists
            const resident = await Resident.findById(residentId);
            if (!resident) {
                console.log(`Get guests error: Resident not found with ID: ${residentId}`);
                this.setStatus(404);
                throw new Error('Resident not found');
            }

            let listaGuests = await ListaGuests.findOne({
                residentId: residentId
            }).populate('guests');

            if (!listaGuests) {
                // Criar lista vazia se não existir
                listaGuests = new ListaGuests({
                    residentId: residentId,
                    guests: []
                });
                await listaGuests.save();
            }

            return {
                _id: (listaGuests._id as any).toString(),
                residentId: (listaGuests.residentId as any).toString(),
                guests: (listaGuests.guests as any[]).map((guest: any) => ({
                    _id: guest._id.toString(),
                    cpf: guest.cpf,
                    nome: guest.nome,
                    descricao: guest.descricao,
                    tipo: guest.tipo,
                    residentId: guest.residentId.toString(),
                    createdAt: guest.createdAt?.toISOString() || '',
                    updatedAt: guest.updatedAt?.toISOString() || ''
                })),
                createdAt: listaGuests.createdAt?.toISOString() || '',
                updatedAt: listaGuests.updatedAt?.toISOString() || ''
            };
        } catch (error) {
            if (error instanceof Error && error.message === 'Resident not found') {
                throw error;
            }

            console.log('Get guests error - Internal server error:', error);
            this.setStatus(500);
            throw new Error('Internal server error');
        }
    }

    /**
     * Inserir/atualizar lista de guests
     */
    @Post()
    @Response<ErrorResponse>(400, 'Dados inválidos')
    @Response<ErrorResponse>(401, 'Unauthorized')
    @Response<ErrorResponse>(404, 'Resident não encontrado')
    @Response<ErrorResponse>(500, 'Erro interno do servidor')
    public async createOrUpdateGuests(
        @Query() residentId: string,
        @Body() requestBody: ListaGuestsRequest,
        @Request() request: AuthenticatedRequest
    ): Promise<GuestListResponse> {
        try {
            // Check if resident exists
            const resident = await Resident.findById(residentId);
            if (!resident) {
                console.log(`Create/Update guests error: Resident not found with ID: ${residentId}`);
                this.setStatus(404);
                throw new Error('Resident not found');
            }

            // Validar tipos
            for (const guestData of requestBody.guests) {
                if (guestData.tipo !== 1 && guestData.tipo !== 2) {
                    this.setStatus(400);
                    throw new Error('Tipo deve ser 1 (social) ou 2 (serviço)');
                }
            }

            // Criar guests
            const guestsIds: Types.ObjectId[] = [];
            for (const guestData of requestBody.guests) {
                // Verificar se guest já existe pelo CPF para este resident
                let guest = await Guest.findOne({
                    cpf: guestData.cpf,
                    residentId: residentId
                });

                if (!guest) {
                    // Criar novo guest
                    guest = new Guest({
                        ...guestData,
                        residentId: residentId
                    });
                    await guest.save();
                } else {
                    // Atualizar guest existente
                    guest.nome = guestData.nome;
                    guest.tipo = guestData.tipo;
                    guest.descricao = guestData.descricao;
                    await guest.save();
                }

                guestsIds.push(guest._id as Types.ObjectId);
            }

            // Buscar ou criar lista de guests
            let listaGuests = await ListaGuests.findOne({
                residentId: residentId
            });

            if (!listaGuests) {
                listaGuests = new ListaGuests({
                    residentId: residentId,
                    guests: guestsIds
                });
            } else {
                // Adicionar novos guests à lista existente (evitar duplicatas)
                const existingIds = (listaGuests.guests as Types.ObjectId[]).map(id => id.toString());
                const newIds = guestsIds.filter(id => !existingIds.includes(id.toString()));
                listaGuests.guests = [...(listaGuests.guests as Types.ObjectId[]), ...newIds];
            }

            await listaGuests.save();
            await listaGuests.populate('guests');

            this.setStatus(201);
            return {
                _id: (listaGuests._id as any).toString(),
                residentId: (listaGuests.residentId as any).toString(),
                guests: (listaGuests.guests as any[]).map((guest: any) => ({
                    _id: guest._id.toString(),
                    cpf: guest.cpf,
                    nome: guest.nome,
                    descricao: guest.descricao,
                    tipo: guest.tipo,
                    residentId: guest.residentId.toString(),
                    createdAt: guest.createdAt?.toISOString() || '',
                    updatedAt: guest.updatedAt?.toISOString() || ''
                })),
                createdAt: listaGuests.createdAt?.toISOString() || '',
                updatedAt: listaGuests.updatedAt?.toISOString() || ''
            };
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'Resident not found' ||
                error.message === 'Tipo deve ser 1 (social) ou 2 (serviço)'
            )) {
                throw error;
            }

            console.log('Create/Update guests error - Internal server error:', error);
            this.setStatus(500);
            throw new Error('Internal server error');
        }
    }

    /**
     * Deletar guest da lista
     */
    @Delete()
    @Response<ErrorResponse>(401, 'Unauthorized')
    @Response<ErrorResponse>(404, 'Lista de guests não encontrada')
    @Response<ErrorResponse>(500, 'Erro interno do servidor')
    public async deleteGuest(
        @Query() residentId: string,
        @Body() requestBody: { guestId: string },
        @Request() request: AuthenticatedRequest
    ): Promise<{ message: string }> {
        try {
            // Check if resident exists
            const resident = await Resident.findById(residentId);
            if (!resident) {
                console.log(`Delete guest error: Resident not found with ID: ${residentId}`);
                this.setStatus(404);
                throw new Error('Resident not found');
            }

            // Buscar guest pelo ID
            const guest = await Guest.findById(requestBody.guestId);
            if (!guest) {
                console.log(`Delete guest error: Guest not found with ID: ${requestBody.guestId}`);
                this.setStatus(404);
                throw new Error('Guest not found');
            }

            // Verificar se o guest pertence ao resident
            if (!(guest.residentId as Types.ObjectId).equals(residentId)) {
                console.log(`Delete guest error: Access denied - Guest ${requestBody.guestId} does not belong to resident ${residentId}`);
                this.setStatus(403);
                throw new Error('Access denied');
            }

            // Remover guest da lista
            const listaGuests = await ListaGuests.findOne({
                residentId: residentId
            });

            if (listaGuests) {
                listaGuests.guests = (listaGuests.guests as Types.ObjectId[]).filter(
                    id => !(id as Types.ObjectId).equals(guest._id as Types.ObjectId)
                );
                await listaGuests.save();
            }

            // Deletar o guest
            await Guest.findByIdAndDelete(guest._id);

            return { message: 'Guest deleted successfully' };
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'Resident not found' ||
                error.message === 'Guest not found' ||
                error.message === 'Access denied'
            )) {
                throw error;
            }

            console.log('Delete guest error - Internal server error:', error);
            this.setStatus(500);
            throw new Error('Internal server error');
        }
    }
}