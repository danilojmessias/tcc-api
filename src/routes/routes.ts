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
import { ResidentController } from './../controllers/MoradorController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/AuthController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "VisitorResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "cpf": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "description": {"dataType":"string"},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VisitResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "visitor": {"ref":"VisitorResponse","required":true},
            "date": {"dataType":"string","required":true},
            "residentId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VisitListResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "residentId": {"dataType":"string","required":true},
            "visits": {"dataType":"array","array":{"dataType":"refObject","ref":"VisitResponse"},"required":true},
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
    "VisitorListResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "residentId": {"dataType":"string","required":true},
            "records": {"dataType":"array","array":{"dataType":"refObject","ref":"VisitorResponse"},"required":true},
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
    "ResidentResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "cpf": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "block": {"dataType":"string"},
            "apartment": {"dataType":"string"},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResidentCreateRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "cpf": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "block": {"dataType":"string"},
            "apartment": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthResponse": {
        "dataType": "refObject",
        "properties": {
            "resident": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"_id":{"dataType":"string","required":true}},"required":true},
            "token": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserListResponse": {
        "dataType": "refObject",
        "properties": {
            "users": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"createdAt":{"dataType":"string","required":true},"apartment":{"dataType":"string"},"block":{"dataType":"string"},"phone":{"dataType":"string"},"cpf":{"dataType":"string"},"name":{"dataType":"string"},"email":{"dataType":"string","required":true},"_id":{"dataType":"string","required":true}}},"required":true},
            "total": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LogoutResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenValidationResponse": {
        "dataType": "refObject",
        "properties": {
            "valid": {"dataType":"boolean","required":true},
            "resident": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"_id":{"dataType":"string","required":true}}},
            "message": {"dataType":"string"},
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
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
        const argsResidentController_getResident: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"query","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/resident',
            ...(fetchMiddlewares<RequestHandler>(ResidentController)),
            ...(fetchMiddlewares<RequestHandler>(ResidentController.prototype.getResident)),

            async function ResidentController_getResident(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsResidentController_getResident, request, response });

                const controller = new ResidentController();

              await templateService.apiHandler({
                methodName: 'getResident',
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
        const argsResidentController_createResident: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ResidentCreateRequest"},
        };
        app.post('/resident',
            ...(fetchMiddlewares<RequestHandler>(ResidentController)),
            ...(fetchMiddlewares<RequestHandler>(ResidentController.prototype.createResident)),

            async function ResidentController_createResident(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsResidentController_createResident, request, response });

                const controller = new ResidentController();

              await templateService.apiHandler({
                methodName: 'createResident',
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
        const argsResidentController_deleteResident: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"query","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.delete('/resident',
            ...(fetchMiddlewares<RequestHandler>(ResidentController)),
            ...(fetchMiddlewares<RequestHandler>(ResidentController.prototype.deleteResident)),

            async function ResidentController_deleteResident(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsResidentController_deleteResident, request, response });

                const controller = new ResidentController();

              await templateService.apiHandler({
                methodName: 'deleteResident',
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
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginRequest"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
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
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"RegisterRequest"},
        };
        app.post('/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
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
        const argsAuthController_listUsers: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/auth/users',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.listUsers)),

            async function AuthController_listUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_listUsers, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'listUsers',
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
        const argsAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            async function AuthController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'logout',
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
        const argsAuthController_verifyToken: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/auth/verify-token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyToken)),

            async function AuthController_verifyToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verifyToken, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyToken',
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
