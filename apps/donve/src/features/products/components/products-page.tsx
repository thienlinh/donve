import type { Product } from "@dv/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@dv/ui/components/shadcn/alert-dialog";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Trash2 } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/pagination";
import { QueryState } from "@/components/query-state";
import { getTotalPages, usePagedQuery } from "@/hooks/use-paged-query";
import * as m from "@/paraglide/messages.js";

import { fetchProductsPage, removeProduct } from "../api";
import { productKeys } from "../query-keys";
import { ProductFormDialog, productTypeLabels } from "./product-form-dialog";

const PAGE_SIZE = 20;

export function ProductsPage() {
  const { setPage, query } = usePagedQuery(PAGE_SIZE);
  const { data, isPending, error } = useQuery({
    queryKey: productKeys.listPage(query),
    queryFn: () => fetchProductsPage(query)
  });
  const products = data?.products;
  const totalPages = getTotalPages(data);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.productsTitle()}</CardTitle>
          <CardDescription>{m.productsDescription()}</CardDescription>
          <CardAction>
            <ProductFormDialog />
          </CardAction>
        </CardHeader>
        <CardContent>
          <QueryState
            isPending={isPending}
            error={error}
            isEmpty={products?.length === 0}
            errorTitle={m.productsLoadErrorTitle()}
            emptyTitle={m.productsEmptyTitle()}
            emptyIcon={<Package />}
          />
          {products && products.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.productsColumnName()}</TableHead>
                  <TableHead>{m.productsColumnType()}</TableHead>
                  <TableHead>{m.productsColumnPrice()}</TableHead>
                  <TableHead className="text-end">
                    {m.productsColumnActions()}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </TableBody>
            </Table>
          )}
          {data && (
            <Pagination
              page={data.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const remove = useMutation({
    mutationFn: () => removeProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.productsRemoveErrorToast(), type: "error" })
  });

  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant="secondary">{productTypeLabels[product.type]}</Badge>
      </TableCell>
      <TableCell className="font-mono text-xs">
        {product.price.toLocaleString()}
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        <ProductFormDialog product={product} />
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.productsRemoveConfirmTitle({
                  name: product.name
                })}
              >
                <Trash2 className="text-destructive" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {m.productsRemoveConfirmTitle({ name: product.name })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {m.productsRemoveConfirmBody()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={remove.isPending}
                onClick={() => remove.mutate()}
              >
                {remove.isPending
                  ? m.commonLoading()
                  : m.productsRemoveConfirmAction()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
