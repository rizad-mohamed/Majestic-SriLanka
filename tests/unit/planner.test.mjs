import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBrief,
  formatBrief,
  createEmailLink,
  createEmailDraft,
} from "../../src/lib/planner.mjs";
const valid = {
  name: "Sam Taylor",
  email: "sam@example.com",
  date: "2027-03-15",
  travellers: "2",
  duration: "7–10 days",
  interests: ["Culture & Heritage"],
  notes: "A quiet pace",
  consent: true,
};
test("email draft includes the complete Unicode brief as a document attachment", () => {
  const brief = formatBrief({ ...valid, notes: "Tea & coast — සිංහල" });
  const draft = createEmailDraft("travel@example.com", brief);
  assert.match(draft, /To: travel@example.com\r\n/);
  assert.match(draft, /X-Unsent: 1/);
  assert.match(draft, /Content-Disposition: attachment; filename="travel-brief.txt"/);
  const attachment = draft.split('Content-Disposition: attachment; filename="travel-brief.txt"\r\nContent-Transfer-Encoding: base64\r\n\r\n')[1].split("\r\n--")[0];
  assert.equal(Buffer.from(attachment, "base64").toString("utf8"), brief);
  assert.doesNotMatch(createEmailDraft("bad\r\nBcc: other@example.com", brief), /^To:|^Bcc:/m);
});
test("accepts a complete travel brief", () =>
  assert.deepEqual(validateBrief(valid, "2026-10-31"), {}));
test("reports missing identity, invalid email, past dates and absent consent", () => {
  const errors = validateBrief(
    {
      ...valid,
      name: " ",
      email: "invalid",
      date: "2026-01-01",
      consent: false,
    },
    "2026-10-31",
  );
  assert.deepEqual(Object.keys(errors), ["name", "email", "date", "consent"]);
});
test("rejects invalid party sizes and oversized notes", () => {
  for (const travellers of ["0", "31", "2.5", "hello"])
    assert.ok(validateBrief({ ...valid, travellers }, "2026-10-31").travellers);
  assert.ok(
    validateBrief({ ...valid, notes: "a".repeat(2001) }, "2026-10-31").notes,
  );
});
test("allows an arrival today and party-size boundaries", () => {
  for (const travellers of ["1", "30"])
    assert.deepEqual(
      validateBrief({ ...valid, travellers, date: "2026-10-31" }, "2026-10-31"),
      {},
    );
});
test("brief preserves choices and explicitly says it has not been sent", () => {
  const brief = formatBrief(valid);
  assert.match(brief, /Sam Taylor/);
  assert.match(brief, /Culture & Heritage/);
  assert.match(brief, /No enquiry has been sent/);
});
test("email handoff safely encodes user text and rejects an absent recipient", () => {
  assert.equal(createEmailLink("", "test"), null);
  const link = createEmailLink("travel@example.com", "A & B\nA new line?");
  assert.match(link, /body=A%20%26%20B%0AA%20new%20line%3F$/);
});
