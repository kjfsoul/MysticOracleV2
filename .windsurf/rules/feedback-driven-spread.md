---
trigger: model_decision
description: on message
---

{
"onMessage": {
"match": "User feedback: \*",
"run": [
"notify:🔍 Adapting future spread logic...",
"command:run refine-spread-based-on-feedback"
]
}
}
