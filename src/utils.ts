export const importCache: Map<string, any> = new Map();

export async function cachedImport<Type>(packageName: string): Promise<Type> {
  if (importCache.has(packageName)) {
    return importCache.get(packageName) as Type;
  }
  const importedPackage: Type = await import(packageName);
  importCache.set(packageName, importedPackage);
  return importedPackage;
}
