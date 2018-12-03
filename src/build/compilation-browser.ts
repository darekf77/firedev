//#region @backend
import * as child from 'child_process';
import * as fse from 'fs-extra';
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as glob from 'glob';
import * as _ from 'lodash';
import { IncrementalCompilation } from './incremental-compilation';
import { OutFolder } from './models';
import { HelpersBackend } from '../helpers';
import { CodeCut } from './browser-code-cut';
import { config } from './config';
import { BackendCompilation } from './compilation-backend';



export class BroswerCompilation extends BackendCompilation {


  public codecut: CodeCut;
  constructor(
    /**
     * Relative path for browser temporary src
     * Ex.   tmp-src-dist-browser
     */
    public sourceOutBrowser: string,
    outFolder: OutFolder,
    location: string,
    cwd: string,
    public backendOutFolder: string,
  ) {
    super(outFolder, location, cwd)
    this.compilationFolderPath = path.join(this.cwd, this.sourceOutBrowser);
    this.initBrowser();
  }

  asyncAction(filePath: string) {
    // noting here for backend
    const relativeFilePath = filePath.replace(path.join(this.cwd, this.location), '');
    const dest = path.join(this.cwd, this.sourceOutBrowser, relativeFilePath);
    fse.copyFileSync(filePath, dest);
    this.codecut.file(dest)
  }

  private initBrowser() {

    if (fse.existsSync(this.compilationFolderPath)) {
      rimraf.sync(this.compilationFolderPath)
    }
    fse.mkdirpSync(this.compilationFolderPath)

    HelpersBackend.tryCopyFrom(`${path.join(this.cwd, this.location)}/`, this.compilationFolderPath)

    this.filesAndFoldesRelativePathes = glob.sync(this.globPattern, { cwd: this.compilationFolderPath });
    // console.log('browser', this.filesAndFoldesRelativePathes.slice(0, 5))
    this.initCodeCut()

  }

  compile(watch = false) {
    this.tscCompilation(this.compilationFolderPath, watch, `../${this.backendOutFolder}/${this.outFolder}` as any, true)
  }

  initCodeCut() {
    this.codecut = new CodeCut(this.compilationFolderPath, this.filesAndFoldesRelativePathes, {
      replacements: [
        ["@backendFunc", `return undefined;`],
        "@backend"
      ]
    })
  }


  prepareFiles() {

    // recreate dirst
    const outDistPath = path.join(this.cwd, this.backendOutFolder, this.outFolder);
    HelpersBackend.tryRemoveDir(outDistPath)
    // fse.mkdirpSync(outDistPath);

    // tsconfig.browser.json
    const source = path.join(this.cwd, this.tsConfigBrowserName);
    const dest = path.join(this.cwd, this.sourceOutBrowser, this.tsConfigName);

    fse.copyFileSync(source, dest)
    this.codecut.files()
  }


}


//#endregion
