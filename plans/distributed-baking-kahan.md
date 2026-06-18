# Deal Flow Redesign — Rental Listing

## Context

The current flow locks the deal the moment an agent accepts a single applicant, which is too early. The redesigned flow separates **shortlisting** (accept up to 5) from **deal lock** (whoever pays first wins). This gives multiple qualified applicants a fair chance and aligns with how real Nigerian rental markets work.

**Only one file changes:** `src/app/components/agent-dashboard/listing-deep-dive.tsx` (~1550 lines)

---

## New Flow (6 stages — adds `lease-signing`)

| Stage | Who acts | What happens |
|---|---|---|
| **Vetting** | Agent | Accepts up to 5 applicants. No lock. CTA bar appears to proceed to lease creation. |
| **Agreement** | Agent | Creates lease, signs, sends to **all** accepted applicants. Sees per-applicant review status. |
| **Payment** | Applicants | First to pay wins — deal locks. Agent acknowledges → advances to Lease Signing. |
| **Lease Signing** *(new)* | Tenant | Locked applicant formally signs the lease. Agent sees status & confirms. |
| **Handover** | Tenant | Tenant picks date/time. Agent confirms or reschedules. |
| **Payout** | Agent | Marks handover done → awaits tenant confirm → agent wallet credited + landlord bank account credited → agent downloads receipt. |

---

## State Changes

### Remove
- `acceptedApplicant: Applicant | null`
- `lockAgreed: boolean`
- `showAcceptedModal: boolean`

### Add
```ts
const [acceptedApplicants, setAcceptedApplicants] = useState<Applicant[]>(
  preAccepted ? [mockApplicants[0]] : []
);
const [lockedApplicant, setLockedApplicant] = useState<Applicant | null>(
  preAccepted ? mockApplicants[0] : null
);
const [leaseReviewStatus, setLeaseReviewStatus] = useState<
  Record<number, 'pending' | 'viewed' | 'accepted' | 'declined'>
>({});
const [paymentReceived, setPaymentReceived] = useState(preAccepted);
const [agentHandoverConfirmed, setAgentHandoverConfirmed] = useState(false);
const [tenantConfirmed, setTenantConfirmed] = useState(false);
```

### Update references to old `acceptedApplicant`
Replace every `acceptedApplicant?.name` with `lockedApplicant?.name || acceptedApplicants[0]?.name || 'Applicant'` in `leaseContent` and `activityLog` arrays.

---

## Handler Changes

### `handleAcceptApplicant` — toggle in/out of array (max 5, no stage advance)
```ts
const handleAcceptApplicant = (applicant: Applicant) => {
  setAcceptedApplicants(prev => {
    if (prev.some(a => a.id === applicant.id)) return prev.filter(a => a.id !== applicant.id);
    if (prev.length >= 5) return prev;
    return [...prev, applicant];
  });
  setSelectedApplicant(null);
};
```

### NEW `handleSendLeaseToAll` — replaces `handleSendLease`
```ts
const handleSendLeaseToAll = () => {
  const mockStatus: Record<number, 'pending' | 'viewed' | 'accepted' | 'declined'> = {};
  acceptedApplicants.forEach((a, i) => {
    mockStatus[a.id] = i === 0 ? 'accepted' : i === 1 ? 'viewed' : 'pending';
  });
  setLeaseReviewStatus(mockStatus);
  setLeaseSent(true);
  // Stage does NOT advance here — advances when payment comes in
};
```

### `handleAcknowledgePayment` — now also sets lockedApplicant
```ts
const handleAcknowledgePayment = () => {
  const payer = acceptedApplicants.find(a => leaseReviewStatus[a.id] === 'accepted') || acceptedApplicants[0];
  setLockedApplicant(payer ?? null);
  setCurrentStage('handover');
  setViewingStage('handover');
};
```

### `handleConfirmPayout` → `handleAgentConfirmHandover`
```ts
const handleAgentConfirmHandover = () => {
  setAgentHandoverConfirmed(true);
  setCurrentStage('payout');
  setViewingStage('payout');
  setShowPayoutModal(false);
  setTimeout(() => setTenantConfirmed(true), 2000); // mock tenant confirm
};
```

---

## Per-Stage UI Changes

### Stage 1 — Vetting
- `isAccepted` check: `acceptedApplicants.some(a => a.id === applicant.id)` (was: `acceptedApplicant?.id === applicant.id`)
- Applicant count chip: `{mockApplicants.length} Applicants · {acceptedApplicants.length} accepted`
- Audit mode top block: loop over `acceptedApplicants[]` with compact rows instead of single "Deal Locked" card
- **Add sticky CTA bar** (after applicant list, non-audit mode):
  ```jsx
  {acceptedApplicants.length > 0 && !isAuditMode && (
    <div className="sticky bottom-4 flex justify-end px-1 pb-1">
      <button onClick={() => { setCurrentStage('agreement'); setViewingStage('agreement'); }}
        className="flex items-center gap-2 px-6 py-3.5 bg-[#7B2D42] text-white rounded-xl font-bold shadow-xl shadow-[#7B2D42]/30 hover:bg-[#6D1D2C] transition-colors">
        <Send className="w-4 h-4" />
        Create & Send Lease to {acceptedApplicants.length} Applicant{acceptedApplicants.length > 1 ? 's' : ''} →
      </button>
    </div>
  )}
  ```

### Applicant Profile Modal CTA
Replace the `lockAgreed` checkbox + "Accept Candidate & Lock Deal" button with a single toggle button:
- If accepted: "✓ Accepted — Click to Remove" (emerald style)
- If not accepted (and slots available): "Accept Applicant" (maroon style)  
- If not accepted and at max 5: show amber warning + disabled button
- Remove the flash modal (`showAcceptedModal` AnimatePresence block) entirely

### Stage 2 — Agreement
- Tenant chip in lease mode selection: show avatar row of `acceptedApplicants[]` + count instead of single applicant
- "Send to Tenant" button → `handleSendLeaseToAll`, label: `"Send to {N} Accepted Applicants"`
- After send: replace "awaiting signature" chip with **review tracking panel**:
  - Per-applicant row: avatar, name, status badge (Pending/Viewed/Accepted/Declined)
  - Status colours: slate / blue / emerald / red
  - "▷ Simulate Payment Received (Demo)" button at bottom → advances to payment stage
- Do NOT auto-advance stage from agreement — waiting for payment event

### Stage 3 — Payment
- Subtitle: `"Awaiting payment from one of {N} accepted applicants"`
- **Remove** the 48-hour countdown timer (deal lock concept moved here, no time pressure needed in UI)
- **Replace** single tenant row with applicant payment list (Pending / Paid badges)
- "▷ Simulate Payment Received (Demo)" button when `!lockedApplicant` → sets `lockedApplicant`
- When `lockedApplicant` set: show "DEAL LOCKED" emerald highlight block with that applicant
- "Acknowledge Payment & Secure Escrow" button: only active/visible when `lockedApplicant !== null`
- Remove the amber "deadline" warning (no longer applicable)

### Stage 4 — Handover
- Copy change only: "Confirm Tenant's Proposed Handover" + "has proposed the following date and time"
- Use `lockedApplicant?.name` in copy
- Rename "Accept Schedule" button → "Confirm Schedule"

### Stage 5 — Payout (full replacement)
Replace the static completion screen with conditional two-sub-phase render:

**Sub-phase A** (`agentHandoverConfirmed && !tenantConfirmed`):
- Spinning ring + "Awaiting Tenant Confirmation" + locked applicant name

**Sub-phase B** (`tenantConfirmed`):
- CheckCircle hero + "Deal Closed!" + "Handover confirmed by {name}"
- **Agent commission card**: ₦450,000 credited, with TXN ID
- **Landlord payment card**: ₦4,050,000 disbursed, with TXN ID
- "View Wallet" + "Back to Listings" buttons

### Payout Modal (trigger only)
Keep modal content ("Everything Check Out?") as-is, just update `onClick` → `handleAgentConfirmHandover`.

---

## Implementation Order

1. **State block** — remove 3 old vars, add 6 new ones
2. **Data arrays** — update `leaseContent` and `activityLog` name references
3. **Handlers** — replace `handleAcceptApplicant`, add `handleSendLeaseToAll`, update `handleAcknowledgePayment`, rename/rewrite `handleConfirmPayout`
4. **Vetting stage JSX** — `isAccepted` check, chip, audit block, CTA bar
5. **Profile modal CTA** — replace checkbox+lock button with toggle button, delete flash modal
6. **Agreement JSX** — tenant chip, send button, post-send review panel
7. **Payment JSX** — subtitle, payment list, simulate button, locked block, acknowledge button guard
8. **Handover JSX** — copy updates, button rename
9. **Payout JSX** — replace with two-sub-phase render
10. **Payout modal** — update onClick handler name

---

## Verification

- **Vetting**: Accept 2 applicants → green badges on cards → sticky CTA shows "Create & Send Lease to 2 Applicants →"
- **Vetting → Agreement**: Click CTA → stage advances, `acceptedApplicants` intact
- **Agreement**: Sign lease → "Send to 2 Accepted Applicants" → review panel shows correct statuses
- **Agreement → Payment**: Click simulate button → payment stage
- **Payment**: Applicant list with Paid/Pending badges → simulate → DEAL LOCKED block → Acknowledge → Handover
- **Handover**: `lockedApplicant` name in copy → Confirm Schedule → Mark Complete → Payout modal → confirm
- **Payout**: Spinner 2s → credits screen with agent + landlord amounts
- **Audit mode**: Click stage 1 from stage 5 → read-only, no Accept buttons, amber banner, "Return to Current" works
- **Pre-accepted listing** (`dealStage: 'payment'`): `acceptedApplicants` and `lockedApplicant` pre-set, later stages render correctly
