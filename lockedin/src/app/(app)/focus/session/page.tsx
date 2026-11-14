import { redirect } from "next/navigation";

/** Keep the legacy route pointed at the Lock in workspace. */
export default function ActiveSessionRedirect() {
  redirect("/lockin");
}
