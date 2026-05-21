import { env } from "@/env";

const LOOKUP_API_BASE = "https://api.apps.cam.ac.uk/lookup/v1";
const TOKEN_URL = "https://api.apps.cam.ac.uk/oauth2/v1/token";
const SCOPE = "https://api.apps.cam.ac.uk/lookup";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.CAMBRIDGE_LOOKUP_API_KEY,
      client_secret: env.CAMBRIDGE_LOOKUP_API_SECRET,
      scope: SCOPE
    })
  });

  if (!response.ok) {
    throw new Error(`Lookup API token request failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  };
  return cachedToken.token;
}

interface LookupGroup {
  groupid: string;
  name: string;
  title: string;
}

interface LookupInstitution {
  instid: string;
  name: string;
  acronym?: string;
}

interface LookupPerson {
  identifier: { scheme: string; value: string };
  displayName: string;
  registeredName?: string;
  misAffiliation?: string;
  institutions?: LookupInstitution[];
  groups?: LookupGroup[];
}

interface LookupResponse {
  result: {
    person: LookupPerson;
  };
}

export async function lookupPerson(crsid: string) {
  const token = await getAccessToken();

  const response = await fetch(
    `${LOOKUP_API_BASE}/person/crsid/${crsid}?fetch=all_groups,all_insts&format=json`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Lookup API request failed: ${response.status}`);
  }

  const data: LookupResponse = await response.json();
  const person = data.result?.person;
  if (!person) return null;

  return {
    displayName: person.displayName,
    misAffiliation: person.misAffiliation,
    groups: (person.groups ?? []).map((g) => ({
      id: g.groupid,
      name: g.name,
      title: g.title
    })),
    institutions: (person.institutions ?? []).map((i) => ({
      id: i.instid,
      name: i.name,
      acronym: i.acronym
    }))
  };
}

// Institution ID → college name. Includes both parent and UG/PG sub-institutions.
const INSTITUTION_TO_COLLEGE: Record<string, string> = {
  CHRISTS: "Christ's",
  CHRSTPG: "Christ's",
  CHRSTUG: "Christ's",
  CHURCH: "Churchill",
  CHURPG: "Churchill",
  CHURUG: "Churchill",
  CLARE: "Clare",
  CLAREPG: "Clare",
  CLAREUG: "Clare",
  CLAREH: "Clare Hall",
  CLARHPG: "Clare Hall",
  CORPUS: "Corpus Christi",
  CORPPG: "Corpus Christi",
  CORPUG: "Corpus Christi",
  DARWIN: "Darwin",
  DARPG: "Darwin",
  DOWN: "Downing",
  DOWNPG: "Downing",
  DOWNUG: "Downing",
  EMM: "Emmanuel",
  EMMPG: "Emmanuel",
  EMMUG: "Emmanuel",
  FITZ: "Fitzwilliam",
  FITZPG: "Fitzwilliam",
  FITZUG: "Fitzwilliam",
  GIRTON: "Girton",
  GIRTPG: "Girton",
  GIRTUG: "Girton",
  CAIUS: "Gonville & Caius",
  CAIUSPG: "Gonville & Caius",
  CAIUSUG: "Gonville & Caius",
  HOM: "Homerton",
  HOMPG: "Homerton",
  HOMUG: "Homerton",
  HUGHES: "Hughes Hall",
  HUGHPG: "Hughes Hall",
  HUGHUG: "Hughes Hall",
  JESUS: "Jesus",
  JESUSPG: "Jesus",
  JESUSUG: "Jesus",
  KINGS: "King's",
  KINGSPG: "King's",
  KINGSUG: "King's",
  LCC: "Lucy Cavendish",
  LCCPG: "Lucy Cavendish",
  LCCUG: "Lucy Cavendish",
  MAGD: "Magdalene",
  MAGDPG: "Magdalene",
  MAGDUG: "Magdalene",
  NEWH: "Murray Edwards",
  NEWHPG: "Murray Edwards",
  NEWHUG: "Murray Edwards",
  NEWN: "Newnham",
  NEWNPG: "Newnham",
  NEWNUG: "Newnham",
  PEMB: "Pembroke",
  PEMBPG: "Pembroke",
  PEMBUG: "Pembroke",
  PET: "Peterhouse",
  PETPG: "Peterhouse",
  PETUG: "Peterhouse",
  QUEENS: "Queens'",
  QUENPG: "Queens'",
  QUENUG: "Queens'",
  ROBIN: "Robinson",
  ROBINPG: "Robinson",
  ROBINUG: "Robinson",
  SEL: "Selwyn",
  SELPG: "Selwyn",
  SELUG: "Selwyn",
  SID: "Sidney Sussex",
  SIDPG: "Sidney Sussex",
  SIDUG: "Sidney Sussex",
  CATH: "St Catharine's",
  CATHPG: "St Catharine's",
  CATHUG: "St Catharine's",
  EDMUND: "St Edmund's",
  EDMPG: "St Edmund's",
  EDMUG: "St Edmund's",
  JOHNS: "St John's",
  JOHNSPG: "St John's",
  JOHNSUG: "St John's",
  TRIN: "Trinity",
  TRINPG: "Trinity",
  TRINUG: "Trinity",
  TRINH: "Trinity Hall",
  TRINHPG: "Trinity Hall",
  TRINHUG: "Trinity Hall",
  WOLFC: "Wolfson",
  WOLFCPG: "Wolfson",
  WOLFCUG: "Wolfson"
};

// Group ID → tripos part code (matching tripos_part.code in DB)
const GROUP_TO_TRIPOS_PART: Record<string, string> = {
  "104508": "part1a",
  "104507": "part1b",
  "104505": "part2",
  "102748": "part2" // Part III maps to Part II content
};

export function extractCollege(
  institutions: { id: string; name: string; acronym?: string }[]
): string | null {
  for (const inst of institutions) {
    const college = INSTITUTION_TO_COLLEGE[inst.id];
    if (college) return college;
  }
  return null;
}

export function extractTriposPartCode(
  groups: { id: string; name: string; title: string }[]
): string | null {
  for (const group of groups) {
    const partCode = GROUP_TO_TRIPOS_PART[group.id];
    if (partCode) return partCode;
  }
  return null;
}
