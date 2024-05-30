import { decorated } from '../proto/index.js';
export declare const embedNamespace = "__proto";
export declare const staticFiles: string[];
export declare function deprecatedComment(obj: decorated.Depricable): string;
export declare function relativeName(name: string): string;
export declare function absoluteName(obj: decorated.Named, ns: string): string;
export declare function comment(obj: decorated.Commented): string;
export declare function namespaceToFileName(obj: decorated.Namespace): string;
export declare function getRelPath(ns: decorated.Namespace): string;
