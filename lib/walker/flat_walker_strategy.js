"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlatWalkerStrategy = exports.WalkerStrategy = void 0;
const index_js_1 = require("../proto/index.js");
const immutable_flat_tree_js_1 = require("../structs/immutable_flat_tree.js");
const decorated_descriptor_js_1 = require("../proto/decorated_descriptor.js");
// Walker strategy is a strategy which calls a walker methods in an order required
// to produce a specific target structure. It's like a SAX parser, but reversed.
// For example, FlatWalkerStrategy walks namespaces hierarchically, and messages sequentially,
// including subpaths usually required for OO languages.
//
// It aims to generate encode(), decode() and size() methods.
class WalkerStrategy {
    constructor(index) {
        this.index = index;
    }
}
exports.WalkerStrategy = WalkerStrategy;
/**
 * Implements the generic walker strategy for an OO language.
 *
 * - Namespaces are hierachical.
 * - Enums and messages are sequentially nested into namespaces.
 * - decode(), encode() and size() methods.
 */
class FlatWalkerStrategy extends WalkerStrategy {
    constructor(index) {
        super(index);
        this.index = index;
        this.items = new immutable_flat_tree_js_1.ImmutableFlatTree(index.values().map((v) => [v.id, v]));
    }
    walk(walker) {
        walker.beforeAll();
        // Get root namespaces along with topmost enums and messages which are not linked to any namespace
        this.items
            .filter((item) => {
            const [, desc, level] = item;
            let match;
            if (desc.kind == 'namespace') {
                match = level == 1; // Root namespace
            }
            else {
                // Enum or message which does not belong to any namespace
                match =
                    desc.namespace == '' &&
                        ['enum', 'message'].includes(desc.kind);
            }
            return match ? item : null;
        })
            .forEach(([, desc]) => this.walkItem(walker, desc));
        walker.afterAll();
    }
    walkItem(walker, desc) {
        switch (desc.kind) {
            case 'namespace':
                return this.walkNamespace(walker, desc);
            case 'enum':
                return this.walkEnum(walker, desc);
            case 'enum_value':
                return this.walkEnumValue(walker, desc);
            case 'message':
                return this.walkMessage(walker, desc);
            default:
                throw new Error(`Unknown descriptor kind ${desc}`);
        }
    }
    walkExternals(walker, namespaceDesc) {
        const externals = new Array();
        // Generate references to external namespaces within this particular namespace
        this.items.descendants(namespaceDesc.id).forEach(([, desc]) => {
            if (desc.namespace != namespaceDesc.id) {
                return;
            }
            if (!(0, decorated_descriptor_js_1.isField)(desc)) {
                return;
            }
            if (desc.kind == 'field_message' || desc.kind == 'field_message_repeated') {
                if (desc.typeName.namespace != namespaceDesc.id) {
                    externals.push(desc.typeName.namespace);
                }
            }
            if (desc.kind == 'field_map_message') {
                if (desc.value.typeName.namespace != namespaceDesc.id) {
                    externals.push(desc.value.typeName.namespace);
                }
            }
        });
        externals
            .filter((value, index, self) => self.indexOf(value) === index)
            .forEach(name => walker.referenceExternal(namespaceDesc, name));
    }
    walkNamespace(walker, namespaceDesc) {
        walker.startNamespace(namespaceDesc);
        this.walkExternals(walker, namespaceDesc);
        // Walk by this namespace items
        this.items.descendants(namespaceDesc.id).forEach(([, desc]) => {
            // Walk inside namespaces of any nesting level
            if (desc.kind == 'namespace') {
                this.walkItem(walker, desc);
            }
            // Walk inside enums and messages which belong to this particular namespace
            if (['enum', 'message'].includes(desc.kind) &&
                desc.namespace == namespaceDesc.id) {
                this.walkItem(walker, desc);
            }
        });
        walker.finishNamespace(namespaceDesc);
    }
    walkEnum(walker, desc) {
        walker.startEnum(desc);
        this.items
            .descendants(desc.id, 1)
            .forEach(([, desc]) => this.walkItem(walker, desc));
        walker.finishEnum(desc);
    }
    walkEnumValue(walker, desc) {
        walker.enumValue(desc);
    }
    walkMessage(walker, desc) {
        // Skip proto map entry artificial types
        if (desc.mapHelper) {
            return;
        }
        // Get direct children which are fields
        const children = this.items.descendants(desc.id, 1).filter((value) => {
            const [, desc] = value;
            return index_js_1.decorated.isField(desc) ? value : null;
        });
        walker.startMessage(desc);
        children.forEach(([, fieldDesc]) => walker.fieldDecl(fieldDesc));
        desc.oneOf.forEach((group) => walker.oneOfDiscriminatorDecl(desc, group));
        children.forEach(([, fieldDesc]) => walker.oneOfDiscriminatorConst(fieldDesc));
        walker.startDecode(desc);
        children.forEach(([, fieldDesc]) => walker.fieldInit(fieldDesc));
        walker.beginDecode(desc);
        children.forEach(([, fieldDesc]) => walker.fieldDecode(fieldDesc));
        walker.endDecode(desc);
        walker.finishDecode(desc);
        walker.startSize(desc);
        children.forEach(([, fieldDesc]) => walker.fieldSize(fieldDesc));
        walker.finishSize(desc);
        walker.startEncode(desc);
        walker.beginEncode(desc);
        children.forEach(([, fieldDesc]) => walker.fieldEncode(fieldDesc));
        walker.endEncode(desc);
        walker.finishEncode(desc);
        walker.finishMessage(desc);
    }
}
exports.FlatWalkerStrategy = FlatWalkerStrategy;
//# sourceMappingURL=flat_walker_strategy.js.map