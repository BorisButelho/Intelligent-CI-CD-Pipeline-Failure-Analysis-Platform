ERROR_RULES = [
    {
        "keyword": "npm ERR",
        "category": "Dependency Error",
        "severity": "Medium",
        "suggestion": "Run npm install again or clear node_modules."
    },
    {
        "keyword": "test failed",
        "category": "Test Failure",
        "severity": "High",
        "suggestion": "Check failed test cases and assertions."
    },
    {
        "keyword": "permission denied",
        "category": "Permission Issue",
        "severity": "High",
        "suggestion": "Verify deployment credentials and file permissions."
    },
    {
        "keyword": "out of memory",
        "category": "Resource Failure",
        "severity": "Critical",
        "suggestion": "Increase memory allocation for container or VM."
    },
    {
        "keyword": "docker build failed",
        "category": "Docker Failure",
        "severity": "Medium",
        "suggestion": "Verify Dockerfile configuration and dependencies."
    },
    {
        "keyword": "CrashLoopBackOff",
        "category": "Kubernetes Deployment Failure",
        "severity": "Critical",
        "suggestion": "Inspect pod logs and container startup configuration."
    },
    {
        "keyword": "timeout",
        "category": "Timeout Failure",
        "severity": "Medium",
        "suggestion": "Increase deployment timeout or optimize startup process."
    },
    {
        "keyword": "401",
        "category": "Authentication Failure",
        "severity": "High",
        "suggestion": "Verify authentication credentials and API tokens."
    }
]
