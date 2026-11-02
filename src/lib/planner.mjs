export function validateBrief(
  values,
  today = new Date().toISOString().slice(0, 10),
) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Please enter your name.";
  else if (values.name.trim().length > 100)
    errors.name = "Please use 100 characters or fewer.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || ""))
    errors.email = "Please enter a valid email address.";
  else if (values.email.length > 254)
    errors.email = "Please use a shorter email address.";
  if (!values.date) errors.date = "Please choose an approximate arrival date.";
  else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(values.date) ||
    Number.isNaN(Date.parse(values.date)) ||
    values.date < today
  )
    errors.date = "Please choose today or a future arrival date.";
  const travellers = Number(values.travellers);
  if (!Number.isInteger(travellers) || travellers < 1 || travellers > 30)
    errors.travellers = "Please choose between 1 and 30 travellers.";
  if (values.notes && values.notes.length > 2000)
    errors.notes = "Please use 2,000 characters or fewer.";
  if (!values.consent)
    errors.consent = "Please confirm you understand how your brief is used.";
  return errors;
}

export function formatBrief(values) {
  return [
    "MAJESTIC SRI LANKA — MY TRAVEL BRIEF",
    "",
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Approximate arrival: ${values.date}`,
    `Travellers: ${values.travellers}`,
    `Length of stay: ${values.duration || "Flexible"}`,
    `Suggested journey: ${values.journey || "A tailor-made journey"}`,
    `Interests: ${values.interests?.join(", ") || "Open to ideas"}`,
    "",
    "What I have in mind:",
    values.notes?.trim() || "Let’s explore the possibilities.",
    "",
    "This is a planning brief, not a booking. No enquiry has been sent by downloading this file.",
  ].join("\n");
}

export function createEmailLink(email, brief) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("My Sri Lankan journey — travel enquiry")}&body=${encodeURIComponent(brief)}`;
}

// RFC 5322 draft with a UTF-8 document attachment. No network request is made.
export function createEmailDraft(email, brief) {
  const recipient = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
  const encode = (text) => {
    const bytes = new TextEncoder().encode(text);
    const encoded = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
    return encoded.match(/.{1,76}/g)?.join("\r\n") || "";
  };
  const boundary = "majestic_travel_brief_mime";
  return [
    "X-Unsent: 1",
    ...(recipient ? [`To: ${recipient}`] : []),
    "Subject: My Sri Lankan journey - travel enquiry",
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    encode("Hello Majestic Sri Lanka,\n\nPlease find my completed travel brief attached. I would like to discuss a journey based on these details."),
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8; name="travel-brief.txt"',
    'Content-Disposition: attachment; filename="travel-brief.txt"',
    "Content-Transfer-Encoding: base64",
    "",
    encode(brief),
    `--${boundary}--`,
    "",
  ].join("\r\n");
}
