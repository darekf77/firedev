//#region @backend
import tnpStart from 'tnp';

global['frameworkName'] = 'firedev';
//#endregion
export const start = async (args, frameworkName, mode) => {
  //#region @backend
  await (tnpStart as any)(args, frameworkName, mode);
  //#endregion
}

