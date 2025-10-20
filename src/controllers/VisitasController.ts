import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response, Request } from 'tsoa';
import { Types } from 'mongoose';
import { Visita } from '../models/Visita';
import { ListaVisitas } from '../models/ListaVisitas';
import { Visitante } from '../models/Visitante';
import { Morador } from '../models/Morador';
import { VisitListResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';
import { AuthenticatedRequest } from '../middleware/auth';

interface VisitaCreateRequest {
  visitante: {
    nome: string;
    cpf: string;
    tipo?: string;
    descricao?: string;
  };
  data: string;
}

interface ListaVisitasRequest {
  visitas: VisitaCreateRequest[];
}


@Route('visitas')
@Tags('Visitas')
export class VisitasController extends Controller {

  /**
   * Buscar lista de visitas por ID do morador
   */
  @Get()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Lista de visitas não encontrada')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async getVisitas(@Query() moradorId: string, @Request() request: AuthenticatedRequest): Promise<VisitListResponse> {
    try {
      // Check if resident exists
      const resident = await Morador.findById(moradorId);
      if (!resident) {
        console.log(`Get visitas error: Resident not found with ID: ${moradorId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      let listaVisitas = await ListaVisitas.findOne({
        moradorId: moradorId
      }).populate({
        path: 'visitas',
        populate: {
          path: 'visitante',
          model: 'Visitante'
        }
      });

      if (!listaVisitas) {
        // Criar lista vazia se não existir
        listaVisitas = new ListaVisitas({
          moradorId: moradorId,
          visitas: []
        });
        await listaVisitas.save();
      }

      return {
        _id: (listaVisitas._id as any).toString(),
        residentId: (listaVisitas.moradorId as any).toString(),
        visits: (listaVisitas.visitas as any[]).map((visita: any) => ({
          _id: visita._id.toString(),
          visitor: {
            _id: visita.visitante._id.toString(),
            name: visita.visitante.nome,
            cpf: visita.visitante.cpf,
            type: visita.visitante.tipo,
            description: visita.visitante.descricao,
            createdAt: visita.visitante.createdAt?.toISOString() || '',
            updatedAt: visita.visitante.updatedAt?.toISOString() || ''
          },
          date: visita.data,
          residentId: (visita.moradorId as any).toString(),
          createdAt: visita.createdAt?.toISOString() || '',
          updatedAt: visita.updatedAt?.toISOString() || ''
        })),
        createdAt: listaVisitas.createdAt?.toISOString() || '',
        updatedAt: listaVisitas.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Resident not found') {
        throw error;
      }

      console.log('Get visitas error - Internal server error:', error);
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
  @Response<ErrorResponse>(404, 'Morador não encontrado')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async createOrUpdateVisitas(
    @Query() moradorId: string,
    @Body() requestBody: ListaVisitasRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<VisitListResponse> {
    try {
      // Check if resident exists
      const resident = await Morador.findById(moradorId);
      if (!resident) {
        console.log(`Create/Update visitas error: Resident not found with ID: ${moradorId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      // Criar ou atualizar visitas
      const visitasIds: Types.ObjectId[] = [];
      for (const visitaData of requestBody.visitas) {
        // Verificar se visitante já existe pelo CPF
        let visitante = await Visitante.findOne({ cpf: visitaData.visitante.cpf });

        if (!visitante) {
          // Criar novo visitante
          visitante = new Visitante(visitaData.visitante);
          await visitante.save();
        } else {
          // Atualizar visitante existente
          visitante.nome = visitaData.visitante.nome;
          visitante.tipo = visitaData.visitante.tipo;
          visitante.descricao = visitaData.visitante.descricao;
          await visitante.save();
        }

        // Criar nova visita
        const visita = new Visita({
          visitante: visitante._id,
          data: visitaData.data,
          moradorId: moradorId
        });
        await visita.save();

        visitasIds.push(visita._id as Types.ObjectId);
      }

      // Buscar ou criar lista de visitas
      let listaVisitas = await ListaVisitas.findOne({
        moradorId: moradorId
      });

      if (!listaVisitas) {
        listaVisitas = new ListaVisitas({
          moradorId: moradorId,
          visitas: visitasIds
        });
      } else {
        // Adicionar novas visitas à lista existente
        listaVisitas.visitas = [...(listaVisitas.visitas as Types.ObjectId[]), ...visitasIds];
      }

      await listaVisitas.save();
      await listaVisitas.populate({
        path: 'visitas',
        populate: {
          path: 'visitante',
          model: 'Visitante'
        }
      });

      this.setStatus(201);
      return {
        _id: (listaVisitas._id as any).toString(),
        residentId: (listaVisitas.moradorId as any).toString(),
        visits: (listaVisitas.visitas as any[]).map((visita: any) => ({
          _id: visita._id.toString(),
          visitor: {
            _id: visita.visitante._id.toString(),
            name: visita.visitante.nome,
            cpf: visita.visitante.cpf,
            type: visita.visitante.tipo,
            description: visita.visitante.descricao,
            createdAt: visita.visitante.createdAt?.toISOString() || '',
            updatedAt: visita.visitante.updatedAt?.toISOString() || ''
          },
          date: visita.data,
          residentId: (visita.moradorId as any).toString(),
          createdAt: visita.createdAt?.toISOString() || '',
          updatedAt: visita.updatedAt?.toISOString() || ''
        })),
        createdAt: listaVisitas.createdAt?.toISOString() || '',
        updatedAt: listaVisitas.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Resident not found') {
        throw error;
      }

      console.log('Create/Update visitas error - Internal server error:', error);
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
  public async deleteVisita(
    @Query() moradorId: string,
    @Body() requestBody: { visitaId: string },
    @Request() request: AuthenticatedRequest
  ): Promise<{ message: string }> {
    try {
      // Check if resident exists
      const resident = await Morador.findById(moradorId);
      if (!resident) {
        console.log(`Delete visita error: Resident not found with ID: ${moradorId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      // Buscar visita pelo ID
      const visita = await Visita.findById(requestBody.visitaId);
      if (!visita) {
        console.log(`Delete visita error: Visit not found with ID: ${requestBody.visitaId}`);
        this.setStatus(404);
        throw new Error('Visit not found');
      }

      // Verificar se a visita pertence ao morador
      if (!(visita.moradorId as Types.ObjectId).equals(moradorId)) {
        console.log(`Delete visita error: Access denied - Visit ${requestBody.visitaId} does not belong to resident ${moradorId}`);
        this.setStatus(403);
        throw new Error('Access denied');
      }

      // Remover visita da lista
      const listaVisitas = await ListaVisitas.findOne({
        moradorId: moradorId
      });

      if (listaVisitas) {
        listaVisitas.visitas = (listaVisitas.visitas as Types.ObjectId[]).filter(
          id => !(id as Types.ObjectId).equals(visita._id as Types.ObjectId)
        );
        await listaVisitas.save();
      }

      // Deletar a visita
      await Visita.findByIdAndDelete(visita._id);

      return { message: 'Visit deleted successfully' };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Resident not found' ||
        error.message === 'Visit not found' ||
        error.message === 'Access denied'
      )) {
        throw error;
      }

      console.log('Delete visita error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }
}