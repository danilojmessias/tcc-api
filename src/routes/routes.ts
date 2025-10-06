/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VisitasController } from './../controllers/VisitasController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VisitantesController } from './../controllers/VisitantesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MoradorController } from './../controllers/MoradorController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "VisitanteResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "nome": {"dataType":"string","required":true},
            "cpf": {"dataType":"string","required":true},
            "tipo": {"dataType":"string"},
            "descricao": {"dataType":"string"},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VisitaResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "visitante": {"ref":"VisitanteResponse","required":true},
            "data": {"dataType":"string","required":true},
            "moradorId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListaVisitasResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "moradorId": {"dataType":"string","required":true},
            "visitas": {"dataType":"array","array":{"dataType":"refObject","ref":"VisitaResponse"},"required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "error": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VisitaCreateRequest": {
        "dataType": "refObject",
        "properties": {
            "visitante": {"dataType":"nestedObjectLiteral","nestedProperties":{"descricao":{"dataType":"string"},"tipo":{"dataType":"string"},"cpf":{"dataType":"string","required":true},"nome":{"dataType":"string","required":true}},"required":true},
            "data": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListaVisitasRequest": {
        "dataType": "refObject",
        "properties": {
            "visitas": {"dataType":"array","array":{"dataType":"refObject","ref":"VisitaCreateRequest"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListaVisitantesResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "moradorId": {"dataType":"string","required":true},
            "registros": {"dataType":"array","array":{"dataType":"refObject","ref":"VisitanteResponse"},"required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VisitanteCreateRequest": {
        "dataType": "refObject",
        "properties": {
            "nome": {"dataType":"string","required":true},
            "cpf": {"dataType":"string","required":true},
            "tipo": {"dataType":"string"},
            "descricao": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListaVisitantesRequest": {
        "dataType": "refObject",
        "properties": {
            "registros": {"dataType":"array","array":{"dataType":"refObject","ref":"VisitanteCreateRequest"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MoradorResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "nome": {"dataType":"string","required":true},
            "cpf": {"dataType":"string","required":true},
            "telefone": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "bloco": {"dataType":"string","required":true},
            "apartamento": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MoradorCreateRequest": {
        "dataType": "refObject",
        "properties": {
            "nome": {"dataType":"string","required":true},
            "cpf": {"dataType":"string","required":true},
            "telefone": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "bloco": {"dataType":"string","required":true},
            "apartamento": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsVisitasController_getVisitas: Record<string, TsoaRoute.ParameterSchema> = {
                moradorId: {"in":"query","name":"moradorId","required":true,"dataType":"string"},
        };
        app.get('/visitas',
            ...(fetchMiddlewares<RequestHandler>(VisitasController)),
            ...(fetchMiddlewares<RequestHandler>(VisitasController.prototype.getVisitas)),

            async function VisitasController_getVisitas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVisitasController_getVisitas, request, response });

                const controller = new VisitasController();

              await templateService.apiHandler({
                methodName: 'getVisitas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVisitasController_createOrUpdateVisitas: Record<string, TsoaRoute.ParameterSchema> = {
                moradorId: {"in":"query","name":"moradorId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ListaVisitasRequest"},
        };
        app.post('/visitas',
            ...(fetchMiddlewares<RequestHandler>(VisitasController)),
            ...(fetchMiddlewares<RequestHandler>(VisitasController.prototype.createOrUpdateVisitas)),

            async function VisitasController_createOrUpdateVisitas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVisitasController_createOrUpdateVisitas, request, response });

                const controller = new VisitasController();

              await templateService.apiHandler({
                methodName: 'createOrUpdateVisitas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVisitasController_deleteVisita: Record<string, TsoaRoute.ParameterSchema> = {
                moradorId: {"in":"query","name":"moradorId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"visitaId":{"dataType":"string","required":true}}},
        };
        app.delete('/visitas',
            ...(fetchMiddlewares<RequestHandler>(VisitasController)),
            ...(fetchMiddlewares<RequestHandler>(VisitasController.prototype.deleteVisita)),

            async function VisitasController_deleteVisita(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVisitasController_deleteVisita, request, response });

                const controller = new VisitasController();

              await templateService.apiHandler({
                methodName: 'deleteVisita',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVisitantesController_getVisitantes: Record<string, TsoaRoute.ParameterSchema> = {
                moradorId: {"in":"query","name":"moradorId","required":true,"dataType":"string"},
        };
        app.get('/visitantes',
            ...(fetchMiddlewares<RequestHandler>(VisitantesController)),
            ...(fetchMiddlewares<RequestHandler>(VisitantesController.prototype.getVisitantes)),

            async function VisitantesController_getVisitantes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVisitantesController_getVisitantes, request, response });

                const controller = new VisitantesController();

              await templateService.apiHandler({
                methodName: 'getVisitantes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVisitantesController_createOrUpdateVisitantes: Record<string, TsoaRoute.ParameterSchema> = {
                moradorId: {"in":"query","name":"moradorId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ListaVisitantesRequest"},
        };
        app.post('/visitantes',
            ...(fetchMiddlewares<RequestHandler>(VisitantesController)),
            ...(fetchMiddlewares<RequestHandler>(VisitantesController.prototype.createOrUpdateVisitantes)),

            async function VisitantesController_createOrUpdateVisitantes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVisitantesController_createOrUpdateVisitantes, request, response });

                const controller = new VisitantesController();

              await templateService.apiHandler({
                methodName: 'createOrUpdateVisitantes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVisitantesController_deleteVisitante: Record<string, TsoaRoute.ParameterSchema> = {
                moradorId: {"in":"query","name":"moradorId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"cpf":{"dataType":"string","required":true}}},
        };
        app.delete('/visitantes',
            ...(fetchMiddlewares<RequestHandler>(VisitantesController)),
            ...(fetchMiddlewares<RequestHandler>(VisitantesController.prototype.deleteVisitante)),

            async function VisitantesController_deleteVisitante(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVisitantesController_deleteVisitante, request, response });

                const controller = new VisitantesController();

              await templateService.apiHandler({
                methodName: 'deleteVisitante',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMoradorController_getMorador: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"query","name":"id","required":true,"dataType":"string"},
        };
        app.get('/morador',
            ...(fetchMiddlewares<RequestHandler>(MoradorController)),
            ...(fetchMiddlewares<RequestHandler>(MoradorController.prototype.getMorador)),

            async function MoradorController_getMorador(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMoradorController_getMorador, request, response });

                const controller = new MoradorController();

              await templateService.apiHandler({
                methodName: 'getMorador',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMoradorController_createMorador: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"MoradorCreateRequest"},
        };
        app.post('/morador',
            ...(fetchMiddlewares<RequestHandler>(MoradorController)),
            ...(fetchMiddlewares<RequestHandler>(MoradorController.prototype.createMorador)),

            async function MoradorController_createMorador(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMoradorController_createMorador, request, response });

                const controller = new MoradorController();

              await templateService.apiHandler({
                methodName: 'createMorador',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMoradorController_deleteMorador: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"query","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/morador',
            ...(fetchMiddlewares<RequestHandler>(MoradorController)),
            ...(fetchMiddlewares<RequestHandler>(MoradorController.prototype.deleteMorador)),

            async function MoradorController_deleteMorador(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMoradorController_deleteMorador, request, response });

                const controller = new MoradorController();

              await templateService.apiHandler({
                methodName: 'deleteMorador',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
