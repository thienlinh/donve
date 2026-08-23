import type { PromptTemplate, PromptTestRun } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchAiConnections } from "@/features/ai-connections/api";
import { aiConnectionKeys } from "@/features/ai-connections/query-keys";
import * as m from "@/paraglide/messages.js";

import { fetchPromptTestRuns, runPromptTest } from "../api";
import { promptTemplateKeys } from "../query-keys";

const LIGHTHOUSE_CATEGORIES = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo"
] as const;

/** Test bench (FR-F-04): run the template against a chosen model, score the output in a
 * Lighthouse sandbox, and compare any two past runs side by side. */
export function PromptTemplateTestBench({
  template
}: {
  template: PromptTemplate;
}) {
  const [connectionId, setConnectionId] = useState("platform");
  const [values, setValues] = useState<Record<string, string>>({});
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);

  const { data: connections } = useQuery({
    queryKey: aiConnectionKeys.list(),
    queryFn: fetchAiConnections
  });

  const { data: testRuns, refetch: refetchTestRuns } = useQuery({
    queryKey: promptTemplateKeys.testRuns(template.id),
    queryFn: () => fetchPromptTestRuns(template.id)
  });

  const runTest = useMutation({
    mutationFn: () => runPromptTest(template.id, { connectionId, values }),
    onSuccess: () => refetchTestRuns(),
    onError: () =>
      toast.add({ title: m.promptTemplateTestRunErrorToast(), type: "error" })
  });

  const first = compareIds
    ? testRuns?.find((run) => run.id === compareIds[0])
    : undefined;
  const second = compareIds
    ? testRuns?.find((run) => run.id === compareIds[1])
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-lg border border-input p-4">
        <h3 className="text-sm font-medium">
          {m.promptTemplateTestRunHeading()}
        </h3>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="test-connection">
            {m.promptTemplateConnectionLabel()}
          </Label>
          <NativeSelect
            id="test-connection"
            className="w-full max-w-sm"
            value={connectionId}
            onChange={(e) => setConnectionId(e.target.value)}
          >
            <NativeSelectOption value="platform">
              {m.promptTemplateConnectionPlatform()}
            </NativeSelectOption>
            <NativeSelectOption value="trial">
              {m.promptTemplateConnectionTrial()}
            </NativeSelectOption>
            {connections?.map((connection) => (
              <NativeSelectOption key={connection.id} value={connection.id}>
                {connection.provider} — {connection.defaultModel}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        {template.variables.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {template.variables.map((variable) => (
              <div key={variable.key} className="flex flex-col gap-1.5">
                <Label htmlFor={`var-${variable.key}`}>
                  {variable.label ?? variable.key}
                </Label>
                <Input
                  id={`var-${variable.key}`}
                  value={values[variable.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [variable.key]: e.target.value
                    }))
                  }
                />
              </div>
            ))}
          </div>
        )}
        <Button
          className="self-start"
          disabled={runTest.isPending}
          onClick={() => runTest.mutate()}
        >
          {runTest.isPending
            ? m.commonLoading()
            : m.promptTemplateRunTestButton()}
        </Button>
        {runTest.data && <TestRunSummary run={runTest.data} />}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">
          {m.promptTemplateHistoryHeading()}
        </h3>
        {!testRuns || testRuns.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.promptTemplateHistoryEmptyTitle()}</EmptyTitle>
              <EmptyDescription>
                {m.promptTemplateHistoryEmptyBody()}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-1">
            {testRuns.map((run) => (
              <li
                key={run.id}
                className="flex items-center justify-between gap-2 rounded-md border border-input px-3 py-2 text-xs"
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono">{run.model}</span>
                  <span className="text-muted-foreground">
                    {run.createdAt.toLocaleString()}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCompareIds((prev) => {
                      if (!prev) return [run.id, run.id];
                      if (prev[0] === run.id || prev[1] === run.id) return prev;
                      return [prev[1], run.id];
                    })
                  }
                >
                  {m.promptTemplateCompareSelect()}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {first && second && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">
            {m.promptTemplateCompareHeading()}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TestRunSummary run={first} />
            <TestRunSummary run={second} />
          </div>
        </div>
      )}
    </div>
  );
}

function TestRunSummary({ run }: { run: PromptTestRun }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-input p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono font-medium">{run.model}</span>
        <span className="text-muted-foreground">
          {run.createdAt.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {run.lighthouse ? (
          LIGHTHOUSE_CATEGORIES.map((category) => (
            <Badge key={category} variant="secondary">
              {category}: {run.lighthouse?.[category] ?? "—"}
            </Badge>
          ))
        ) : (
          <Badge variant="outline">
            {m.promptTemplateLighthouseUnavailable()}
          </Badge>
        )}
        <Badge variant="outline">
          {run.usage.inputTokens + run.usage.outputTokens} tok
        </Badge>
        <Badge variant="outline">{run.usage.creditCost} credits</Badge>
      </div>
      <pre className="max-h-56 overflow-auto rounded bg-muted p-2 whitespace-pre-wrap">
        {run.outputHtml}
      </pre>
    </div>
  );
}
