const $ = (id) => document.getElementById(id);

function b64urlDecode(str) {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parsePart(part) {
  try {
    return JSON.parse(b64urlDecode(part));
  } catch {
    return null;
  }
}

function formatTime(unix) {
  if (typeof unix !== "number") return String(unix);
  const d = new Date(unix * 1000);
  const rel = ((unix * 1000 - Date.now()) / 1000);
  const abs = Math.abs(rel);
  let human;
  if (abs < 60) human = `${Math.round(abs)}s`;
  else if (abs < 3600) human = `${Math.round(abs / 60)}m`;
  else if (abs < 86400) human = `${Math.round(abs / 3600)}h`;
  else human = `${Math.round(abs / 86400)}d`;
  const side = rel >= 0 ? "in" : "ago";
  return `${d.toISOString()} (${side === "in" ? "in " : ""}${human}${side === "ago" ? " ago" : ""})`;
}

async function verifyHmac(token, secret, alg) {
  if (!secret || !alg?.startsWith("HS")) return null;
  const enc = new TextEncoder();
  const [h, p, s] = token.split(".");
  if (!s) return false;
  const name = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" }[alg];
  if (!name) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: name },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${h}.${p}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return expected === s;
}

async function run() {
  const raw = $("token").value.trim();
  const secret = $("secret").value;
  $("header").textContent = "—";
  $("payload").textContent = "—";
  $("signature").textContent = "—";
  $("sig-status").textContent = "";
  $("sig-status").className = "muted";
  $("timeline").innerHTML = "";

  if (!raw) return;
  const parts = raw.split(".");
  if (parts.length < 2) {
    $("sig-status").textContent = "Not a valid JWT (need at least header.payload)";
    $("sig-status").className = "bad";
    return;
  }

  const header = parsePart(parts[0]);
  const payload = parsePart(parts[1]);
  $("header").textContent = header ? JSON.stringify(header, null, 2) : "(invalid JSON)";
  $("payload").textContent = payload ? JSON.stringify(payload, null, 2) : "(invalid JSON)";
  $("signature").textContent = parts[2] || "(none)";

  if (payload) {
    for (const claim of ["iat", "nbf", "exp"]) {
      if (payload[claim] != null) {
        const li = document.createElement("li");
        li.innerHTML = `<span>${claim}</span><span>${formatTime(payload[claim])}</span>`;
        $("timeline").appendChild(li);
      }
    }
  }

  const alg = header?.alg;
  const ok = await verifyHmac(raw, secret, alg);
  if (ok === null) {
    $("sig-status").textContent = secret
      ? `Cannot verify alg ${alg || "?"} in-browser (use HS256/384/512)`
      : "Provide a secret to verify HMAC signature";
    $("sig-status").className = "muted";
  } else if (ok) {
    $("sig-status").textContent = "Signature valid";
    $("sig-status").className = "ok";
  } else {
    $("sig-status").textContent = "Signature invalid";
    $("sig-status").className = "bad";
  }
}

$("decode").addEventListener("click", run);
$("token").addEventListener("input", () => {
  if ($("token").value.includes(".")) run();
});
