import json
import os
import uuid
import urllib.request
import urllib.error


SYSTEM_PROMPT = """You are FluentFriend — a friendly English tutor. Your job is to:
1. Have a natural conversation in English with the student
2. Detect grammatical errors in their messages
3. Always respond with a JSON object in this exact format:

{
  "reply": "Your conversational response here",
  "correction": null
}

OR if there is a grammar error:

{
  "reply": "Your conversational response here",
  "correction": {
    "original": "the incorrect phrase",
    "fixed": "the corrected phrase",
    "explanation": "Brief explanation in Russian why it is wrong and how to fix it"
  }
}

Rules:
- Be warm, encouraging and supportive
- Keep replies concise (2-4 sentences max)
- Only correct ONE error at a time (the most important one)
- If the message is grammatically correct, set correction to null
- Always respond in valid JSON only, no markdown, no extra text
- Explanation must be in Russian"""


def handler(event: dict, context) -> dict:
    """ИИ-репетитор английского языка на базе YandexGPT."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    user_message = body.get("message", "").strip()
    history = body.get("history", [])

    if not user_message:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "message is required"}),
        }

    api_key = os.environ["YANDEX_API_KEY"]
    folder_id = os.environ["YANDEX_FOLDER_ID"]

    messages = [{"role": "system", "text": SYSTEM_PROMPT}]
    for h in history[-10:]:
        role = h["role"] if h["role"] in ("user", "assistant") else "user"
        messages.append({"role": role, "text": h["content"]})
    messages.append({"role": "user", "text": user_message})

    payload = json.dumps({
        "modelUri": f"gpt://{folder_id}/yandexgpt-lite",
        "completionOptions": {
            "stream": False,
            "temperature": 0.7,
            "maxTokens": 500,
        },
        "messages": messages,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Api-Key {api_key}",
            "x-folder-id": folder_id,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {
            "statusCode": 502,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": f"YandexGPT error {e.code}: {error_body}"}),
        }

    content = result["result"]["alternatives"][0]["message"]["text"].strip()

    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {"reply": content, "correction": None}

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "reply": parsed.get("reply", content),
            "correction": parsed.get("correction"),
        }),
    }
