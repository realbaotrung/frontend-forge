export class BundleModel {
  constructor(
    id,
    name,
    path,
    description,
    versionRevit,
    bundleCategory,
    bundleCategoryId,
    requireBase,
    requireInput,
    requireCallBack,
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.description = description;
    this.versionRevit = versionRevit;
    this.bundleCategory = bundleCategory;
    this.bundleCategoryId = bundleCategoryId;
    this.requireBase = requireBase;
    this.requireInput = requireInput;
    this.requireCallBack = requireCallBack;
  }
}
