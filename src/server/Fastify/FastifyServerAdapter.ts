import {
  FastifyRequest,
  FastifyReply
} from 'fastify';
import fastifyCors from '@fastify/cors';
import { EndpointOptions, ServerAdapter } from '@adapters/ServerAdapter';
import { fastifyCookie } from 'fastify-cookie';
import { Routes } from '@routes/Routes';
import { FastifyRequestResponseAdapter } from './FastifyRequestResponseAdapter';
import fastifyRateLimit from '@fastify/rate-limit';
import { jsonSchemaTransform, serializerCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyTypedInstance } from './FastifyInstance';
import { RequestResponseAdapter } from '@adapters/RequestResponseAdapter';

export class FastifyServerAdapter implements ServerAdapter {
  private cookie: any;
  private routes?: Routes;
  constructor(
    private readonly app: FastifyTypedInstance,
  ) {}

  setRoutes(routes: Routes) {
    this.routes = routes;
  }

  private async setupRoutes() {
    if (!this.routes) throw new Error('Routes not set!');
    this.routes.setupRoutes();
  }

  get(url: string, callback: (adapter: RequestResponseAdapter
  ) => Promise<any>, options: EndpointOptions): void {
    this.app.get(url, {
      schema: options.docs?.schema,
      config: {
        rateLimit: options.config?.rateLimit
      }
      }, async (req: FastifyRequest, res: FastifyReply) => {
      const adapter = new FastifyRequestResponseAdapter(req, res);
      await callback(adapter);
    });
  }
  
  post(url: string, callback: (adapter: RequestResponseAdapter) => Promise<any>, options: EndpointOptions): void {
    this.app.post(url, {
      schema: options.docs?.schema,
      config: {
        rateLimit: options.config?.rateLimit
      },
    }, async (req: FastifyRequest, res: FastifyReply) => {
      const adapter = new FastifyRequestResponseAdapter(req, res);
      await callback(adapter);
    });
  }

  put(url: string, callback: (adapter: RequestResponseAdapter) => Promise<any>, options: EndpointOptions): void {
    this.app.put(url, {
      schema: options.docs?.schema,
      config: {
        rateLimit: options.config?.rateLimit
      },
    }, async (req: FastifyRequest, res: FastifyReply) => {
      const adapter = new FastifyRequestResponseAdapter(req, res);
      await callback(adapter);
    });
  }
  
  delete(url: string, callback: (adapter: RequestResponseAdapter) => Promise<any>,options: EndpointOptions): void {
    this.app.delete(url, {
      schema: options.docs?.schema,
      config: {
        rateLimit: options.config?.rateLimit
      },
    }, async (req: FastifyRequest, res: FastifyReply) => {
      const adapter = new FastifyRequestResponseAdapter(req, res);
      await callback(adapter);
    });
  }
  
  async listen(options: { port: number; host: string }): Promise<void> {
    await this.app.listen(options);
  }
  
  get log() {
    return this.app.log;
  }

  async init() {
    this.cookie = fastifyCookie;
    const noopValidatorCompiler = () => {
      return () => {
        return true; 
      };
    };
    const noopSerializerCompiler = () => {
      return () => {
        return ''; 
      };
    };
    this.app.setValidatorCompiler(noopValidatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);
    await this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'WebService',
          version: '1.0.0'
        }
      },
      transform: jsonSchemaTransform
    });
    await this.app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    });
    await this.app.register(fastifyCors, {
      credentials: true,
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await this.app.register(fastifyRateLimit, {
      global: true,
      max: Number(process.env.RATE_LIMIT_MAX),
      timeWindow: process.env.RATE_LIMIT_WINDOW,
      ban: Number(process.env.RATE_LIMIT_BAN), 
      cache: Number(process.env.RATE_LIMIT_CACHE),
      addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true
      },
      errorResponseBuilder: (req, context) => {
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${context.after}`,
        };
      }
    });
    await this.app.register(this.cookie);
    await this.setupRoutes();
  }

  async run() {
    await this.init();
  }
}