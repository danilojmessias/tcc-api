import { Controller, Get, Post, Delete, Route, Query, Body, Tags, Response } from 'tsoa';
import { Morador } from '../models/Morador';
import { MoradorResponse } from '../interfaces/responses';
import { ErrorResponse } from '../interfaces/common';

interface MoradorCreateRequest {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  bloco: string;
  apartamento: string;
}


@Route('morador')
@Tags('Moradores')
export class MoradorController extends Controller {

  /**
   * Buscar dados do morador por ID
   */
  @Get()
  @Response<ErrorResponse>(404, 'Morador não encontrado')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async getMorador(@Query() id: string): Promise<MoradorResponse> {
    try {
      const morador = await Morador.findById(id);
      
      if (!morador) {
        this.setStatus(404);
        throw new Error('Morador não encontrado');
      }

      return {
        _id: (morador._id as any).toString(),
        nome: morador.nome,
        cpf: morador.cpf,
        telefone: morador.telefone,
        email: morador.email,
        bloco: morador.bloco,
        apartamento: morador.apartamento,
        createdAt: morador.createdAt?.toISOString() || '',
        updatedAt: morador.updatedAt?.toISOString() || ''
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
   * Inserir/cadastrar morador
   */
  @Post()
  @Response<ErrorResponse>(400, 'Dados inválidos')
  @Response<ErrorResponse>(409, 'Morador já existe')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async createMorador(
    @Body() requestBody: MoradorCreateRequest
  ): Promise<MoradorResponse> {
    try {
      // Verificar se o morador já existe
      const existingMorador = await Morador.findOne({ email: requestBody.email.toLowerCase() });
      
      if (existingMorador) {
        this.setStatus(409);
        throw new Error('Morador já existe');
      }

      // Verificar se CPF já existe
      const existingCpf = await Morador.findOne({ cpf: requestBody.cpf });
      if (existingCpf) {
        this.setStatus(409);
        throw new Error('CPF já cadastrado');
      }

      // Verificar se bloco/apartamento já existe
      const existingApartamento = await Morador.findOne({
        bloco: requestBody.bloco,
        apartamento: requestBody.apartamento
      });
      if (existingApartamento) {
        this.setStatus(409);
        throw new Error('Apartamento já ocupado');
      }

      const morador = new Morador({
        ...requestBody,
        email: requestBody.email.toLowerCase()
      });

      const savedMorador = await morador.save();
      this.setStatus(201);
      return {
        _id: (savedMorador._id as any).toString(),
        nome: savedMorador.nome,
        cpf: savedMorador.cpf,
        telefone: savedMorador.telefone,
        email: savedMorador.email,
        bloco: savedMorador.bloco,
        apartamento: savedMorador.apartamento,
        createdAt: savedMorador.createdAt?.toISOString() || '',
        updatedAt: savedMorador.updatedAt?.toISOString() || ''
      };
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Morador já existe' ||
        error.message === 'CPF já cadastrado' ||
        error.message === 'Apartamento já ocupado'
      )) {
        throw error;
      }
      
      this.setStatus(500);
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Deletar morador
   */
  @Delete()
  @Response<ErrorResponse>(404, 'Morador não encontrado')
  @Response<ErrorResponse>(500, 'Erro interno do servidor')
  public async deleteMorador(@Query() id: string): Promise<{ message: string }> {
    try {
      const deletedMorador = await Morador.findByIdAndDelete(id);
      
      if (!deletedMorador) {
        this.setStatus(404);
        throw new Error('Morador não encontrado');
      }

      return { message: 'Morador deletado com sucesso' };
    } catch (error) {
      if (error instanceof Error && error.message === 'Morador não encontrado') {
        throw error;
      }
      
      this.setStatus(500);
      throw new Error('Erro interno do servidor');
    }
  }
}