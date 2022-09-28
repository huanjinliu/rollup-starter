import { createSpinner, Spinner } from 'nanospinner';

/** 是否是错误类型 */
const isError = (err: unknown): err is Error => err instanceof Error;

/**
 * 创建一个任务
 * @param {Function} task 任务执行函数
 * @param {string} description 任务描述
 */
export const createTask = <V>(description: string) => {
  return {
    run: async (task: (spinner: Spinner) => Promise<V>) => {
      const spinner = createSpinner(description).start();
      try {
        const result = await task(spinner);
        spinner.success();
    
        return result;
      } catch (err) {
        if (isError(err)) {
          spinner.error({
            text: err.message
          });
        }
    
        process.exit();
      }
    }
  }
};
