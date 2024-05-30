export * from './walker_as_single_file.js';
export * from './walker_as_multi_file.js';
export declare type Writer = (value: string) => void;
export interface GlobalsRegistry {
    registerGlobal(key: string, content: string): void;
}
