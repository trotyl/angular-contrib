import { VERSION } from '@angular/core';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { compile } from 'handlebars';
import { projects } from '../angular.json';
import { version } from '../package.json';

const angularCompatVersion = `${VERSION.major}.0.0`;

for (const [name, project] of Object.entries(projects)) {
  console.log(name);
  if (project.projectType !== 'library') {
    continue;
  }

  const packageJsonPath = resolve(__dirname, `../dist/${name}/package.json`);
  const packageJsonText = readFileSync(packageJsonPath, { encoding: 'utf-8'});
  const replacedJsonText = compile(packageJsonText)({
    version,
    angularCompatVersion,
  });
  writeFileSync(packageJsonPath, replacedJsonText, { encoding: 'utf-8' });
}
