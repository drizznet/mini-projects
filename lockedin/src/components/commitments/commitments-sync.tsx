"use client";

import { useLayoutEffect } from "react";

import { hasLocalAuthSession } from "@/lib/auth";
import { commitmentToGoal } from "@/lib/commitments/mappers";
import { useFocusStore } from "@/lib/store/focus-store";
import { useCommitments } from "@/services/commitments";

/**
 * Pulls commitments from the API into the local focus store when the user is
 * signed in. Each plan gets a work item and a place on the days it covers.
 */
export function CommitmentsSync() {
  const { hydrated, actions } = useFocusStore();
  const { data, isFetched } = useCommitments(hydrated);

  useLayoutEffect(() => {
    if (!hasLocalAuthSession() || !isFetched || !data) return;
    actions.replaceGoals(data.data.map(commitmentToGoal));
  }, [data, isFetched, actions]);

  return null;
}
