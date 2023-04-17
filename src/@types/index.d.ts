type APIError = { error?: string; message: string; statusCode: number };
type Todo = { id: number; todo: string; isCompleted: boolean; userId: number };
type API = (...args: any[]) => Promise<any>;
