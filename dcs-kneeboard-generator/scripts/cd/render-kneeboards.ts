#!/usr/bin/env ts-node --project tsconfig.node.json

import { platform } from 'os';
import { readFile, mkdir, access } from 'fs/promises';
import { log, info, error } from 'console';
import { parse, basename, sep } from 'path';
import { exec } from 'child_process';
import { stripIndent } from 'common-tags';
import Export from 'next/dist/export';
import { trace } from 'next/dist/trace';
import { createServer } from 'http-server';
import RenderPDF from 'chrome-headless-render-pdf';
import Minimist from 'minimist';

export interface RenderKneeboardOpts {
  outdir?: string;
  all_found_kbs?: boolean;
  kneeboards?: {
    yaml_file: string;
    subject_object_name: string;
    kneeboard_name: string;
    basename: string;
  }[];
}

export async function prog({
  outdir = 'output',
  kneeboards = [],
}: RenderKneeboardOpts) {
  try {
    await access(outdir);
  } catch (err) {
    await mkdir(outdir);
  }

  const scss_var_file = await readFile('src/styles/_variables.scss').then(b =>
    b.toString(),
  );
  const page_width_matches = scss_var_file.match(
    /page-width: (\d+)([a-zA-Z]*);/,
  );
  const page_height_matches = scss_var_file.match(
    /page-height: (\d+)([a-zA-Z]*);/,
  );

  const dpi = 100;
  const px_width = parseInt(page_width_matches?.at(1) || '1100');
  const px_height = parseInt(page_height_matches?.at(1) || '1600');
  const phy_width = px_width / dpi;
  const phy_height = px_height / dpi;

  const build_dir = 'build';

  info(`Build kneeboards`);
  await Promise.all(
    kneeboards.map(path => {
      process.env.KNEEBOARD = path.yaml_file;
      return new Promise<void>((res, rej) =>
        exec(`next build`, error => {
          if (error != null) rej(error);
          else res();
        }),
      ).then(() => {
        process.env.KNEEBOARD = path.yaml_file;
        Export(
          './',
          {
            outdir: `${build_dir}/${path.subject_object_name}/${path.kneeboard_name}`,
          },
          trace('next-export-cli'),
        );
      });
    }),
  );

  info(`Start HTTP server`);
  const port = 8080;
  const server = createServer({ root: `./${build_dir}` });
  server.listen(port);

  info(`Render PDFs`);
  await RenderPDF.generateMultiplePdf(
    await Promise.all(
      kneeboards.map(async path => {
        log(path);
        await mkdir(`${outdir}/${path.subject_object_name}`).catch(() => {});
        return path;
      }),
    )
      .then(paths =>
        paths.map(path => ({
          url: `http://localhost:${port}/${path.subject_object_name}/${path.kneeboard_name}`,
          pdf: `${outdir}/${path.subject_object_name}/${path.kneeboard_name}.pdf`,
        })),
      )
      .then(job => {
        log(job);
        return job;
      }),
    {
      chromeBinary: get_chrome_path(),
      // chromeOptions: ['--no-sandbox'],
      displayHeaderFooter: false,
      noMargins: true,
      includeBackground: true,
      windowSize: `${px_height}x${phy_width}` as any as boolean, // for some reason
      paperWidth: `${phy_width}`,
      paperHeight: `${phy_height}`,
      pageRanges: '1',
    },
  ).catch(err => {
    error(err);
  });

  info(`Stop HTTP server`);
  server.close();

  info(`Done`);
}

/** Finds all kneeboard defintion files below a given path */
async function find_kneeboard_defs(): Promise<string[]> {
  // TODO: implement this
  return [];
}

function help() {
  info(stripIndent`
    Usage:\t${basename(process.argv[1] ?? '')} [OPTIONS] kneeboards

    Options:
      -o, --out "path"     Output path for the kneeboards
      -a, --all            Render all kneeboards
          This then ignores the kneeboards option
      -h, --help           Show this message`);
}

async function main() {
  const args = Minimist(process.argv.slice(2));

  let outdir: string | undefined;
  let kneeboards: string[] | undefined;

  for (const arg in args) {
    switch (arg) {
      case '_':
        kneeboards = args[arg];
        break;
      case 'o':
      case 'out':
        outdir = args[arg];
        break;
      case 'a':
      case 'all':
        kneeboards = await find_kneeboard_defs();
        break;
      case 'h':
      case 'help':
        help();
        process.exit(0);
      default:
        error(`Unknown argument "${arg}"\n`);
        help();
        process.exit(1);
    }
  }

  prog({
    outdir,
    kneeboards: kneeboards?.map(yaml_file => {
      const path = parse(yaml_file);
      return {
        yaml_file,
        subject_object_name: path.dir.split(sep).at(-1) ?? 'unknown',
        kneeboard_name: path.name,
        basename: path.base,
      };
    }),
  });
}

/** @throws {Error} Throws an error if running on an unsupported platform */
function get_chrome_path() {
  const os = platform();
  switch (os) {
    case 'linux': {
      return '/usr/bin/google-chrome-stable';
    }
    case 'darwin': {
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    default: {
      throw new Error(`Platform ${os} is not supported`);
    }
  }
}

main();
