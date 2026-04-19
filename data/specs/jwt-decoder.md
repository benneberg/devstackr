# JWT Decoder – Open Specs

## 🧭 Overview
Decodes JWT tokens into header, payload, and signature.

---

## ✅ Current Capabilities
- Base64 decoding
- JSON parsing
- Pretty-print output

---

## ⚠️ Known Limitations
- No signature verification
- No expiration validation
- No support for encrypted JWT (JWE)

---

## 🚧 Planned Improvements
- [ ] Add signature verification (HS256, RS256)
- [ ] Expiration + issuer validation
- [ ] JWT builder integration

---

## 🧪 Edge Cases & Validation
- Invalid base64 strings
- Missing segments
- Oversized payloads

---

## 🔌 Pipeline Integration
Input: string  
Output: json  

Stateless: yes

---

## ⚡ Performance Notes
- Very fast (O(n) decoding)
- No heavy computation

---

## 🔐 Security Considerations
- Do NOT log tokens
- Mask sensitive fields in UI

---

## 📚 Future Ideas
- Visual token timeline
- Auto-refresh simulation

---

## 📝 Dev Notes
- Consider using a standard JWT library later
