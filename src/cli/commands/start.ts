import { Command } from 'commander';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { getDataDir } from '../../utils/paths.js';
import { c, icons } from '../colors.js';

export function startCommand(): Command {
  return new Command('start')
    .description('Start the Marketing Brain daemon')
    .option('-f, --foreground', 'Run in foreground (no detach)')
    .option('-c, --config <path>', 'Config file path')
    .action((opts) => {
      const pidPath = path.join(getDataDir(), 'marketing-brain.pid');

      if (fs.existsSync(pidPath)) {
        const pid = parseInt(fs.readFileSync(pidPath, 'utf8').trim(), 10);
        try {
          process.kill(pid, 0);
          console.log(`${icons.megaphone}  Marketing Brain daemon is ${c.green('already running')} ${c.dim(`(PID: ${pid})`)}`);
          return;
        } catch {
          fs.unlinkSync(pidPath);
        }
      }

      if (opts.foreground) {
        import('../../marketing-core.js').then(({ MarketingCore }) => {
          const core = new MarketingCore();
          core.start(opts.config);
        });
        return;
      }

      const args = ['daemon'];
      if (opts.config) args.push('-c', opts.config);

      const entryPoint = path.resolve(import.meta.dirname, '../../index.js');
      const child = spawn(process.execPath, [entryPoint, ...args], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();

      console.log(`${icons.megaphone}  ${c.info('Marketing Brain daemon starting')} ${c.dim(`(PID: ${child.pid})`)}`);

      setTimeout(() => {
        if (fs.existsSync(pidPath)) {
          console.log(`${icons.ok}  ${c.success('Marketing Brain daemon started successfully.')}`);
        } else {
          console.log(`${icons.clock}  ${c.warn('Daemon may still be starting.')} Check: ${c.cyan('marketing status')}`);
        }
      }, 1000);
    });
}
