import "server-only";

export type Avatar = {
  id: string;
  url: string;
  label?: string;
};

/**
 * Built-in fallback set used until the avatars collection is provisioned in the database.
 * When DB is wired, swap this implementation to read from your store — the call sites
 * already depend only on this listAvatars() contract.
 */
const FALLBACK: Avatar[] = [
  { id: "av-01", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Atlas",   label: "Atlas" },
  { id: "av-02", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Maple",   label: "Maple" },
  { id: "av-03", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=River",   label: "River" },
  { id: "av-04", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Echo",    label: "Echo" },
  { id: "av-05", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Nova",    label: "Nova" },
  { id: "av-06", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Pixel",   label: "Pixel" },
  { id: "av-07", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sable",   label: "Sable" },
  { id: "av-08", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Hazel",   label: "Hazel" },
  { id: "av-09", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Onyx",    label: "Onyx" },
  { id: "av-10", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Wren",    label: "Wren" },
  { id: "av-11", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Cinder",  label: "Cinder" },
  { id: "av-12", url: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Lumen",   label: "Lumen" },
];

export async function listAvatars(): Promise<Avatar[]> {
  return FALLBACK;
}

export async function findAvatarById(id: string): Promise<Avatar | null> {
  const all = await listAvatars();
  return all.find((a) => a.id === id) ?? null;
}
