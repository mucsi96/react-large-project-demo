import { Compiler, compilation } from 'webpack';
import { readFileSync } from 'fs';

// Source: https://webpack.js.org/contribute/writing-a-plugin/#example
export class MockApiServiceWorkerWebpackPlugin {
  serviceWorker: string;

  constructor() {
    this.serviceWorker = readFileSync(
      require.resolve('./mockApiServiceWorker'),
      {
        encoding: 'utf8',
      }
    );
  }

  apply(compiler: Compiler): void {
    compiler.hooks.emit.tapAsync(
      'MockApiServiceWorkerWebpackPlugin',
      (compilation: compilation.Compilation, callback: () => void) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        compilation.assets['mockApiServiceWorker.js'] = {
          source: () => this.serviceWorker,
          size: () => this.serviceWorker.length,
        };

        callback();
      }
    );
  }
}
