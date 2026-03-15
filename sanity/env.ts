function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

export const env = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
  ),
  NEXT_PUBLIC_SANITY_DATASET: assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
  ),
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01",
};
