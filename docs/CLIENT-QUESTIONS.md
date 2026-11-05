# Aurum Drive — Client Clarifications & Open Inquiries

Please review and confirm these key operational assumptions:

1. **Target Market & Currency**:
   - *Current Implementation*: Algeria market with French default (`fr-DZ`), Algerian Dinar (`DA` formatted as `18 000,00 DA`), date conventions `DD/MM/YYYY HH:mm`.
   - *Question*: Are there plans to introduce English or Arabic (RTL) switchers in Phase 1 or Phase 2?

2. **Rental Duration & Grace Period Rules**:
   - *Current Implementation*: Calculated in 24-hour cycles (`ceil(hours / 24)`). For example, 72 hours equals 3 full rental days.
   - *Question*: What is the agency tolerance window for return delays (e.g. 1 hour grace period before an extra full day is billed)?

3. **Chauffeur & Airport Delivery**:
   - *Current Implementation*: Dedicated Services page and notes field in reservation for chauffeur requests and airport pickup.
   - *Question*: What are the standard fixed surcharges for chauffeur services and airport delivery?

4. **Security Deposit Handling**:
   - *Current Implementation*: Security deposits are physically collected at vehicle hand-over (credit card pre-authorization, check, or cash) and refunded upon return inspection.
   - *Question*: Does the agency accept checks for guarantees, or credit card pre-auth only?

5. **Notification Gateway**:
   - *Current Implementation*: Client receives automated formatted email and WhatsApp direct action link; staff receives structured payload.
   - *Question*: Which transactional email provider is preferred (e.g., Resend, Brevo, SendGrid)?
