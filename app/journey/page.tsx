import { redirect } from "next/navigation";

// The journey now lives inside the About story ("The path").
export default function JourneyPage() {
  redirect("/about");
}
