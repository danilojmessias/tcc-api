import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response } from 'tsoa';
import { Types } from 'mongoose';
import { Visitante } from '../models/Visitante';
import { ListaVisitantes } from '../models/ListaVisitantes';
import { Morador } from '../models/Morador';
import { ListaVisitantesResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';

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
  @Response<ErrorResponse>(404, 'Lista de visitantes não encontrada')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async getVisitantes(@Query() moradorId: string): Promise<ListaVisitantesResponse> {
    try {
      // Verificar se o morador existe
      const morador = await Morador.findById(moradorId);
      if (!morador) {
        this.setStatus(404);
        throw new Error('Morador não encontrado');
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
        moradorId: (listaVisitantes.moradorId as any).toString(),
        registros: (listaVisitantes.registros as any[]).map((visitante: any) => ({
          _id: visitante._id.toString(),
          nome: visitante.nome,
          cpf: visitante.cpf,
          tipo: visitante.tipo,
          descricao: visitante.descricao,
          createdAt: visitante.createdAt?.toISOString() || '',
          updatedAt: visitante.updatedAt?.toISOString() || ''
        })),
        createdAt: listaVisitantes.createdAt?.toISOString() || '',
        updatedAt: listaVisitantes.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Morador não encontrado') {
        throw error;
      }
      
      this.setStatus(500);
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Inserir/atualizar lista de visitantes
   */
  @Post()
  @Response<ErrorResponse>(400, 'Dados inválidos')
  @Response<ErrorResponse>(404, 'Morador não encontrado')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async createOrUpdateVisitantes(
    @Query() moradorId: string,
    @Body() requestBody: ListaVisitantesRequest
  ): Promise<ListaVisitantesResponse> {
    try {
      // Verificar se o morador existe
      const morador = await Morador.findById(moradorId);
      if (!morador) {
        this.setStatus(404);
        throw new Error('Morador não encontrado');
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
        moradorId: (listaVisitantes.moradorId as any).toString(),
        registros: (listaVisitantes.registros as any[]).map((visitante: any) => ({
          _id: visitante._id.toString(),
          nome: visitante.nome,
          cpf: visitante.cpf,
          tipo: visitante.tipo,
          descricao: visitante.descricao,
          createdAt: visitante.createdAt?.toISOString() || '',
          updatedAt: visitante.updatedAt?.toISOString() || ''
        })),
        createdAt: listaVisitantes.createdAt?.toISOString() || '',
        updatedAt: listaVisitantes.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Morador não encontrado') {
        throw error;
      }
      
      this.setStatus(500);
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Deletar visitante da lista
   */
  @Delete()
  @Response<ErrorResponse>(404, 'Lista de visitantes não encontrada')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async deleteVisitante(
    @Query() moradorId: string,
    @Body() requestBody: { cpf: string }
  ): Promise<{ message: string }> {
    try {
      // Verificar se o morador existe
      const morador = await Morador.findById(moradorId);
      if (!morador) {
        this.setStatus(404);
        throw new Error('Morador não encontrado');
      }

      // Buscar visitante pelo CPF
      const visitante = await Visitante.findOne({ cpf: requestBody.cpf });
      if (!visitante) {
        this.setStatus(404);
        throw new Error('Visitante não encontrado');
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

      return { message: 'Visitante deletado com sucesso' };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Morador não encontrado' ||
        error.message === 'Visitante não encontrado'
      )) {
        throw error;
      }
      
      this.setStatus(500);
      throw new Error('Erro interno do servidor');
    }
  }
}