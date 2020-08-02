import run from 'tnp';

export const start = async (args, __, mode) => {
  await run(args, 'firedev', mode);
}
