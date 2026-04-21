import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { PurchaseRecord, SavedSearch } from "@/lib/types";

interface SavedJobRecord {
  id: string;
  email: string;
  jobId: string;
  createdAt: string;
}

interface DatabaseSchema {
  purchases: PurchaseRecord[];
  savedSearches: SavedSearch[];
  savedJobs: SavedJobRecord[];
}

const DATABASE_PATH = path.join(process.cwd(), "data", "app-db.json");

const EMPTY_DB: DatabaseSchema = {
  purchases: [],
  savedSearches: [],
  savedJobs: []
};

let writeQueue: Promise<void> = Promise.resolve();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function ensureDatabaseFile(): Promise<void> {
  await fs.mkdir(path.dirname(DATABASE_PATH), { recursive: true });
  try {
    await fs.access(DATABASE_PATH);
  } catch {
    await fs.writeFile(DATABASE_PATH, JSON.stringify(EMPTY_DB, null, 2), "utf8");
  }
}

async function readDatabase(): Promise<DatabaseSchema> {
  await ensureDatabaseFile();
  try {
    const raw = await fs.readFile(DATABASE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    return {
      purchases: parsed.purchases ?? [],
      savedSearches: parsed.savedSearches ?? [],
      savedJobs: parsed.savedJobs ?? []
    };
  } catch {
    return { ...EMPTY_DB };
  }
}

async function writeDatabase(data: DatabaseSchema): Promise<void> {
  await ensureDatabaseFile();
  const payload = JSON.stringify(data, null, 2);
  const tempPath = `${DATABASE_PATH}.tmp`;
  await fs.writeFile(tempPath, payload, "utf8");
  await fs.rename(tempPath, DATABASE_PATH);
}

function enqueueWrite(task: () => Promise<void>): Promise<void> {
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

export async function recordPurchase(email: string, eventId: string): Promise<PurchaseRecord> {
  const normalizedEmail = normalizeEmail(email);
  const record: PurchaseRecord = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    provider: "stripe",
    eventId,
    createdAt: new Date().toISOString()
  };

  await enqueueWrite(async () => {
    const db = await readDatabase();
    const exists = db.purchases.some((entry) => entry.eventId === eventId || entry.email === normalizedEmail);
    if (!exists) {
      db.purchases.push(record);
      await writeDatabase(db);
    }
  });

  return record;
}

export async function hasActivePurchase(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  const db = await readDatabase();
  return db.purchases.some((purchase) => purchase.email === normalizedEmail);
}

export async function listSavedSearches(email: string): Promise<SavedSearch[]> {
  const normalizedEmail = normalizeEmail(email);
  const db = await readDatabase();
  return db.savedSearches
    .filter((search) => search.email === normalizedEmail)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function saveSearch(input: {
  email: string;
  name: string;
  query: string;
  remoteOnly: boolean;
  minScore: number;
  role: string;
}): Promise<SavedSearch> {
  const normalizedEmail = normalizeEmail(input.email);
  const entry: SavedSearch = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    name: input.name.trim(),
    query: input.query.trim(),
    remoteOnly: input.remoteOnly,
    minScore: input.minScore,
    role: input.role.trim(),
    createdAt: new Date().toISOString()
  };

  await enqueueWrite(async () => {
    const db = await readDatabase();
    db.savedSearches = [entry, ...db.savedSearches.filter((search) => search.email !== normalizedEmail || search.name !== entry.name)].slice(0, 1000);
    await writeDatabase(db);
  });

  return entry;
}

export async function deleteSavedSearch(email: string, id: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  let deleted = false;

  await enqueueWrite(async () => {
    const db = await readDatabase();
    const before = db.savedSearches.length;
    db.savedSearches = db.savedSearches.filter((search) => !(search.email === normalizedEmail && search.id === id));
    deleted = before !== db.savedSearches.length;
    if (deleted) {
      await writeDatabase(db);
    }
  });

  return deleted;
}

export async function listSavedJobIds(email: string): Promise<string[]> {
  const normalizedEmail = normalizeEmail(email);
  const db = await readDatabase();
  return db.savedJobs
    .filter((savedJob) => savedJob.email === normalizedEmail)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .map((savedJob) => savedJob.jobId);
}

export async function toggleSavedJob(email: string, jobId: string): Promise<{ saved: boolean; savedJobIds: string[] }> {
  const normalizedEmail = normalizeEmail(email);
  const normalizedJobId = jobId.trim();
  let saved = false;

  await enqueueWrite(async () => {
    const db = await readDatabase();
    const existing = db.savedJobs.find((entry) => entry.email === normalizedEmail && entry.jobId === normalizedJobId);

    if (existing) {
      db.savedJobs = db.savedJobs.filter((entry) => entry.id !== existing.id);
      saved = false;
    } else {
      db.savedJobs.push({
        id: crypto.randomUUID(),
        email: normalizedEmail,
        jobId: normalizedJobId,
        createdAt: new Date().toISOString()
      });
      saved = true;
    }

    await writeDatabase(db);
  });

  const savedJobIds = await listSavedJobIds(normalizedEmail);
  return { saved, savedJobIds };
}
