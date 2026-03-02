import * as readline from 'readline'
import path from "path";
import OpenAI from 'openai'
import { validateIBAN } from 'finprim'
import { validateUKSortCode, validateUKAccountNumber } from 'finprim'
import { fileURLToPath } from "url";

import * as dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

console.log('API Key:', process.env.OPENAI_API_KEY)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const tools: OpenAI.Tool[] = [
  {
    type: 'function',
    function: {
      name: 'validate_iban',
      description: 'Validates an IBAN (International Bank Account Number). Accepts IBANs with or without spaces.',
      parameters: {
        type: 'object',
        properties: {
          iban: {
            type: 'string',
            description: 'The IBAN to validate',
          },
        },
        required: ['iban'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'validate_sort_code',
      description: 'Validates a UK sort code. Accepts formats: 60-16-13, 601613, 60 16 13',
      parameters: {
        type: 'object',
        properties: {
          sort_code: {
            type: 'string',
            description: 'The UK sort code to validate',
          },
        },
        required: ['sort_code'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'validate_account_number',
      description: 'Validates a UK bank account number. Must be exactly 8 digits.',
      parameters: {
        type: 'object',
        properties: {
          account_number: {
            type: 'string',
            description: 'The UK account number to validate (8 digits)',
          },
        },
        required: ['account_number'],
      },
    },
  },
]

function validateIbanTool(iban: string): string {
  const result = validateIBAN(iban)
  if (result.valid) {
    return JSON.stringify({
      valid: true,
      value: result.value,
      formatted: result.formatted,
    })
  }
  return JSON.stringify({
    valid: false,
    error: result.error,
  })
}

function validateSortCodeTool(sortCode: string): string {
  const result = validateUKSortCode(sortCode)
  if (result.valid) {
    return JSON.stringify({
      valid: true,
      value: result.value,
      formatted: result.formatted,
    })
  }
  return JSON.stringify({
    valid: false,
    error: result.error,
  })
}

function validateAccountNumberTool(accountNumber: string): string {
  const result = validateUKAccountNumber(accountNumber)
  if (result.valid) {
    return JSON.stringify({
      valid: true,
      value: result.value,
      formatted: result.formatted,
    })
  }
  return JSON.stringify({
    valid: false,
    error: result.error,
  })
}

function processTool(
  toolName: string,
  toolInput: Record<string, string>,
): string {
  switch (toolName) {
    case 'validate_iban':
      return validateIbanTool(toolInput.iban)
    case 'validate_sort_code':
      return validateSortCodeTool(toolInput.sort_code)
    case 'validate_account_number':
      return validateAccountNumberTool(toolInput.account_number)
    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` })
  }
}

async function chat(conversationHistory: OpenAI.ChatCompletionMessageParam[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: conversationHistory,
    tools: tools,
    tool_choice: 'auto',
  })

  const assistantMessage = response.choices[0].message

  if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
    // Add assistant message with tool calls to history
    conversationHistory.push(assistantMessage)

    // Process each tool call and add tool result messages
    for (const toolCall of assistantMessage.tool_calls) {
      if (toolCall.type === 'function') {
        const toolResult = processTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments),
        )
        conversationHistory.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        })
      }
    }

    // Get final response from assistant
    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversationHistory,
      tools: tools,
    })

    const finalMessage = finalResponse.choices[0].message
    conversationHistory.push(finalMessage)

    return finalMessage.content || 'No response'
  }

  // Regular message without tool calls
  conversationHistory.push(assistantMessage)
  return assistantMessage.content || 'No response'
}

async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const conversationHistory: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a helpful financial validation assistant. You can validate IBANs, UK sort codes, and UK account numbers. 
When a user asks you to validate financial information, use the appropriate tools to validate the input and provide clear, helpful feedback about whether the input is valid or not.
Be friendly and helpful in your responses.`,
    },
  ]

  console.log('Financial Validation Chatbot')
  console.log('============================')
  console.log('I can help validate:')
  console.log('  - IBANs (International Bank Account Numbers)')
  console.log('  - UK Sort Codes')
  console.log('  - UK Account Numbers')
  console.log('\nType "exit" to quit.\n')

  const askQuestion = (): void => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Goodbye!')
        rl.close()
        return
      }

      try {
        conversationHistory.push({
          role: 'user',
          content: input,
        })

        const response = await chat(conversationHistory)
        console.log(`\nAssistant: ${response}\n`)
      } catch (error) {
        if (error instanceof OpenAI.APIError) {
          console.error(`Error: ${error.message}\n`)
        } else {
          throw error
        }
      }

      askQuestion()
    })
  }

  askQuestion()
}

main()
