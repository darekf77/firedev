import { start as tnpStart } from 'tnp/cli';
import { start as tnpStartLocal } from 'tnp';


let startFn = tnpStart;
//#region @notForNpm
startFn = tnpStartLocal;
//#endregion

export const start = async (args, frameworkName, mode) => {
  await (startFn as any)(args, frameworkName, mode);
}
// DONT CHANGE THIS FILE!
