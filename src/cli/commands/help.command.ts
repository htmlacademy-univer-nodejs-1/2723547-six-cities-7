import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
${chalk.bold.cyan('Программа для подготовки данных для REST API сервера.')}
${chalk.yellow('Пример:')}
    ${chalk.green('cli.js --<command> [--arguments]')}
${chalk.yellow('Команды:')}
    ${chalk.green('--version:')}                   ${chalk.gray('# выводит номер версии')}
    ${chalk.green('--help:')}                      ${chalk.gray('# печатает этот текст')}
    ${chalk.green('--import <path>:')}             ${chalk.gray('# импортирует данные из TSV')}
    ${chalk.green('--generate <n> <path> <url>')}  ${chalk.gray('# генерирует тестовые данные')}
    `);
  }
}
