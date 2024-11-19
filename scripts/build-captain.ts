import chalk from 'chalk';
import { copy, copyFile, ensureDir, exists, writeFile } from 'fs-extra';
import { join } from 'node:path';

(async function build() {
  /**
   * Dockerfile
   */
  const dockerfileOrigin = join(__dirname, '../apps/web/Dockerfile');
  const dockerfileDest = join(__dirname, '../dist/apps/web/Dockerfile');

  if (await exists(dockerfileOrigin)) {
    await ensureDir(join(__dirname, '../dist/apps/web'));
    await copyFile(dockerfileOrigin, dockerfileDest);
    console.log(chalk.green('✓ Copied Dockerfile'));
  }

  /**
   * captain-definition
   */
  const captainOrigin = join(__dirname, '../apps/web/captain-definition');
  const captainDest = join(__dirname, '../dist/apps/web/captain-definition');

  if (await exists(captainOrigin)) {
    await ensureDir(join(__dirname, '../dist/apps/web'));
    await copyFile(captainOrigin, captainDest);
    console.log(chalk.green('✓ Copied captain-definition'));
  }

  /**
   * Create server.js
   */
  const serverJsContent = `
    import { createRequestHandler } from '@remix-run/express';
    import express from 'express';
    import * as build from './server/index.js';

    const app = express();
    const port = process.env.PORT || 3380;

    app.use(express.static('./client'));

    app.all(
      '*',
      createRequestHandler({
        build,
      }),
    );

    app.listen(port, () => {
      console.log(\`Server is running on port \${port}\`);
    });
  `;

  const serverJsPath = join(__dirname, '../dist/apps/web/server.js');
  await writeFile(serverJsPath, serverJsContent);
  console.log(chalk.green('✓ Created server.js'));

  /**
   * Build folders
   */
  const clientOrigin = join(__dirname, '../apps/web/build/client');
  const serverOrigin = join(__dirname, '../apps/web/build/server');
  const clientDest = join(__dirname, '../dist/apps/web/client');
  const serverDest = join(__dirname, '../dist/apps/web/server');

  if (await exists(clientOrigin)) {
    await ensureDir(clientDest);
    await copy(clientOrigin, clientDest);
    console.log(chalk.green('✓ Copied client build folder'));
  }

  if (await exists(serverOrigin)) {
    await ensureDir(serverDest);
    await copy(serverOrigin, serverDest);
    console.log(chalk.green('✓ Copied server build folder'));
  }

  /**
   * Copy package.json
   */
  const packageJsonOrigin = join(__dirname, '../apps/web/package.json');
  const packageJsonDest = join(__dirname, '../dist/apps/web/package.json');

  if (await exists(packageJsonOrigin)) {
    await copyFile(packageJsonOrigin, packageJsonDest);
    console.log(chalk.green('✓ Copied package.json'));
  }
})();
