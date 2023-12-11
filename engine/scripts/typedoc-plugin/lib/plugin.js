"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const typedoc_1 = require("typedoc");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const TAG_NAME_CC_CATEGORY = 'ccCategory';
const TAG_NAME_LEGACY_PUBLIC = 'legacyPublic'.toLowerCase();
const CATEGORY_CONFIG_FILE_NAME = 'category.json';
function load(app) {
    const engineRoot = process.cwd();
    app.converter.on(typedoc_1.Converter.EVENT_CREATE_DECLARATION, onCreateReflection);
    app.converter.on(typedoc_1.Converter.EVENT_CREATE_SIGNATURE, onCreateSignature);
    app.converter.on(typedoc_1.Converter.EVENT_RESOLVE_END, (context) => {
        const visit = (reflection, visitor) => {
            visitor(reflection);
            if (reflection instanceof typedoc_1.DeclarationReflection) {
                for (const signature of reflection.getAllSignatures()) {
                    visit(signature, visitor);
                }
            }
            if (reflection instanceof typedoc_1.ContainerReflection) {
                if (reflection.children) {
                    for (const child of reflection.children) {
                        visit(child, visitor);
                    }
                }
            }
            else if (reflection instanceof typedoc_1.SignatureReflection) {
                if (reflection.parameters) {
                    for (const param of reflection.parameters) {
                        visit(param, visitor);
                    }
                }
                if (reflection.typeParameters) {
                    for (const typeParameter of reflection.typeParameters) {
                        visit(typeParameter, visitor);
                    }
                }
            }
        };
        visit(context.project, (reflection) => {
            handleLink(context, reflection);
        });
    });
    const categoryMap = {};
    class CategoryMapSerializerComponent extends typedoc_1.SerializerComponent {
        serializeGroup(instance) {
            // Note: `instance instanceof ProjectReflection` can not be used!
            return instance
                && typeof instance === 'object'
                && typeof instance.isProject === 'function'
                && instance.isProject();
        }
        supports(item) {
            return true;
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        toObject(projectReflect, obj = {}) {
            const mergedCategoryMap = {};
            for (const categoryInfo of Object.values(categoryMap)) {
                // eslint-disable-next-line prefer-arrow-callback
                const categoryKey = JSON.stringify(categoryInfo, function excludeItems(k, v) {
                    if (this === categoryInfo && k === 'items' && v === categoryInfo.items) {
                        return undefined;
                    }
                    else {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return v;
                    }
                });
                if (categoryKey in mergedCategoryMap) {
                    mergedCategoryMap[categoryKey].items.push(...categoryInfo.items);
                }
                else {
                    mergedCategoryMap[categoryKey] = categoryInfo;
                }
            }
            return {
                ...obj,
                ccCategories: Object.values(mergedCategoryMap),
            };
        }
    }
    app.serializer.addSerializer(new CategoryMapSerializerComponent(app.serializer));
    function onCreateReflection(_context, reflection, node) {
        handleDeclarationCategory(_context, reflection, node);
        handleTagLegacyPublic(_context, reflection, node);
    }
    function onCreateSignature(_context, reflection, node) {
        handleTagLegacyPublic(_context, reflection, node);
    }
    function handleDeclarationCategory(_context, reflection, node) {
        if (!node) {
            return;
        }
        switch (reflection.kind) {
            case typedoc_1.ReflectionKind.Class:
            case typedoc_1.ReflectionKind.Interface:
            case typedoc_1.ReflectionKind.Enum:
            case typedoc_1.ReflectionKind.Variable:
            case typedoc_1.ReflectionKind.Function:
            case typedoc_1.ReflectionKind.Namespace:
                break;
            default:
                return;
        }
        // Prefer the already existing category tag.
        if (reflection.comment?.hasTag(TAG_NAME_CC_CATEGORY)) {
            return;
        }
        const sourceFile = node.getSourceFile();
        const sourceFileName = sourceFile.fileName;
        const category = queryCategory(sourceFileName);
        if (!category) {
            return;
        }
        setCategory(reflection.id, category.id, category.config);
    }
    function handleTagLegacyPublic(_context, reflection, node) {
        const { comment } = reflection;
        if (!comment) {
            return;
        }
        if (!comment.hasTag(TAG_NAME_LEGACY_PUBLIC)) {
            return;
        }
        comment.removeTags(TAG_NAME_LEGACY_PUBLIC);
        comment.tags.push(new typedoc_1.CommentTag('deprecated', undefined, 'This key is reserved for internal usage.'));
    }
    function setCategory(reflectionId, categoryId, categoryConfig) {
        (categoryMap[categoryId] ?? (categoryMap[categoryId] = {
            ...categoryConfig,
            items: [],
        })).items.push(reflectionId);
    }
    const categoryConfigCache = {};
    function queryCategory(sourceFileName) {
        for (const parentDir of forEachParentDir(sourceFileName)) {
            if (!(parentDir in categoryConfigCache)) {
                const categoryConfig = tryReadCategoryConfigFile(parentDir);
                categoryConfigCache[parentDir] = categoryConfig;
            }
            const categoryConfig = categoryConfigCache[parentDir];
            if (!categoryConfig) {
                continue;
            }
            return {
                id: parentDir,
                config: categoryConfig,
            };
        }
        return '';
    }
    function* forEachParentDir(sourceFileName) {
        const normalized = path_1.default.normalize(sourceFileName);
        let currentDirName = path_1.default.dirname(normalized);
        while (currentDirName !== engineRoot) {
            yield currentDirName;
            currentDirName = path_1.default.dirname(currentDirName);
        }
    }
    function tryReadCategoryConfigFile(dir) {
        try {
            const categoryConfig = fs_extra_1.default.readJsonSync(path_1.default.join(dir, CATEGORY_CONFIG_FILE_NAME));
            return categoryConfig;
        }
        catch {
            return null;
        }
    }
    function handleLink(_context, reflection, node) {
        const comment = reflection.comment;
        if (!comment) {
            return;
        }
        let declarationReflection = null;
        if (reflection instanceof typedoc_1.DeclarationReflection) {
            declarationReflection = reflection;
        }
        else if (reflection instanceof typedoc_1.SignatureReflection) {
            declarationReflection = reflection.parent;
        }
        // The container reflection of this reflection if it's subjected to "search in container first":
        // classes, interface, enumeration
        // Especially namespace member is not subjected to such search.
        const isSubjectedToContainerSearch = (declarationReflection) => declarationReflection.kind === typedoc_1.ReflectionKind.Class
            || declarationReflection.kind === typedoc_1.ReflectionKind.Enum
            || declarationReflection.kind === typedoc_1.ReflectionKind.Interface;
        let containerSearchReflection = null;
        if (declarationReflection) {
            if (isSubjectedToContainerSearch(declarationReflection)) {
                containerSearchReflection = reflection;
            }
            else if (declarationReflection.parent
                && declarationReflection.parent instanceof typedoc_1.DeclarationReflection
                && isSubjectedToContainerSearch(declarationReflection.parent)) {
                containerSearchReflection = declarationReflection.parent;
            }
        }
        {
            const text = handleText(comment.text);
            if (text) {
                comment.text = text;
            }
        }
        {
            const text = handleText(comment.shortText);
            if (text) {
                comment.shortText = text;
            }
        }
        if (comment.tags) {
            for (const tag of comment.tags) {
                const text = handleText(tag.text);
                if (text) {
                    tag.text = text;
                }
            }
        }
        function handleText(text) {
            if (!text) {
                return '';
            }
            const getLocation = () => {
                if (reflection.sources) {
                    return reflection.sources[0].fileName;
                }
                else if (node) {
                    return node.getText();
                }
                else {
                    return `<unknown-location>`;
                }
            };
            const matches = text.matchAll(/\[\[`?([\w.]+)`?(?:\s*\|(.*))?\]\]/g);
            const replaces = [];
            for (const match of matches) {
                const full = match[0];
                const startsWithQuote = full.startsWith('[[`');
                const endsWithQuote = full.endsWith('`]]');
                if (startsWithQuote !== endsWithQuote) {
                    _context.logger.error(`Syntax error: ${full},`
                        + `referenced in ${getLocation()}`);
                    continue;
                }
                const path = match[1];
                const segments = path.split('.');
                if (segments.length === 0) {
                    continue;
                }
                const printUnableResolve = (iSegment) => {
                    _context.logger.warn(`Failed to resolve ${segments[iSegment]} in ${match[0]} `
                        + `referenced in ${!node ? '<unknown-location>' : node.getText()}`);
                };
                let targetReflection = resolveUnqualifiedReflection(segments[0]);
                if (!targetReflection) {
                    printUnableResolve(0);
                    continue;
                }
                if (segments.length > 1) {
                    for (let iSegment = 1; iSegment < segments.length; ++iSegment) {
                        const currentReflections = getAllRelatedReflections(targetReflection);
                        targetReflection = null;
                        let hasAtLeastOneContainer = false;
                        const segment = segments[iSegment];
                        for (const currentReflection of currentReflections) {
                            let realReflection = currentReflection;
                            if (realReflection instanceof typedoc_1.ReferenceReflection) {
                                realReflection = realReflection.getTargetReflectionDeep();
                            }
                            if ((realReflection.kind === typedoc_1.ReflectionKind.Variable ||
                                realReflection.kind === typedoc_1.ReflectionKind.Property) &&
                                realReflection instanceof typedoc_1.DeclarationReflection &&
                                realReflection.type &&
                                realReflection.type.type === 'reference' &&
                                realReflection.type.reflection) {
                                // [[game.init]] -> [[Game.init]]
                                realReflection = realReflection.type.reflection;
                            }
                            if (!(realReflection instanceof typedoc_1.ContainerReflection)) {
                                continue;
                            }
                            hasAtLeastOneContainer = true;
                            if (!realReflection.children) {
                                continue;
                            }
                            targetReflection = realReflection.children.find((child) => child.name === segment) ?? null;
                            if (targetReflection) {
                                break;
                            }
                        }
                        if (!targetReflection) {
                            if (!hasAtLeastOneContainer) {
                                _context.logger.error(`${segments.slice(0, iSegment).join('.')} in ${match[0]} `
                                    + `is not a container, referenced in ${getLocation()}`);
                            }
                            else {
                                printUnableResolve(iSegment);
                            }
                            break;
                        }
                    }
                }
                if (!targetReflection) {
                    continue; // We should have diagnosis
                }
                const matchIndex = match.index ?? 0;
                replaces.push({
                    index: matchIndex,
                    length: match[0].length,
                    reflection: targetReflection,
                    linkText: match[2]?.trim(),
                });
            }
            if (replaces.length === 0) {
                return '';
            }
            let finalText = '';
            let iLast = 0;
            for (const { index, length, reflection, linkText } of replaces) {
                finalText += text.substring(iLast, index);
                finalText += `[[${reflection.id}${linkText ? ` | ${linkText}` : ''}]]`;
                iLast = index + length;
            }
            if (iLast !== text.length) {
                finalText += text.substring(iLast);
            }
            return finalText;
        }
        function resolveUnqualifiedReflection(name) {
            let targetReflection = null;
            if (containerSearchReflection) {
                for (const reflection of getAllRelatedReflections(containerSearchReflection)) {
                    if (reflection instanceof typedoc_1.ContainerReflection && reflection.children) {
                        const child = reflection.children.find((child) => child.name === name);
                        if (child) {
                            targetReflection = child;
                        }
                    }
                }
            }
            if (!targetReflection) {
                let parent = reflection.parent ?? null;
                while (parent) {
                    if (parent instanceof typedoc_1.ContainerReflection &&
                        parent.children &&
                        ((parent.kind === typedoc_1.ReflectionKind.Namespace
                            || parent.kind === typedoc_1.ReflectionKind.Module
                            || parent.kind === typedoc_1.ReflectionKind.Project))) {
                        for (const childReflection of parent.children) {
                            if (childReflection.name === name) {
                                targetReflection = childReflection;
                                break;
                            }
                        }
                    }
                    parent = parent.parent ?? null;
                }
            }
            return targetReflection;
        }
        function getAllRelatedReflections(reflection) {
            const relatedReflections = (reflection.parent && reflection.parent instanceof typedoc_1.ContainerReflection && reflection.parent.children)
                ? reflection.parent.children.filter(({ name }) => reflection.name === name)
                : [reflection];
            for (const reflection of relatedReflections) {
                let currentReflection = reflection;
                if (currentReflection.kind !== typedoc_1.ReflectionKind.Class) {
                    continue;
                }
                while (true) {
                    if (!(currentReflection instanceof typedoc_1.DeclarationReflection) || currentReflection.kind !== typedoc_1.ReflectionKind.Class) {
                        break;
                    }
                    const extendedType = currentReflection.extendedTypes?.[0];
                    if (!extendedType) {
                        break;
                    }
                    if (extendedType.type !== 'reference') {
                        break;
                    }
                    // @ts-ignore
                    const extendedReflection = extendedType.reflection;
                    if (!extendedReflection) {
                        break;
                    }
                    if (extendedReflection.parent && extendedReflection.parent instanceof typedoc_1.ContainerReflection &&
                        extendedReflection.parent.children) {
                        const ns = extendedReflection.parent.children.find((r) => {
                            return r.name === extendedReflection.name && r.kind === typedoc_1.ReflectionKind.Namespace;
                        });
                        if (ns) {
                            relatedReflections.push(ns);
                        }
                    }
                    currentReflection = extendedReflection;
                }
                break;
            }
            return relatedReflections;
        }
    }
}
exports.load = load;
//# sourceMappingURL=plugin.js.map