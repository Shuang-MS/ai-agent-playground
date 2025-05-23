// queue.ts
type TaskFn<T = any> = () => Promise<T>;

type Task<T = any> = {
  taskFn: TaskFn<T>;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
};

type Listener = (status: { isProcessing: boolean; length: number }) => void;

class TaskQueue {
  private static _instance: TaskQueue;
  private queue: Task[] = [];
  private isProcessing: boolean = false;
  private listeners: Listener[] = [];

  private constructor() {}

  public static getInstance(): TaskQueue {
    if (!this._instance) {
      this._instance = new TaskQueue();
    }
    return this._instance;
  }

  public enqueue<T = any>(taskFn: TaskFn<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.notify();
      this.process();
    });
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    this.notify();

    const { taskFn, resolve, reject } = this.queue.shift()!;
    try {
      const result = await taskFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    this.isProcessing = false;
    this.notify();

    if (this.queue.length > 0) {
      this.process();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    // 立即推送一次
    listener({ isProcessing: this.isProcessing, length: this.queue.length });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const status = {
      isProcessing: this.isProcessing,
      length: this.queue.length,
    };
    this.listeners.forEach((l) => l(status));
  }
}

// 默认导出单例
const queue = TaskQueue.getInstance();
export default queue;
