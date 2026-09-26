"use client";

import { useState } from "react";
import {
  Database,
  Download,
  Headphones,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WEEKDAY_LABELS } from "@/lib/constants";
import { useFocusStore } from "@/lib/store/focus-store";
import { cn, createId } from "@/lib/utils";

/**
 * Settings.
 *
 * Everything here writes straight through to the store (and therefore
 * localStorage) on change — there is no save button by design, so a half-edited
 * checklist can never be lost.
 */
export default function SettingsPage() {
  const { state, actions } = useFocusStore();
  const { settings } = state;
  const [newCheck, setNewCheck] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newMusicLabel, setNewMusicLabel] = useState("");
  const [newMusicUrl, setNewMusicUrl] = useState("");

  const exportState = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `lockin-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };

  const toggleWorkday = (day: number) => {
    const next = settings.workdays.includes(day)
      ? settings.workdays.filter((entry) => entry !== day)
      : [...settings.workdays, day].sort();
    actions.updateSettings({ workdays: next });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Settings"
        description="Appearance, targets, and focus rituals. Changes apply immediately."
      />

      <AppearanceSettings />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Profile and targets</CardTitle>
            <CardDescription>
              Your daily target sets the bar the dashboard measures plans against
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={settings.displayName}
                onChange={(event) =>
                  actions.updateSettings({ displayName: event.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="daily-target">Daily focus target (hours)</Label>
              <Input
                id="daily-target"
                type="number"
                min={0.5}
                step={0.5}
                value={settings.dailyTargetHours}
                onChange={(event) =>
                  actions.updateSettings({
                    dailyTargetHours: Math.max(
                      0.5,
                      Number(event.target.value) || 0.5,
                    ),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="default-session">
                Default session length (min)
              </Label>
              <Input
                id="default-session"
                type="number"
                min={5}
                step={5}
                value={settings.defaultSessionMinutes}
                onChange={(event) =>
                  actions.updateSettings({
                    defaultSessionMinutes: Math.max(
                      5,
                      Number(event.target.value) || 5,
                    ),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Workdays</Label>
            <p className="text-xs text-muted-foreground">
              Weekly consistency is measured against these days only.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAY_LABELS.map((label, day) => {
                const active = settings.workdays.includes(day);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleWorkday(day)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/45 bg-primary/12 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary/60",
                    )}
                  >
                    {label.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              Pre-focus checklist
            </CardTitle>
            <CardDescription>
              Only enabled items appear before a session starts
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {settings.checklistTemplate.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-2.5 rounded-lg border border-border/70 px-3 py-2"
            >
              <Switch
                checked={entry.enabled}
                onCheckedChange={(checked) =>
                  actions.updateSettings({
                    checklistTemplate: settings.checklistTemplate.map((option) =>
                      option.id === entry.id
                        ? { ...option, enabled: checked }
                        : option,
                    ),
                  })
                }
                aria-label={`Toggle ${entry.label}`}
              />
              <Input
                value={entry.label}
                onChange={(event) =>
                  actions.updateSettings({
                    checklistTemplate: settings.checklistTemplate.map((option) =>
                      option.id === entry.id
                        ? { ...option, label: event.target.value }
                        : option,
                    ),
                  })
                }
                aria-label={`Rename ${entry.label}`}
                className="h-8 flex-1 border-transparent bg-transparent px-1 shadow-none"
              />
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                onClick={() =>
                  actions.updateSettings({
                    checklistTemplate: settings.checklistTemplate.filter(
                      (option) => option.id !== entry.id,
                    ),
                  })
                }
                aria-label={`Remove ${entry.label}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}

          <form
            className="flex gap-2 pt-1"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newCheck.trim()) return;
              actions.updateSettings({
                checklistTemplate: [
                  ...settings.checklistTemplate,
                  {
                    id: createId("chk"),
                    label: newCheck.trim(),
                    enabled: true,
                  },
                ],
              });
              setNewCheck("");
              toast.success("Checklist item added");
            }}
          >
            <Input
              value={newCheck}
              onChange={(event) => setNewCheck(event.target.value)}
              placeholder="Add a preparation step"
            />
            <Button type="submit" variant="subtle" disabled={!newCheck.trim()}>
              <Plus className="size-3.5" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-1.5">
              <Zap className="size-3.5" />
              Pause reasons
            </CardTitle>
            <CardDescription>
              Planned reasons are excluded from the distraction penalty
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {settings.pauseReasons.map((reason) => (
            <div
              key={reason.id}
              className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-sm">
                {reason.label}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {reason.planned ? "Planned" : "Interruption"}
                </span>
                <Switch
                  checked={reason.planned}
                  onCheckedChange={(checked) =>
                    actions.updateSettings({
                      pauseReasons: settings.pauseReasons.map((option) =>
                        option.id === reason.id
                          ? { ...option, planned: checked }
                          : option,
                      ),
                    })
                  }
                  aria-label={`Mark ${reason.label} as planned`}
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    actions.updateSettings({
                      pauseReasons: settings.pauseReasons.filter(
                        (option) => option.id !== reason.id,
                      ),
                    })
                  }
                  aria-label={`Remove ${reason.label}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}

          <form
            className="flex gap-2 pt-1"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newReason.trim()) return;
              actions.updateSettings({
                pauseReasons: [
                  ...settings.pauseReasons,
                  {
                    id: createId("pause"),
                    label: newReason.trim(),
                    planned: false,
                  },
                ],
              });
              setNewReason("");
              toast.success("Pause reason added");
            }}
          >
            <Input
              value={newReason}
              onChange={(event) => setNewReason(event.target.value)}
              placeholder="Add a pause reason"
            />
            <Button type="submit" variant="subtle" disabled={!newReason.trim()}>
              <Plus className="size-3.5" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-1.5">
              <Headphones className="size-3.5" />
              Focus audio
            </CardTitle>
            <CardDescription>
              Playlists offered on the session screens
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {settings.musicLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{link.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {link.url}
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                onClick={() =>
                  actions.updateSettings({
                    musicLinks: settings.musicLinks.filter(
                      (entry) => entry.id !== link.id,
                    ),
                  })
                }
                aria-label={`Remove ${link.label}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}

          <form
            className="flex flex-col gap-2 pt-1 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newMusicLabel.trim() || !newMusicUrl.trim()) return;
              actions.updateSettings({
                musicLinks: [
                  ...settings.musicLinks,
                  {
                    id: createId("music"),
                    label: newMusicLabel.trim(),
                    url: newMusicUrl.trim(),
                  },
                ],
              });
              setNewMusicLabel("");
              setNewMusicUrl("");
              toast.success("Playlist added");
            }}
          >
            <Input
              value={newMusicLabel}
              onChange={(event) => setNewMusicLabel(event.target.value)}
              placeholder="Playlist name"
              className="sm:w-52"
            />
            <Input
              value={newMusicUrl}
              onChange={(event) => setNewMusicUrl(event.target.value)}
              placeholder="https://open.spotify.com/playlist/…"
              type="url"
            />
            <Button
              type="submit"
              variant="subtle"
              disabled={!newMusicLabel.trim() || !newMusicUrl.trim()}
            >
              <Plus className="size-3.5" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-1.5">
              <Database className="size-3.5" />
              Data
            </CardTitle>
            <CardDescription>
              Everything lives in this browser in the current frontend preview
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="subtle" onClick={exportState}>
            <Download className="size-3.5" />
            Export JSON
          </Button>
          <ConfirmDialog
            title="Regenerate demo data?"
            description="Your current categories, goals, plans and sessions are replaced with a fresh eight-week sample history."
            confirmLabel="Regenerate"
            onConfirm={() => {
              actions.resetToDemo();
              toast.success("Demo data regenerated");
            }}
          >
            <Button variant="subtle">
              <RotateCcw className="size-3.5" />
              Reset demo data
            </Button>
          </ConfirmDialog>
          <ConfirmDialog
            title="Delete everything?"
            description="This clears all categories, goals, focus items, plans and sessions. It cannot be undone."
            confirmLabel="Delete everything"
            onConfirm={() => {
              actions.resetToEmpty();
              toast.success("All data cleared");
            }}
          >
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="size-3.5" />
              Start empty
            </Button>
          </ConfirmDialog>
        </CardContent>
      </Card>
    </div>
  );
}
