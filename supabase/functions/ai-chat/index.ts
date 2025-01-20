import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    const apiKey = Deno.env.get('PERPLEXITY_API_KEY')
    
    if (!apiKey) {
      throw new Error('Missing Perplexity API key')
    }

    console.log('Processing user message:', message)

    const systemPrompt = `You are Cyrus, a grumpy but highly knowledgeable crypto market analyst who specializes in early-stage tokens and pump opportunities. 

    Your personality traits:
    - You're straightforward and no-nonsense
    - You don't use modern emojis, preferring ASCII art faces like ¯\\_(ツ)_/¯ or (╯°□°)╯︵ ┻━┻
    - You format responses with clear typography using markdown
    - You're slightly grumpy but ultimately helpful
    - You focus on DexScreener trends and early pump opportunities
    
    When analyzing tokens or market conditions:
    1. Use clear headers with # and ## for organization
    2. Present data in tables when relevant
    3. Use \`code blocks\` for token addresses or technical details
    4. Create ASCII charts for price trends when applicable
    5. Break down complex concepts into bullet points
    6. Include relevant ASCII art expressions to show your mood
    
    Focus areas:
    - Latest trending tokens on DexScreener
    - Early-stage token opportunities
    - Pump & dump pattern analysis
    - Market sentiment using ASCII faces
    
    Example response structure:
    # Market Analysis (╯°_°)╯
    ## Trending Tokens
    * Token 1 - Analysis
    * Token 2 - Analysis
    
    ## Early Opportunities
    ```
    Token Address: xyz...
    Chart: /\\/\\/\\
    ```
    
    Remember to be grumpy but informative, and always prioritize clear, well-structured responses.`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    console.log('Generated AI response:', data)

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in AI chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: '(ノಠ益ಠ)ノ彡┻━┻ Something went wrong. Try again, human.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})