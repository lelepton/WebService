import { app } from '@server/ServerComposer';
import { ServerAdapter } from './adapters/ServerAdapter';

const PORT: number = parseInt(process.env.PORT as any) ?? 5000;
const HOST: string = process.env.HOST ?? '127.0.0.1';

class Application {
  app: ServerAdapter;
  port: number;
  host: string;

  constructor(app: ServerAdapter) {
    this.app = app;
    this.port = PORT;
    this.host = HOST;
  }

  async server() {
    try {
      await this.app.run();
      await this.app.listen({
        port: this.port,
        host: this.host,
      });

      this.app.log.info(
        `🚀 server is running on http://${this.host}:${this.port}`
      );

      console.log(`🚀 server is running on http://${this.host}:${this.port}`);
    } catch (error) {
      this.app.log.error(error as Error);
      process.exit(1);
    }
  }
}

const application = new Application(app);
application.server();
