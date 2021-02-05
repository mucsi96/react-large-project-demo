import { Compiler, compilation } from 'webpack';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const serviceWorker = readFileSync(
  resolve(__dirname, 'mockApiServiceWorker.js'),
  {
    encoding: 'utf8',
  }
);

// Source: https://webpack.js.org/contribute/writing-a-plugin/#example
export class MockApiServiceWorkerWebpackPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.emit.tapAsync(
      'MockApiServiceWorkerWebpackPlugin',
      (compilation: compilation.Compilation, callback: () => void) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        compilation.assets['mockApiServiceWorker.js'] = {
          source: () => serviceWorker,
          size: () => serviceWorker.length,
        };

        callback();
      }
    );
  }
}
