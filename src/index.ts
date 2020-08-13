//#region @backend
import tnpStart from 'tnp';

global['frameworkName'] = 'firedev';
//#endregion
export const start = async (args, frameworkName, mode) => {
  //#region @backend
  await (tnpStart as any)(args, frameworkName, mode);
  //#endregion
}

import { Morphi } from 'morphi';
export import Firedev = Morphi;
