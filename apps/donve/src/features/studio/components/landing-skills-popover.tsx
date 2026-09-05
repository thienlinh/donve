import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Empty, EmptyTitle } from "@dv/ui/components/shadcn/empty";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "@dv/ui/components/shadcn/popover";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import { fetchLandingSkills, setLandingSkill } from "@/features/skills/api";
import { skillKeys } from "@/features/skills/query-keys";
import * as m from "@/paraglide/messages.js";

/**
 * Studio's "skills for this page" control (FR-F) — lets a user override the org default
 * for just this landing page while iterating in Studio, without touching the org-wide
 * default reflected in the Skills settings screen.
 */
export function LandingSkillsPopover({
  landingPageId
}: {
  landingPageId: string;
}) {
  const queryClient = useQueryClient();
  const {
    data: skills,
    isPending,
    error
  } = useQuery({
    queryKey: skillKeys.forLanding(landingPageId),
    queryFn: () => fetchLandingSkills(landingPageId)
  });

  const toggle = useMutation({
    mutationFn: ({ skillId, enabled }: { skillId: string; enabled: boolean }) =>
      setLandingSkill(landingPageId, skillId, enabled),
    onMutate: async ({ skillId, enabled }) => {
      await queryClient.cancelQueries({
        queryKey: skillKeys.forLanding(landingPageId)
      });
      const previous = queryClient.getQueryData(
        skillKeys.forLanding(landingPageId)
      );
      queryClient.setQueryData(
        skillKeys.forLanding(landingPageId),
        (current: typeof skills) =>
          current?.map((skill) =>
            skill.id === skillId ? { ...skill, enabled } : skill
          )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          skillKeys.forLanding(landingPageId),
          context.previous
        );
      }
      toast.add({ title: m.studioSkillsToggleErrorToast(), type: "error" });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: skillKeys.forLanding(landingPageId)
      })
  });

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="sm">
            <Sparkles /> {m.studioSkillsButton()}
          </Button>
        }
      />
      <PopoverContent align="end">
        <PopoverHeader>
          <PopoverTitle>{m.studioSkillsPopoverTitle()}</PopoverTitle>
          <PopoverDescription>
            {m.studioSkillsPopoverDescription()}
          </PopoverDescription>
        </PopoverHeader>
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> {m.commonLoading()}
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive">
            {m.studioSkillsLoadErrorTitle()}
          </p>
        )}
        {skills && skills.length === 0 && (
          <Empty className="border-none p-2">
            <EmptyTitle className="text-sm">
              {m.studioSkillsEmptyTitle()}
            </EmptyTitle>
          </Empty>
        )}
        {skills && skills.length > 0 && (
          <ul className="flex flex-col gap-1">
            {skills.map((skill) => (
              <li key={skill.id}>
                <label className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent">
                  <Checkbox
                    checked={skill.enabled}
                    onCheckedChange={(checked) =>
                      toggle.mutate({
                        skillId: skill.id,
                        enabled: checked
                      })
                    }
                  />
                  <span className="flex-1 truncate text-sm">{skill.name}</span>
                  {skill.orgId === null && (
                    <Badge variant="secondary">{m.skillTypePlatform()}</Badge>
                  )}
                </label>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
