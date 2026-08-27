import { can } from "@dv/auth/permissions";
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
import { Card, CardHeader, CardTitle } from "@dv/ui/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { FileQuestion, Trash2 } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import {
  useActiveOrganizationQuery,
  useSessionQuery
} from "@/features/auth/queries";
import * as m from "@/paraglide/messages.js";

import { fetchPromptTemplates, removePromptTemplate } from "../api";
import { promptTemplateKeys } from "../query-keys";
import { PromptTemplateCompilePreview } from "./prompt-template-compile-preview";
import { PromptTemplateEditor } from "./prompt-template-editor";
import { PromptTemplateTestBench } from "./prompt-template-test-bench";

// Same split-file reasoning as studio-page.tsx: this component is the route's `component`,
// split into its own module, so `getRouteApi` avoids a circular import with the route file.
const routeApi = getRouteApi("/_authenticated/prompt-templates/$id");

export function PromptTemplateDetailPage() {
  const { id } = routeApi.useParams();
  const navigate = routeApi.useNavigate();
  const { data: session } = useSessionQuery();
  const { data: activeOrganization } = useActiveOrganizationQuery();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage = myMembership
    ? can(myMembership.role, "promptSkillsTenant")
    : false;

  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // No GET /prompt-templates/:id route exists — the list is the only source, cached by
  // promptTemplateKeys.list() from the list page this was navigated in from.
  const {
    data: templates,
    isPending,
    error
  } = useQuery({
    queryKey: promptTemplateKeys.list(),
    queryFn: fetchPromptTemplates
  });

  const remove = useMutation({
    mutationFn: () => removePromptTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promptTemplateKeys.list() });
      navigate({ to: "/prompt-templates" });
    },
    onError: () =>
      toast.add({ title: m.promptTemplateRemoveErrorToast(), type: "error" })
  });

  const template = templates?.find((t) => t.id === id);

  if (isPending || error || !template) {
    return (
      <div className="p-6">
        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={!isPending && !error}
          errorTitle={m.promptTemplatesLoadErrorTitle()}
          emptyTitle={m.promptTemplateNotFoundTitle()}
          emptyIcon={<FileQuestion />}
        />
      </div>
    );
  }

  const isPlatform = template.orgId === null;
  const isEditable = canManage && !isPlatform;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="font-mono text-lg">{template.slug}</CardTitle>
            <Badge variant={isPlatform ? "secondary" : "outline"}>
              {isPlatform ? m.skillTypePlatform() : m.skillTypeTenant()}
            </Badge>
            <Badge variant="outline">v{template.version}</Badge>
          </div>
          {isEditable && (
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={
                  <Button variant="ghost" size="sm">
                    <Trash2 className="text-destructive" />
                    {m.promptTemplateRemoveAction()}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {m.promptTemplateRemoveConfirmTitle()}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {m.promptTemplateRemoveConfirmBody()}
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
                      : m.promptTemplateRemoveAction()}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue={isEditable ? "edit" : "compile"}>
        <TabsList>
          {isEditable && (
            <TabsTrigger value="edit">{m.promptTemplateTabEdit()}</TabsTrigger>
          )}
          <TabsTrigger value="compile">
            {m.promptTemplateTabCompile()}
          </TabsTrigger>
          <TabsTrigger value="test-bench">
            {m.promptTemplateTabTestBench()}
          </TabsTrigger>
        </TabsList>
        {isEditable && (
          <TabsContent value="edit">
            <PromptTemplateEditor template={template} />
          </TabsContent>
        )}
        <TabsContent value="compile">
          <PromptTemplateCompilePreview template={template} />
        </TabsContent>
        <TabsContent value="test-bench">
          <PromptTemplateTestBench template={template} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
