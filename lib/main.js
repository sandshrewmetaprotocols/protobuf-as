"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_proto_descriptors_1 = require("ts-proto-descriptors");
const util_1 = require("util");
const flat_walker_strategy_js_1 = require("./walker/flat_walker_strategy.js");
const index_js_1 = require("./walker_as/index.js");
const index_js_2 = require("./proto/index.js");
const options_js_1 = require("./options.js");
const internal_js_1 = require("./internal.js");
async function main() {
    const stdin = await (0, internal_js_1.readToBuffer)(process.stdin);
    const request = ts_proto_descriptors_1.CodeGeneratorRequest.decode(stdin);
    const options = (0, options_js_1.parseOptions)(request.parameter);
    request.protoFile.forEach((f) => {
        if ((f.syntax != 'proto3') && (f.syntax != '')) {
            throw new Error(`Only proto3 syntax is supported. ${f.name} has ${f.syntax} syntax!`);
        }
    });
    const types = new index_js_2.NamedDescriptorIndex(request);
    const roots = types.rootIDs();
    options.include.forEach((n) => roots.add(n));
    const requiredIDs = new index_js_2.NamedDescriptorIndexReducer(types, roots, new Set(options.exclude));
    const brokenReferences = requiredIDs.brokenReferences();
    if (brokenReferences.length > 0) {
        throw new Error(`Broken references found: ${brokenReferences
            .map((value) => `${value[0]} references ${value[1]}`)
            .join(', ')}, please either exclude a type and all it's references`);
    }
    const descriptors = new index_js_2.DecoratedDescriptorIndex(requiredIDs);
    const strategy = new flat_walker_strategy_js_1.FlatWalkerStrategy(descriptors);
    let walker = new index_js_1.WalkerASSingleFile(options);
    if (options.mode == 'multi') {
        walker = new index_js_1.WalkerASMultiFile(options);
    }
    strategy.walk(walker);
    const files = walker.files();
    const response = ts_proto_descriptors_1.CodeGeneratorResponse.fromPartial({
        // There is an issue with type declaration in ts-proto-descriptors, ignoring it for now
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        file: files,
        supportedFeatures: ts_proto_descriptors_1.CodeGeneratorResponse_Feature.FEATURE_PROTO3_OPTIONAL,
    });
    const buffer = ts_proto_descriptors_1.CodeGeneratorResponse.encode(response).finish();
    const write = (0, util_1.promisify)(process.stdout.write).bind(process.stdout);
    await write(Buffer.from(buffer));
}
main()
    .then(() => {
    process.exit(0);
})
    .catch((e) => {
    process.stderr.write('FAILED!');
    process.stderr.write(e.message);
    process.stderr.write(e.stack);
    process.exit(1);
});
//# sourceMappingURL=main.js.map