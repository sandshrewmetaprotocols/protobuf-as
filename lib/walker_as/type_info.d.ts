import { decorated } from '../proto/index.js';
export declare type TypeInfo = {
    typeName?: string;
    collectionTypeName?: string;
    default?: string;
    method?: string;
    keyTypeInfo?: TypeInfo;
    valueTypeInfo?: TypeInfo;
    fixedSize?: number;
};
/**
 * Returns field type information required for AS definition/initialization.
 * @param field DecoratedField
 * @returns TypeInfo struct
 */
export declare function getTypeInfo(type: decorated.Field): TypeInfo;
