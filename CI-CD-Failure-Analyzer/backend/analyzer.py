from rules import ERROR_RULES


def analyze_log(log_text):
    results = []

    for rule in ERROR_RULES:
        if rule["keyword"].lower() in log_text.lower():
            results.append({
                "category": rule["category"],
                "severity": rule["severity"],
                "suggestion": rule["suggestion"]
            })

    if not results:
        results.append({
            "category": "Unknown Error",
            "severity": "Low",
            "suggestion": "No matching known issue found."
        })

    return results
