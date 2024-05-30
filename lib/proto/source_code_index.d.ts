import { FileDescriptorProto, SourceCodeInfo_Location } from 'ts-proto-descriptors';
export declare const Type: {
    file: {
        message: number;
        enum: number;
    };
    message: {
        field: number;
        nested_type: number;
        enum: number;
        oneof_decl: number;
    };
    enum: {
        value: number;
    };
};
export declare class CodeIndex extends Map<string, SourceCodeInfo_Location> {
    static fromFileDescriptorProto(fileDesc: FileDescriptorProto): CodeIndex;
    slice(...prefix: number[]): CodeIndex;
    lookup(...prefix: number[]): string;
}
