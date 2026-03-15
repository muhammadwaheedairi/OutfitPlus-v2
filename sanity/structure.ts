import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("OutfitPlus Content")
    .items([
      S.listItem()
        .title("Products")
        .child(
          S.documentList()
            .title("All Products")
            .filter('_type == "product"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["product"].includes(listItem.getId() ?? "")
      ),
    ]);