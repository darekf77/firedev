global['frameworkName'] = 'firedev';
import tnpStart from 'tnp';

export const start = async (args, frameworkName, mode) => {
  await (tnpStart as any)(args, frameworkName, mode);
}
