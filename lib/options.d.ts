import { z } from 'zod';
/**
 * Zod schema used to validate JSON config file
 */
declare const OptionsSchema: z.ZodObject<{
    config: z.ZodOptional<z.ZodString>;
    exclude: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
    include: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>, string[], unknown>;
    mode: z.ZodDefault<z.ZodEnum<["single", "multi"]>>;
    disablePrettier: z.ZodEffects<z.ZodDefault<z.ZodBoolean>, boolean, unknown>;
    stdext: z.ZodEffects<z.ZodDefault<z.ZodBoolean>, boolean, unknown>;
    customext: z.ZodOptional<z.ZodString>;
    targetFileName: z.ZodDefault<z.ZodString>;
    nullable: z.ZodEffects<z.ZodDefault<z.ZodBoolean>, boolean, unknown>;
    oneOf: z.ZodEffects<z.ZodOptional<z.ZodMap<z.ZodString, z.ZodString>>, Map<string, string>, unknown>;
}, "strict", z.ZodTypeAny, {
    config?: string;
    exclude?: string[];
    include?: string[];
    mode?: "single" | "multi";
    disablePrettier?: boolean;
    stdext?: boolean;
    customext?: string;
    targetFileName?: string;
    nullable?: boolean;
    oneOf?: Map<string, string>;
}, {
    config?: string;
    exclude?: unknown;
    include?: unknown;
    mode?: "single" | "multi";
    disablePrettier?: unknown;
    stdext?: unknown;
    customext?: string;
    targetFileName?: string;
    nullable?: unknown;
    oneOf?: unknown;
}>;
/**
 * Resulting TypeScript type of OptionsSchema + outDir
 */
export declare type Options = z.infer<typeof OptionsSchema>;
/**
 * Parses protobuf options string and returns options object.
 * @param raw protoc options string in form of "param=value:param=value,value:param=key;value;key;value"
 * @returns Object of options
 */
export declare function parseOptions(raw: string): Readonly<Options>;
export {};
