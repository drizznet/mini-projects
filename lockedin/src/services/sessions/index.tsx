// import { useQuery } from "@tanstack/react-query";
// import api from "@/config/axios";
// import type {
//   OrganizationMembership,
//   WorkspaceSummary,
// } from "@/features/auth/types/auth.types";
// import {
//   normalizeOrganizationDetails,
//   normalizeOrganizationMemberships,
// } from "@/features/auth/utils/organizations";

// export const ORGANIZATIONS_QUERY_KEY = ["organizations"] as const;
// export const organizationDetailsQueryKey = (slug: string) =>
//   ["organizations", slug] as const;

// function mergeWorkspaces(
//   existing: WorkspaceSummary[] | undefined,
//   incoming: WorkspaceSummary[] | undefined,
// ): WorkspaceSummary[] | undefined {
//   if (!incoming?.length) return existing;
//   if (!existing?.length) return incoming;

//   const bySlug = new Map(existing.map((workspace) => [workspace.slug, workspace]));

//   for (const workspace of incoming) {
//     bySlug.set(workspace.slug, {
//       ...bySlug.get(workspace.slug),
//       ...workspace,
//     });
//   }

//   return Array.from(bySlug.values());
// }

// export function useOrganizations(enabled: boolean) {
//   return useQuery({
//     queryKey: ORGANIZATIONS_QUERY_KEY,
//     queryFn: async () => {
//       const { data } = await api.get("/organizations");
//       return normalizeOrganizationMemberships(data?.data ?? data);
//     },
//     enabled,
//     staleTime: 5 * 60 * 1_000,
//   });
// }

// export function useOrganizationDetails(slug: string | null, enabled: boolean) {
//   return useQuery({
//     queryKey: organizationDetailsQueryKey(slug ?? ""),
//     queryFn: async () => {
//       const { data } = await api.get(`/organizations/${slug}`);
//       const organization = normalizeOrganizationDetails(data?.data ?? data);
//       if (!organization) {
//         throw new Error("Organization details response was empty.");
//       }
//       return organization;
//     },
//     enabled: enabled && Boolean(slug),
//     staleTime: 5 * 60 * 1_000,
//   });
// }

// export function mergeOrganizationMemberships(
//   stored: OrganizationMembership[],
//   fetched: OrganizationMembership[] | undefined,
// ): OrganizationMembership[] {
//   if (!fetched?.length) return stored;
//   if (!stored.length) return fetched;

//   const bySlug = new Map(
//     stored.map((membership) => [membership.organization.slug, membership]),
//   );

//   for (const membership of fetched) {
//     bySlug.set(membership.organization.slug, {
//       ...bySlug.get(membership.organization.slug),
//       ...membership,
//       organization: {
//         ...bySlug.get(membership.organization.slug)?.organization,
//         ...membership.organization,
//         workspaces: mergeWorkspaces(
//           bySlug.get(membership.organization.slug)?.organization.workspaces,
//           membership.organization.workspaces,
//         ),
//       },
//     });
//   }

//   return Array.from(bySlug.values());
// }
