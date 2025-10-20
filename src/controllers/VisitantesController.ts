import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response, Request } from 'tsoa';
import { Types } from 'mongoose';
import { Visitante } from '../models/Visitante';
import { ListaVisitantes } from '../models/ListaVisitantes';
import { Morador } from '../models/Morador';
import { VisitorListResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';
import { AuthenticatedRequest } from '../middleware/auth';

interface VisitanteCreateRequest {
  nome: string;
  cpf: string;
  tipo?: string;
  descricao?: string;
}

interface ListaVisitantesRequest {
  registros: VisitanteCreateRequest[];
}


@Route('visitantes')
@Tags('Visitantes')
export class VisitantesController extends Controller {

  /**
   * Buscar lista de visitantes por ID do morador
   */
  @Get()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Lista de visitantes não encontrada')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async getVisitantes(@Query() moradorId: string, @Request() request: AuthenticatedRequest): Promise<VisitorListResponse> {
    try {
      // Check if resident exists
      const resident = await Morador.findById(moradorId);
      if (!resident) {
        console.log(`Get visitantes error: Resident not found with ID: ${moradorId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      let listaVisitantes = await ListaVisitantes.findOne({
        moradorId: moradorId
      }).populate('registros');

      if (!listaVisitantes) {
        // Criar lista vazia se não existir
        listaVisitantes = new ListaVisitantes({
          moradorId: moradorId,
          registros: []
        });
        await listaVisitantes.save();
      }

      return {
        _id: (listaVisitantes._id as any).toString(),
        residentId: (listaVisitantes.moradorId as any).toString(),
        records: (listaVisitantes.registros as any[]).map((visitante: any) => ({
          _id: visitante._id.toString(),
          name: visitante.nome,
          cpf: visitante.cpf,
          type: visitante.tipo,
          description: visitante.descricao,
          createdAt: visitante.createdAt?.toISOString() || '',
          updatedAt: visitante.updatedAt?.toISOString() || ''
        })),
        createdAt: listaVisitantes.createdAt?.toISOString() || '',
        updatedAt: listaVisitantes.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Resident not found') {
        throw error;
      }

      console.log('Get visitantes error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Inserir/atualizar lista de visitantes
   */
  @Post()
  @Response<ErrorResponse>(400, 'Dados inválidos')
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Morador não encontrado')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async createOrUpdateVisitantes(
    @Query() moradorId: string,
    @Body() requestBody: ListaVisitantesRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<VisitorListResponse> {
    try {
      // Check if resident exists
      const resident = await Morador.findById(moradorId);
      if (!resident) {
        console.log(`Create/Update visitantes error: Resident not found with ID: ${moradorId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      // Criar ou atualizar visitantes
      const visitantesIds: Types.ObjectId[] = [];
      for (const visitanteData of requestBody.registros) {
        // Verificar se visitante já existe pelo CPF
        let visitante = await Visitante.findOne({ cpf: visitanteData.cpf });

        if (!visitante) {
          // Criar novo visitante
          visitante = new Visitante(visitanteData);
          await visitante.save();
        } else {
          // Atualizar visitante existente
          visitante.nome = visitanteData.nome;
          visitante.tipo = visitanteData.tipo;
          visitante.descricao = visitanteData.descricao;
          await visitante.save();
        }

        visitantesIds.push(visitante._id as Types.ObjectId);
      }

      // Buscar ou criar lista de visitantes
      let listaVisitantes = await ListaVisitantes.findOne({
        moradorId: moradorId
      });

      if (!listaVisitantes) {
        listaVisitantes = new ListaVisitantes({
          moradorId: moradorId,
          registros: visitantesIds
        });
      } else {
        listaVisitantes.registros = visitantesIds;
      }

      await listaVisitantes.save();
      await listaVisitantes.populate('registros');

      this.setStatus(201);
      return {
        _id: (listaVisitantes._id as any).toString(),
        residentId: (listaVisitantes.moradorId as any).toString(),
        records: (listaVisitantes.registros as any[]).map((visitante: any) => ({
          _id: visitante._id.toString(),
          name: visitante.nome,
          cpf: visitante.cpf,
          type: visitante.tipo,
          description: visitante.descricao,
          createdAt: visitante.createdAt?.toISOString() || '',
          updatedAt: visitante.updatedAt?.toISOString() || ''
        })),
        createdAt: listaVisitantes.createdAt?.toISOString() || '',
        updatedAt: listaVisitantes.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Resident not found') {
        throw error;
      }

      console.log('Create/Update visitantes error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }

  /**
   * Deletar visitante da lista
   */
  @Delete()
  @Response<ErrorResponse>(401, 'Unauthorized')
  @Response<ErrorResponse>(404, 'Lista de visitantes não encontrada')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async deleteVisitante(
    @Query() moradorId: string,
    @Body() requestBody: { cpf: string },
    @Request() request: AuthenticatedRequest
  ): Promise<{ message: string }> {
    try {
      // Check if resident exists
      const resident = await Morador.findById(moradorId);
      if (!resident) {
        console.log(`Delete visitante error: Resident not found with ID: ${moradorId}`);
        this.setStatus(404);
        throw new Error('Resident not found');
      }

      // Buscar visitante pelo CPF
      const visitante = await Visitante.findOne({ cpf: requestBody.cpf });
      if (!visitante) {
        console.log(`Delete visitante error: Visitor not found with CPF: ${requestBody.cpf}`);
        this.setStatus(404);
        throw new Error('Visitor not found');
      }

      // Remover visitante da lista
      const listaVisitantes = await ListaVisitantes.findOne({
        moradorId: moradorId
      });

      if (listaVisitantes) {
        listaVisitantes.registros = (listaVisitantes.registros as Types.ObjectId[]).filter(
          id => !(id as Types.ObjectId).equals(visitante._id as Types.ObjectId)
        );
        await listaVisitantes.save();
      }

      // Deletar o visitante
      await Visitante.findByIdAndDelete(visitante._id);

      return { message: 'Visitor deleted successfully' };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Resident not found' ||
        error.message === 'Visitor not found'
      )) {
        throw error;
      }

      console.log('Delete visitante error - Internal server error:', error);
      this.setStatus(500);
      throw new Error('Internal server error');
    }
  }
}