import { start as tnpStart } from 'tnp/cli';

export const start = async (args, frameworkName, mode) => {
  await (tnpStart as any)(args, frameworkName, mode);
}
