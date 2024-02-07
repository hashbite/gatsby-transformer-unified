export const importCache: Map<string, any> = new Map();

export async function cachedImport<Type>(packageName: string): Promise<Type> {
  if (importCache.has(packageName)) {
    return importCache.get(packageName) as Type;
  }
  try {
    const importedPackage: Type = await import(packageName);
    if (!importedPackage) {
      throw new Error(
        `Package ${packageName} got imported, but it is empty. This is probably a module resolution issue.`
      );
    }
    importCache.set(packageName, importedPackage);
    return importedPackage;
  } catch (err) {
    console.error(err);
    throw new Error(
      `Unable to import package ${packageName}. Check error in console.`
    );
  }
}

type Task<T> = () => Promise<T>;

export class ConcurrencyControl<T> {
  // Maximum number of tasks allowed to run concurrently. If null, no limit is applied.
  private maxConcurrent: number | null;
  // Maximum number of attempts to retry a failed task.
  private retryLimit: number;
  // Current number of tasks running.
  private currentlyRunning: number;
  // Queue of functions to resolve when a slot for a new task becomes available.
  private queue: (() => void)[];

  /**
   * Constructs a ConcurrencyControl instance.
   * @param {number | null} maxConcurrent - The maximum number of concurrent tasks. Set to null for no limit.
   * @param {number} retryLimit - The maximum number of retries for a failed task.
   */
  constructor(maxConcurrent: number | null = 5, retryLimit: number = 0) {
    this.maxConcurrent = maxConcurrent;
    this.retryLimit = retryLimit;
    this.currentlyRunning = 0;
    this.queue = [];
  }

  /**
   * Enqueues a task to be executed with concurrency control.
   * @param {Task<T>} task - The task to be executed.
   * @returns {Promise<T>} A promise that resolves to the result of the task.
   */
  async enqueue(task: Task<T>): Promise<T> {
    const runTask = async (attempt: number = 0): Promise<T> => {
      try {
        // Increase the count of currently running tasks.
        this.currentlyRunning++;
        return await task();
      } catch (error) {
        // Retry the task if it fails and the retry limit has not been reached.
        if (attempt < this.retryLimit) {
          console.log(error);
          console.log(`Retrying task, attempt ${attempt + 1}`);
          return await runTask(attempt + 1);
        } else {
          // All retry attempts failed; rethrow the error.
          throw error;
        }
      } finally {
        // Task completed; decrease the count of currently running tasks.
        this.currentlyRunning--;
        // If tasks are waiting in the queue, start the next one.
        if (this.queue.length > 0) {
          this.queue.shift()!();
        }
      }
    };

    // If maxConcurrent is null or if the number of currently running tasks hasn't reached the max,
    // execute the task immediately. Otherwise, add it to the queue.
    if (
      this.maxConcurrent === null ||
      this.currentlyRunning < this.maxConcurrent
    ) {
      return runTask();
    } else {
      await new Promise<void>((resolve) => this.queue.push(resolve));
      return runTask();
    }
  }
}
