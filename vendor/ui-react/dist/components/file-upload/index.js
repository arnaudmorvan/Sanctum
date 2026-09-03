"use client";
import { Button } from '../../chunk-GHV47RCM.js';
import '../../chunk-RNXO7W2J.js';
import { FieldShell } from '../../chunk-AL57HMNZ.js';
import { CloseIcon } from '../../chunk-IG7FBZVM.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { FileUpload as FileUpload$1 } from '@ark-ui/react/file-upload';
import { UploadCloud, FileVideo, FileHeadphoneIcon, FileType2, FileArchiveIcon, FileJson2Icon, FileTextIcon, FileIcon } from 'lucide-react';
import { match, P } from 'ts-pattern';
import { jsxs, jsx } from 'react/jsx-runtime';

var FileUpload = ({
  value,
  onChange,
  accept,
  maxFiles,
  maxFileSize,
  directory,
  invalid,
  disabled,
  required,
  size = "md",
  color,
  name,
  id,
  ref,
  label,
  description,
  error,
  withButton = false,
  hint = withButton ? "Drag & drop files here, or" : "Drop files here or click to browse",
  className,
  classNames,
  testId
}) => {
  const isInvalid = invalid || error != null;
  return /* @__PURE__ */ jsxs(
    FileUpload$1.Root,
    {
      acceptedFiles: value,
      accept,
      maxFiles: maxFiles ?? 1,
      maxFileSize,
      directory,
      disabled,
      required,
      invalid: isInvalid,
      name,
      id,
      onFileChange: onChange ? (d) => onChange(d.acceptedFiles) : void 0,
      "data-color": color,
      className: cn("flex flex-col gap-3 grow", className, classNames?.root),
      children: [
        /* @__PURE__ */ jsx(
          FieldShell,
          {
            label,
            description,
            error,
            required,
            disabled,
            size,
            className: classNames?.field,
            children: /* @__PURE__ */ jsxs(
              FileUpload$1.Dropzone,
              {
                ...props({ "data-testid": testId }),
                className: cn(
                  "flex flex-col items-center justify-center gap-2 rounded-input border border-dashed p-6 text-center",
                  "border-gray-light-300 dark:border-gray-dark-700",
                  "cursor-pointer transition-colors",
                  "data-dragging:border-(--c-solid) data-dragging:bg-(--c-solid)/5 data-dragging:border-solid",
                  "text-gray-light-500 dark:text-gray-dark-400 data-invalid:border-red-500 data-invalid:text-red-500",
                  "data-disabled:cursor-not-allowed data-disabled:opacity-60",
                  "group",
                  classNames?.dropzone
                ),
                children: [
                  /* @__PURE__ */ jsx(UploadCloud, { className: "size-8", strokeWidth: 1, "aria-hidden": true }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: hint }),
                  withButton && /* @__PURE__ */ jsx(FileUpload$1.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      color: isInvalid ? "red" : void 0,
                      size,
                      type: "button",
                      disabled,
                      children: "Browse files"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(FileUpload$1.HiddenInput, { ref })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(FileUpload$1.ItemGroup, { className: cn("flex flex-col gap-2", classNames?.itemGroup), children: /* @__PURE__ */ jsx(FileUpload$1.Context, { children: (api) => api.acceptedFiles.map((file) => /* @__PURE__ */ jsxs(
          FileUpload$1.Item,
          {
            file,
            className: cn(
              "flex items-center gap-1 rounded-input border p-2",
              "border-gray-light-200 dark:border-gray-dark-800",
              classNames?.item
            ),
            children: [
              /* @__PURE__ */ jsx(FileContent, { file }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx(FileUpload$1.ItemName, { className: "truncate text-sm" }),
                /* @__PURE__ */ jsx(FileUpload$1.ItemSizeText, { className: "text-xs text-gray-light-600 dark:text-gray-dark-400" })
              ] }),
              /* @__PURE__ */ jsx(
                FileUpload$1.ItemDeleteTrigger,
                {
                  "aria-label": `Remove ${file.name}`,
                  className: cn(
                    "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm me-1",
                    "text-gray-light-500 dark:text-gray-dark-400",
                    "transition-colors hover:bg-gray-light-100 hover:text-gray-light-900",
                    "dark:hover:bg-gray-dark-800 dark:hover:text-gray-dark-25",
                    "[&_svg]:size-3.5"
                  ),
                  children: /* @__PURE__ */ jsx(CloseIcon, {})
                }
              )
            ]
          },
          `${file.name}-${file.lastModified}`
        )) }) })
      ]
    }
  );
};
function FileContent({ file }) {
  return match(file).with({ type: P.string.startsWith("image/") }, () => /* @__PURE__ */ jsx(FileUpload$1.ItemPreview, { type: "image/*", children: /* @__PURE__ */ jsx(FileUpload$1.ItemPreviewImage, { className: "size-9 rounded object-cover" }) })).with({ type: P.string.startsWith("video/") }, () => /* @__PURE__ */ jsx(
    FileUpload$1.ItemPreview,
    {
      type: "video/*",
      className: "size-9 rounded object-cover flex items-center justify-center",
      children: /* @__PURE__ */ jsx(FileVideo, { strokeWidth: 1 })
    }
  )).with({ type: P.string.startsWith("audio/") }, () => /* @__PURE__ */ jsx(
    FileUpload$1.ItemPreview,
    {
      type: "audio/*",
      className: "size-9 rounded object-cover flex items-center justify-center",
      children: /* @__PURE__ */ jsx(FileHeadphoneIcon, { strokeWidth: 1 })
    }
  )).with({ type: P.string.startsWith("font/") }, () => /* @__PURE__ */ jsx(
    FileUpload$1.ItemPreview,
    {
      type: "font/*",
      className: "size-9 rounded object-cover flex items-center justify-center",
      children: /* @__PURE__ */ jsx(FileType2, { strokeWidth: 1 })
    }
  )).with({ type: "application/zip" }, () => /* @__PURE__ */ jsx(
    FileUpload$1.ItemPreview,
    {
      type: "application/zip",
      className: "size-9 rounded object-cover flex items-center justify-center",
      children: /* @__PURE__ */ jsx(FileArchiveIcon, { strokeWidth: 1 })
    }
  )).with({ type: "application/json" }, () => /* @__PURE__ */ jsx(
    FileUpload$1.ItemPreview,
    {
      type: "application/json",
      className: "size-9 rounded object-cover flex items-center justify-center",
      children: /* @__PURE__ */ jsx(FileJson2Icon, { strokeWidth: 1 })
    }
  )).with({ type: P.union("application/pdf", P.string.startsWith("text")) }, () => /* @__PURE__ */ jsx(
    FileUpload$1.ItemPreview,
    {
      type: "application/pdf",
      className: "size-9 rounded object-cover flex items-center justify-center",
      children: /* @__PURE__ */ jsx(FileTextIcon, { strokeWidth: 1 })
    }
  )).otherwise(() => /* @__PURE__ */ jsx(FileUpload$1.ItemPreview, { className: "size-9 rounded object-cover flex items-center justify-center", children: /* @__PURE__ */ jsx(FileIcon, { strokeWidth: 1 }) }));
}

export { FileUpload };
