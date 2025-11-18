import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response, Request } from 'tsoa';
import { Types } from 'mongoose';
import { Visit } from '../models/Visit';
import { ListaVisits } from '../models/ListaVisits';
import { Guest } from '../models/Guest';
import { Resident } from '../models';
import { VisitListResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';
import { AuthenticatedRequest } from '../middleware/auth';

interface VisitCreateRequest {
    guestId: string;
    date: string;
}

interface ListaVisitsRequest {
    visits: VisitCreateRequest[];
}

@Route('visits')
@Tags('Visits')
export class VisitsController extends Controller {

    /**
     * Buscar lista de visitas por ID do resident
     */
    @Get()
    @Response<ErrorResponse>(401, 'Unauthorized')
    @Response<ErrorResponse>(404, 'Lista de visitas não encontrada')
    @Response<ErrorResponse>(500, 'Erro interno do servidor')
    public async getVisits(@Query() residentId: string, @Request() request: AuthenticatedRequest): Promise<VisitListResponse> {
        try {
            // Check if resident exists
            const resident = await Resident.findById(residentId);
            if (!resident) {
                console.log(`Get visits error: Resident not found with ID: ${residentId}`);
                this.setStatus(404);
                throw new Error('Resident not found');
            }

            let listaVisits = await ListaVisits.findOne({
                residentId: residentId
            }).populate({
                path: 'visits',
                populate: {
                    path: 'guest',
                    model: 'Guest'
                }
            });

            if (!listaVisits) {
                // Criar lista vazia se não existir
                listaVisits = new ListaVisits({
                    residentId: residentId,
                    visits: []
                });
                await listaVisits.save();
            }

            return {
                _id: (listaVisits._id as any).toString(),
                residentId: (listaVisits.residentId as any).toString(),
                visits: (listaVisits.visits as any[]).map((visit: any) => ({
                    _id: visit._id.toString(),
                    visitor: {
                        _id: visit.guest._id.toString(),
                        name: visit.guest.nome,
                        cpf: visit.guest.cpf,
                        type: visit.guest.tipo,
                        description: visit.guest.descricao,
                        createdAt: visit.guest.createdAt?.toISOString() || '',
                        updatedAt: visit.guest.updatedAt?.toISOString() || ''
                    },
                    date: visit.date,
                    residentId: (visit.residentId as any).toString(),
                    createdAt: visit.createdAt?.toISOString() || '',
                    updatedAt: visit.updatedAt?.toISOString() || ''
                })),
                createdAt: listaVisits.createdAt?.toISOString() || '',
                updatedAt: listaVisits.updatedAt?.toISOString() || ''
            };
        } catch (error) {
            if (error instanceof Error && error.message === 'Resident not found') {
                throw error;
            }

            console.log('Get visits error - Internal server error:', error);
            this.setStatus(500);
            throw new Error('Internal server error');
        }
    }

    /**
     * Inserir/atualizar lista de visitas
     */
    @Post()
    @Response<ErrorResponse>(400, 'Dados inválidos')
    @Response<ErrorResponse>(401, 'Unauthorized')
    @Response<ErrorResponse>(404, 'Resident não encontrado')
    @Response<ErrorResponse>(500, 'Erro interno do servidor')
    public async createOrUpdateVisits(
        @Query() residentId: string,
        @Body() requestBody: ListaVisitsRequest,
        @Request() request: AuthenticatedRequest
    ): Promise<VisitListResponse> {
        try {
            // Check if resident exists
            const resident = await Resident.findById(residentId);
            if (!resident) {
                console.log(`Create/Update visits error: Resident not found with ID: ${residentId}`);
                this.setStatus(404);
                throw new Error('Resident not found');
            }

            // Criar visitas
            const visitsIds: Types.ObjectId[] = [];
            for (const visitData of requestBody.visits) {
                // Verificar se guest existe
                const guest = await Guest.findById(visitData.guestId);
                if (!guest) {
                    console.log(`Create/Update visits error: Guest not found with ID: ${visitData.guestId}`);
                    this.setStatus(404);
                    throw new Error('Guest not found');
                }

                // Verificar se o guest pertence ao resident
                if (!(guest.residentId as Types.ObjectId).equals(residentId)) {
                    console.log(`Create/Update visits error: Guest ${visitData.guestId} does not belong to resident ${residentId}`);
                    this.setStatus(403);
                    throw new Error('Access denied - Guest does not belong to resident');
                }

                // Criar nova visita
                const visit = new Visit({
                    guest: guest._id,
                    date: visitData.date,
                    residentId: residentId
                });
                await visit.save();

                visitsIds.push(visit._id as Types.ObjectId);
            }

            // Buscar ou criar lista de visitas
            let listaVisits = await ListaVisits.findOne({
                residentId: residentId
            });

            if (!listaVisits) {
                listaVisits = new ListaVisits({
                    residentId: residentId,
                    visits: visitsIds
                });
            } else {
                // Adicionar novas visitas à lista existente
                listaVisits.visits = [...(listaVisits.visits as Types.ObjectId[]), ...visitsIds];
            }

            await listaVisits.save();
            await listaVisits.populate({
                path: 'visits',
                populate: {
                    path: 'guest',
                    model: 'Guest'
                }
            });

            this.setStatus(201);
            return {
                _id: (listaVisits._id as any).toString(),
                residentId: (listaVisits.residentId as any).toString(),
                visits: (listaVisits.visits as any[]).map((visit: any) => ({
                    _id: visit._id.toString(),
                    visitor: {
                        _id: visit.guest._id.toString(),
                        name: visit.guest.nome,
                        cpf: visit.guest.cpf,
                        type: visit.guest.tipo,
                        description: visit.guest.descricao,
                        createdAt: visit.guest.createdAt?.toISOString() || '',
                        updatedAt: visit.guest.updatedAt?.toISOString() || ''
                    },
                    date: visit.date,
                    residentId: (visit.residentId as any).toString(),
                    createdAt: visit.createdAt?.toISOString() || '',
                    updatedAt: visit.updatedAt?.toISOString() || ''
                })),
                createdAt: listaVisits.createdAt?.toISOString() || '',
                updatedAt: listaVisits.updatedAt?.toISOString() || ''
            };
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'Resident not found' ||
                error.message === 'Guest not found' ||
                error.message === 'Access denied - Guest does not belong to resident'
            )) {
                throw error;
            }

            console.log('Create/Update visits error - Internal server error:', error);
            this.setStatus(500);
            throw new Error('Internal server error');
        }
    }

    /**
     * Deletar visita da lista
     */
    @Delete()
    @Response<ErrorResponse>(401, 'Unauthorized')
    @Response<ErrorResponse>(404, 'Lista de visitas não encontrada')
    @Response<ErrorResponse>(500, 'Erro interno do servidor')
    public async deleteVisit(
        @Query() residentId: string,
        @Body() requestBody: { visitId: string },
        @Request() request: AuthenticatedRequest
    ): Promise<{ message: string }> {
        try {
            // Check if resident exists
            const resident = await Resident.findById(residentId);
            if (!resident) {
                console.log(`Delete visit error: Resident not found with ID: ${residentId}`);
                this.setStatus(404);
                throw new Error('Resident not found');
            }

            // Buscar visita pelo ID
            const visit = await Visit.findById(requestBody.visitId);
            if (!visit) {
                console.log(`Delete visit error: Visit not found with ID: ${requestBody.visitId}`);
                this.setStatus(404);
                throw new Error('Visit not found');
            }

            // Verificar se a visita pertence ao resident
            if (!(visit.residentId as Types.ObjectId).equals(residentId)) {
                console.log(`Delete visit error: Access denied - Visit ${requestBody.visitId} does not belong to resident ${residentId}`);
                this.setStatus(403);
                throw new Error('Access denied');
            }

            // Remover visita da lista
            const listaVisits = await ListaVisits.findOne({
                residentId: residentId
            });

            if (listaVisits) {
                listaVisits.visits = (listaVisits.visits as Types.ObjectId[]).filter(
                    id => !(id as Types.ObjectId).equals(visit._id as Types.ObjectId)
                );
                await listaVisits.save();
            }

            // Deletar a visita
            await Visit.findByIdAndDelete(visit._id);

            return { message: 'Visit deleted successfully' };
        } catch (error) {
            if (error instanceof Error && (
                error.message === 'Resident not found' ||
                error.message === 'Visit not found' ||
                error.message === 'Access denied'
            )) {
                throw error;
            }

            console.log('Delete visit error - Internal server error:', error);
            this.setStatus(500);
            throw new Error('Internal server error');
        }
    }
}