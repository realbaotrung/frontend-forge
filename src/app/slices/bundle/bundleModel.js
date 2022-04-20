export class BundleModel {
  constructor(id, name, path, description, versionRevit, bundleCategory, bundleCategoryId) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.description = description;
    this.versionRevit = versionRevit;
    this.bundleCategory = bundleCategory;
    this.bundleCategoryId = bundleCategoryId;
  }
}
