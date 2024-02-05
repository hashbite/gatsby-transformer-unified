export const importCache: Map<string, any> = new Map();

export async function cachedImport<Type>(packageName: string): Promise<Type> {
  if (importCache.has(packageName)) {
    return importCache.get(packageName) as Type;
  }
  try {
    const importedPackage: Type = await import(packageName);
    if (!importedPackage) {
      throw new Error(
        `Package ${packageName} got imported, but it is empty. This is probably a module resolution issue.`
      );
    }
    importCache.set(packageName, importedPackage);
    return importedPackage;
  } catch (err) {
    console.error(err);
    throw new Error(
      `Unable to import package ${packageName}. Check error in console.`
    );
  }
}
