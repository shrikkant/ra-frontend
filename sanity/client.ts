import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "6y25plyx",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});