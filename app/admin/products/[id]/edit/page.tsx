"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import adminApi from "@/lib/api/admin-client";
import type { Product } from "@/types/product";

type Category = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
};

type ProductImageAsset = {
  url: string;
  publicId: string;
};

type AdminProduct = Product & {
  imageAssets?: ProductImageAsset[];
};

type ProductListResponse = {
  success: boolean;
  products: AdminProduct[];
};

type UploadSignatureResponse = {
  success: boolean;
  data: {
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
    publicId: string;
    overwrite: boolean;
  };
};

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  bytes: number;
  format: string;
};

type EditableImage = {
  key: string;
  kind: "existing" | "new";
  url: string;
  publicId: string;
  file?: File;
  previewUrl?: string;
};

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type CategoriesResponse = {
  success: boolean;
  categories: Category[];
};

type ProductForm = {
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  isFeatured: boolean;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 disabled:bg-neutral-100";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      `Request failed (${error.response?.status ?? "network error"}).`
    );
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    slug: "",
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "0",
    isFeatured: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadedProduct, setLoadedProduct] = useState<AdminProduct | null>(null);
  const [images, setImages] = useState<EditableImage[]>([]);
  const imagesRef = useRef<EditableImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        adminApi.get<ProductListResponse>("/products", {
          params: { limit: 1000 },
        }),
        adminApi.get<CategoriesResponse>("/categories"),
      ]);

      if (
        !productResponse.data?.success ||
        !Array.isArray(productResponse.data.products)
      ) {
        throw new Error("Invalid products response.");
      }

      if (
        !categoryResponse.data?.success ||
        !Array.isArray(categoryResponse.data.categories)
      ) {
        throw new Error("Invalid categories response.");
      }

      const product = productResponse.data.products.find(
        (item) => item._id === id,
      );

      if (!product) {
        throw new Error(
          "Product not found. Return to the product list and try again.",
        );
      }

      setLoadedProduct(product);
      setCategories(categoryResponse.data.categories);
      setImages(
        (product.imageAssets ?? []).map((asset, index) => ({
          key: `existing-${asset.publicId}-${index}`,
          kind: "existing" as const,
          url: asset.url,
          publicId: asset.publicId,
        })),
      );

      setForm({
        slug: product.slug ?? "",
        nameEn: product.name?.en ?? "",
        nameAr: product.name?.ar ?? "",
        descriptionEn: product.description?.en ?? "",
        descriptionAr: product.description?.ar ?? "",
        category:
          typeof product.category === "string"
            ? product.category
            : (product.category?._id ?? ""),
        price: String(product.price ?? ""),
        originalPrice:
          product.originalPrice != null ? String(product.originalPrice) : "",
        stock: String(product.stock ?? 0),
        isFeatured: Boolean(product.isFeatured),
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/admin/login");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (image.kind === "new" && image.previewUrl) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, []);

  function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError("");

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setError(`You can add a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const acceptedFiles: File[] = [];

    for (const file of selectedFiles) {
      if (acceptedFiles.length >= remainingSlots) {
        setError(`You can add a maximum of ${MAX_IMAGES} images.`);
        break;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError(`${file.name}: only JPEG, PNG and WebP images are allowed.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`${file.name}: image size must be 5 MB or smaller.`);
        continue;
      }

      acceptedFiles.push(file);
    }

    const newImages: EditableImage[] = acceptedFiles.map((file) => ({
      key: crypto.randomUUID(),
      kind: "new",
      url: "",
      publicId: "",
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);
  }

  function removeImage(key: string) {
    setImages((current) => {
      const target = current.find((image) => image.key === key);
      if (target?.kind === "new" && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((image) => image.key !== key);
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const reordered = [...current];
      [reordered[index], reordered[nextIndex]] = [
        reordered[nextIndex],
        reordered[index],
      ];
      return reordered;
    });
  }

  async function uploadProductImage(
    image: EditableImage,
  ): Promise<EditableImage> {
    if (image.publicId) return image;
    if (!image.file) throw new Error("Selected image file is missing.");

    const signatureResponse = await adminApi.post<UploadSignatureResponse>(
      "/products/upload-signature",
      {},
    );

    if (!signatureResponse.data?.success || !signatureResponse.data.data) {
      throw new Error("Could not authorize image upload.");
    }

    const { timestamp, signature, cloudName, apiKey, publicId, overwrite } =
      signatureResponse.data.data;

    const uploadForm = new FormData();
    uploadForm.append("file", image.file);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("signature", signature);
    uploadForm.append("public_id", publicId);
    uploadForm.append("overwrite", String(overwrite));

    const uploadResponse = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      uploadForm,
      { timeout: 120_000 },
    );

    if (!uploadResponse.data?.public_id || !uploadResponse.data?.secure_url) {
      throw new Error(`Cloudinary did not confirm ${image.file.name}.`);
    }

    return {
      ...image,
      publicId: uploadResponse.data.public_id,
      url: uploadResponse.data.secure_url,
    };
  }

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const slug = form.slug.trim();
    const price = Number(form.price);
    const originalPrice =
      form.originalPrice.trim() === "" ? undefined : Number(form.originalPrice);
    const stock = Number(form.stock);

    if (
      !form.nameEn.trim() ||
      !form.nameAr.trim() ||
      !form.descriptionEn.trim() ||
      !form.descriptionAr.trim() ||
      !form.category
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Slug must contain lowercase letters, numbers, and hyphens.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (
      originalPrice !== undefined &&
      (!Number.isFinite(originalPrice) || originalPrice < 0)
    ) {
      setError("Enter a valid original price.");
      return;
    }

    if (originalPrice !== undefined && originalPrice < price) {
      setError(
        "Original price should be equal to or greater than selling price.",
      );
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      const hasLegacyImages =
        (loadedProduct?.images?.length ?? 0) > 0 &&
        (loadedProduct?.imageAssets?.length ?? 0) === 0;

      let uploadedImages = images;
      if (!hasLegacyImages) {
        setUploadingImages(true);
        uploadedImages = [];
        for (const image of images) {
          const uploaded = await uploadProductImage(image);
          uploadedImages.push(uploaded);
          setImages((current) =>
            current.map((item) =>
              item.key === uploaded.key ? uploaded : item,
            ),
          );
        }
        setImages(uploadedImages);
        setUploadingImages(false);
      }

      const payload = {
        slug,
        name: {
          en: form.nameEn.trim(),
          ar: form.nameAr.trim(),
        },
        description: {
          en: form.descriptionEn.trim(),
          ar: form.descriptionAr.trim(),
        },
        category: form.category,
        price,
        ...(originalPrice !== undefined ? { originalPrice } : {}),
        stock,
        isFeatured: form.isFeatured,
        ...(hasLegacyImages
          ? {}
          : { imagePublicIds: uploadedImages.map((image) => image.publicId) }),
      };

      const response = await adminApi.patch(
        `/products/${encodeURIComponent(id)}`,
        payload,
      );

      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Product update failed.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.replace("/admin/login");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setUploadingImages(false);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 p-8">Loading product...</main>
    );
  }

  if (!loadedProduct) {
    return (
      <main className="min-h-screen bg-neutral-50 p-8">
        <p role="alert" className="text-red-700">
          {error || "Product could not be loaded."}
        </p>
        <button
          type="button"
          onClick={() => void loadData()}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          Retry
        </button>
        <Link href="/admin/products" className="ml-3 text-sm underline">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back to products
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-neutral-900">
          Edit product
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Update {loadedProduct.name.en}.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8 rounded-xl border border-neutral-200 bg-white p-5 sm:p-8"
        >
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <section>
            <h2 className="text-lg font-semibold">Product information</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Product name (English)">
                <input
                  required
                  maxLength={150}
                  className={inputClass}
                  value={form.nameEn}
                  onChange={(e) => updateField("nameEn", e.target.value)}
                />
              </Field>

              <Field label="Product name (Arabic)">
                <input
                  required
                  maxLength={150}
                  dir="rtl"
                  className={inputClass}
                  value={form.nameAr}
                  onChange={(e) => updateField("nameAr", e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Slug">
                  <input
                    required
                    maxLength={180}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    className={inputClass}
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Description (English)">
                <textarea
                  required
                  rows={4}
                  className={inputClass}
                  value={form.descriptionEn}
                  onChange={(e) => updateField("descriptionEn", e.target.value)}
                />
              </Field>

              <Field label="Description (Arabic)">
                <textarea
                  required
                  rows={4}
                  dir="rtl"
                  className={inputClass}
                  value={form.descriptionAr}
                  onChange={(e) => updateField("descriptionAr", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-6">
            <div>
              <h2 className="text-lg font-semibold">Product images</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Add up to 5 JPEG, PNG or WebP images. Each image must be 5 MB or
                smaller. The first image is used as the primary image.
              </p>
            </div>

            {(loadedProduct.imageAssets?.length ?? 0) === 0 &&
            (loadedProduct.images?.length ?? 0) > 0 ? (
              <div className="mt-4 space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900">
                  This product has older image URLs without Cloudinary public
                  IDs. They are preserved as-is. Image editing is disabled for
                  this product until those images are migrated.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {loadedProduct.images.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="overflow-hidden rounded-lg border bg-white"
                    >
                      <img
                        src={url}
                        alt={`Existing product image ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-5 py-7 text-center transition hover:border-neutral-800">
                  <span className="text-sm font-medium text-neutral-800">
                    Choose product images
                  </span>
                  <span className="mt-1 text-xs text-neutral-500">
                    {images.length} of {MAX_IMAGES} images selected
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={saving || images.length >= MAX_IMAGES}
                    onChange={handleImageSelection}
                    className="sr-only"
                  />
                </label>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                      <div
                        key={image.key}
                        className="overflow-hidden rounded-lg border bg-white"
                      >
                        <img
                          src={
                            image.kind === "new" ? image.previewUrl : image.url
                          }
                          alt={`Product image ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="space-y-2 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs text-neutral-600">
                              {index === 0
                                ? "Primary image"
                                : `Image ${index + 1}`}
                            </span>
                            <span className="shrink-0 text-[11px] text-neutral-500">
                              {image.kind === "existing"
                                ? "Saved"
                                : image.publicId
                                  ? "Uploaded"
                                  : "New"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => moveImage(index, -1)}
                              disabled={saving || index === 0}
                              className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                            >
                              Move left
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 1)}
                              disabled={saving || index === images.length - 1}
                              className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                            >
                              Move right
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(image.key)}
                              disabled={saving}
                              className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <section className="border-t border-neutral-200 pt-6">
            <h2 className="text-lg font-semibold">Category and pricing</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <select
                  required
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name.en} — {category.name.ar}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Selling price (₹)">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </Field>

              <Field label="Original price (₹)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.originalPrice}
                  onChange={(e) => updateField("originalPrice", e.target.value)}
                />
              </Field>

              <Field label="Stock quantity">
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="size-4"
              />
              <span className="text-sm font-medium">Featured product</span>
            </label>
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-neutral-200 pt-6 sm:flex-row">
            <Link
              href="/admin/products"
              className="rounded-lg border border-neutral-300 px-5 py-3 text-center text-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {saving
                ? uploadingImages
                  ? "Uploading images..."
                  : "Saving changes..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
    </div>
  );
}
