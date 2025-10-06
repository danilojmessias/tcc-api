import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { RegisterRoutes } from './routes/routes';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware with Swagger UI compatibility
    this.app.use(helmet({
      contentSecurityPolicy: false, // Disable CSP completely for Swagger UI
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false
    }));
    
    // CORS middleware
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Logging middleware
    this.app.use(morgan('combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'TCC API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // Create API router
    const apiRouter = express.Router();
    
    // API routes logging middleware
    apiRouter.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
      next();
    });

    // Register TSOA routes to the API router
    RegisterRoutes(apiRouter);
    
    // Mount the API router with /api prefix
    this.app.use('/api', apiRouter);
  }

  private initializeSwagger(): void {
    try {
      // Import swagger spec
      const swaggerDocument = require('./swagger/swagger.json');
      
      // Corrigir a URL do servidor dinamicamente para usar HTTP
      swaggerDocument.servers = [{
        url: `http://localhost:${this.port}/api`,
        description: 'Development server'
      }];
      
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'TCC API Documentation',
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          tryItOutEnabled: true,
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
        }
      }));

      console.log('📚 Swagger documentation available at /api-docs');
    } catch (error) {
      console.warn('⚠️  Swagger documentation not available:', error instanceof Error ? error.message : String(error));
      console.warn('Run "npm run build" to generate it.');
    }
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        message: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });

    // Global error handler
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      console.error('❌ Error:', error);

      // TSOA validation errors
      if (error.status === 422) {
        return res.status(422).json({
          message: 'Validation error',
          details: error.fields || error.message,
          timestamp: new Date().toISOString()
        });
      }

      // MongoDB duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          message: 'Duplicate entry',
          field: Object.keys(error.keyPattern)[0],
          timestamp: new Date().toISOString()
        });
      }

      // Default error response
      res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.app.listen(this.port, () => {
        console.log('🚀 Server started successfully!');
        console.log(`📡 Server running on port ${this.port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📋 Health check: http://localhost:${this.port}/health`);
        console.log(`📚 API Documentation: http://localhost:${this.port}/api-docs`);
        console.log(`🔗 API Base URL: http://localhost:${this.port}/api`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();
app.start();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;