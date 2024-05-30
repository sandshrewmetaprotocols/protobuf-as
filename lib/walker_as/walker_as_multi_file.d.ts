import { FlatWalker, File } from '../walker/index.js';
import { decorated } from '../proto/index.js';
import { Options } from '../options.js';
import { GlobalsRegistry } from './index.js';
/**
 * WalkerAS represents Walker implementing FlatWalker strategy producing AssemblyScript code. This is the composite class.
 */
export declare class WalkerASMultiFile implements FlatWalker, GlobalsRegistry {
    private options;
    private namespace;
    private enum;
    private message;
    private decode;
    private encode;
    private size;
    private field;
    private oneOf;
    private globals;
    private generatedFiles;
    private fileStack;
    constructor(options: Readonly<Options>);
    private currentFileName;
    private pushFile;
    private popFile;
    private resetGlobals;
    beforeAll(): void;
    afterAll(): void;
    startNamespace(namespace: decorated.Namespace): void;
    referenceExternal(namespace: decorated.Namespace, ext: string): void;
    finishNamespace(namespace: decorated.Namespace): void;
    startEnum(en: decorated.Enum): void;
    enumValue(value: decorated.EnumValue): void;
    finishEnum(en: decorated.Enum): void;
    startMessage(message: decorated.Message): void;
    finishMessage(message: decorated.Message): void;
    fieldDecl(field: decorated.Field): void;
    startDecode(message: decorated.Message): void;
    beginDecode(): void;
    fieldInit(): void;
    fieldDecode(field: decorated.Field): void;
    endDecode(): void;
    finishDecode(message: decorated.Message): void;
    startEncode(message: decorated.Message): void;
    beginEncode(): void;
    fieldEncode(field: decorated.Field): void;
    endEncode(): void;
    finishEncode(message: decorated.Message): void;
    startSize(): void;
    fieldSize(field: decorated.Field): void;
    finishSize(): void;
    oneOfDiscriminatorDecl(desc: decorated.Message, group: string): void;
    oneOfDiscriminatorConst(desc: decorated.Field): void;
    files(): File[];
    p(s: string): void;
    registerGlobal(key: string, content: string): void;
}
