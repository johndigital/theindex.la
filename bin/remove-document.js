#!/usr/bin/env node
/*
 * Remove a Prismic document (and all references to it) from assets/prismic-data.json.
 *
 * Usage:
 *   node scripts/remove-document.js <slug> [--dry-run] [--no-backup]
 *
 * Examples:
 *   node scripts/remove-document.js yana-wernicke --dry-run   # preview only
 *   node scripts/remove-document.js yana-wernicke             # remove + write (creates .bak)
 *
 * What it does:
 *   1. Finds the document whose `slugs` array (or `uid`) matches the given slug.
 *   2. Removes that document from the top-level array.
 *   3. Recursively scrubs references to its id everywhere else:
 *        - entries in any `linked_documents` array
 *        - Prismic content-relationship links: { link_type: "Document", id: <targetId>, ... }
 *          - if the link is an element of an array (e.g. categories/related docs) it is removed
 *          - if the link is a single field value it is set to null
 */

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "assets", "prismic-data.json");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const slug = args.find((a) => !a.startsWith("--"));
const dryRun = flags.has("--dry-run");
const makeBackup = !flags.has("--no-backup");

if (!slug) {
  console.error("Usage: node scripts/remove-document.js <slug> [--dry-run] [--no-backup]");
  process.exit(1);
}

const raw = fs.readFileSync(FILE, "utf8");
const docs = JSON.parse(raw);

// 1. Locate target document(s) by slug (or uid).
const targets = docs.filter(
  (d) => (Array.isArray(d.slugs) && d.slugs.includes(slug)) || d.uid === slug
);

if (targets.length === 0) {
  console.error(`No document found with slug "${slug}". Nothing to do.`);
  process.exit(1);
}

const targetIds = new Set(targets.map((d) => d.id));
console.log(`Found ${targets.length} document(s) matching slug "${slug}":`);
targets.forEach((d) => console.log(`  - id=${d.id} type=${d.type} slugs=${JSON.stringify(d.slugs)}`));

// 2. Drop the target document(s) from the array.
let kept = docs.filter((d) => !targetIds.has(d.id));

// 3. Recursively scrub references to the target id(s).
let refsRemoved = 0;
const referencingDocs = new Set();

function isDocLinkTo(node) {
  return (
    node &&
    typeof node === "object" &&
    node.link_type === "Document" &&
    targetIds.has(node.id)
  );
}

// Walk a value. Returns the (possibly replaced) value.
// `docId` is only used for reporting which top-level doc contained a reference.
function scrub(value, docId) {
  if (Array.isArray(value)) {
    const filtered = [];
    for (const item of value) {
      // linked_documents entries and inline Document links inside arrays get dropped
      if (isDocLinkTo(item) || (item && typeof item === "object" && targetIds.has(item.id) && item.link_type === "Document")) {
        refsRemoved++;
        referencingDocs.add(docId);
        continue;
      }
      filtered.push(scrub(item, docId));
    }
    return filtered;
  }
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const child = value[key];
      if (isDocLinkTo(child)) {
        // single content-relationship field pointing at the target -> empty it
        refsRemoved++;
        referencingDocs.add(docId);
        value[key] = null;
      } else {
        value[key] = scrub(child, docId);
      }
    }
    return value;
  }
  return value;
}

kept = kept.map((d) => scrub(d, d.id));

// Also handle linked_documents by id string (belt-and-suspenders; empty in current data).
for (const d of kept) {
  if (Array.isArray(d.linked_documents) && d.linked_documents.length) {
    const before = d.linked_documents.length;
    d.linked_documents = d.linked_documents.filter(
      (ld) => !targetIds.has(typeof ld === "string" ? ld : ld && ld.id)
    );
    const diff = before - d.linked_documents.length;
    if (diff) {
      refsRemoved += diff;
      referencingDocs.add(d.id);
    }
  }
}

console.log(
  `\nRemoved ${targets.length} document(s); scrubbed ${refsRemoved} reference(s) across ${referencingDocs.size} other document(s).`
);
console.log(`Document count: ${docs.length} -> ${kept.length}`);

if (dryRun) {
  console.log("\n--dry-run: no changes written.");
  process.exit(0);
}

if (makeBackup) {
  const bak = `${FILE}.bak`;
  fs.writeFileSync(bak, raw);
  console.log(`Backup written to ${bak}`);
}

// Preserve original minified format (no indentation).
fs.writeFileSync(FILE, JSON.stringify(kept));
console.log(`Updated ${path.relative(path.join(__dirname, ".."), FILE)}`);
