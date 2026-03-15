import { productType } from "./product";
import postType from "./post";
import { type SchemaTypeDefinition } from "sanity";

export const schemaTypes: SchemaTypeDefinition[] = [productType, postType];