# Financial Validation Chatbot CLI

A command-line chatbot powered by OpenAI that can validate:
- **IBAN** (International Bank Account Numbers)
- **UK Sort Codes** (various formats: 60-16-13, 601613, 60 16 13)
- **UK Account Numbers** (8 digits)

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk_test_xxxxx
   ```

3. **Run the chatbot:**
From the example folder, run
```bash
npm run cli
```

## Usage Examples

Once the chatbot is running, you can ask it to validate financial information:

```
You: Can you validate this IBAN? GB29 NWBK 6016 1331 9268 19