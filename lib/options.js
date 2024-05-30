"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = void 0;
const zod_1 = require("zod");
const fs_1 = require("fs");
// Represents strings meaning true values
const trueValues = ["1", "true", "yes"];
// parseArray returns array parsed from string
const parseArray = function (arg) {
    if (typeof arg == "string") {
        return arg.split(",");
    }
    return arg;
};
// parseBool returns boolean value parsed from string
const parseBool = function (arg) {
    if (typeof arg == "string") {
        return trueValues.includes(arg.toLowerCase());
    }
    return arg;
};
// parseMap returns map parsed from a string or object
const parseMap = function (arg) {
    if (typeof arg == "string") {
        const m = new Map();
        const items = arg.split("+");
        for (let i = 0; i < items.length; i += 2) {
            const key = items[i];
            const value = items[i + 1];
            m.set(key, value);
        }
        return m;
    }
    if (arg === Object(arg)) {
        const m = new Map();
        Object.entries(arg).forEach(([key, value]) => {
            m.set(key, value);
        });
        return m;
    }
    return arg;
};
/**
 * Zod schema used to validate JSON config file
 */
const OptionsSchema = zod_1.z
    .object({
    // Config file name
    config: zod_1.z.optional(zod_1.z.string()),
    // IDs of messages, fields, enums and enum values to exclude
    exclude: zod_1.z.preprocess(parseArray, zod_1.z.optional(zod_1.z.array(zod_1.z.string())).default([])),
    // IDs of messages, fields, enums and enum values to include
    include: zod_1.z.preprocess(parseArray, zod_1.z.optional(zod_1.z.array(zod_1.z.string())).default([])),
    // Dependencies: export, embed or leave in package
    mode: zod_1.z.enum(["single", "multi"]).default("single"),
    // Disable prettier
    disablePrettier: zod_1.z.preprocess(parseBool, zod_1.z.boolean().default(false)),
    // Enable standard type extensions (check assembly/ext)
    stdext: zod_1.z.preprocess(parseBool, zod_1.z.boolean().default(true)),
    // Path to custom extensions directory
    customext: zod_1.z.optional(zod_1.z.string()),
    // Default export file name
    targetFileName: zod_1.z.string().default('assembly.ts'),
    // Should embedded messages be nullable
    nullable: zod_1.z.preprocess(parseBool, zod_1.z.boolean().default(false)),
    // OneOf discriminator name overrides
    oneOf: zod_1.z.preprocess(parseMap, zod_1.z.map(zod_1.z.string(), zod_1.z.string()).optional()),
})
    .strict();
/**
 * Parses protobuf options string and returns options object.
 * @param raw protoc options string in form of "param=value:param=value,value:param=key;value;key;value"
 * @returns Object of options
 */
function parseOptions(raw) {
    if (raw.trim() == '') {
        return OptionsSchema.parse({});
    }
    const obj = {};
    raw.split(':')
        .map((v) => v.split('='))
        .forEach(([key, value]) => obj[key] = value);
    if (obj.config) {
        const file = (0, fs_1.readFileSync)(obj.config);
        const json = JSON.parse(file.toString());
        return OptionsSchema.parse(json);
    }
    return OptionsSchema.parse(obj);
}
exports.parseOptions = parseOptions;
//# sourceMappingURL=options.js.map