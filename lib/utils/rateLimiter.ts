const rateLimit = new Map<string, number[]>();

export function rateLimiter(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = rateLimit.get(identifier) || [];

    // Clean old requests
    const validRequests = requests.filter((time: number) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
        return false;
    }

    validRequests.push(now);
    rateLimit.set(identifier, validRequests);
    return true;
}

export function getRateLimitInfo(identifier: string, windowMs: number): { remaining: number; resetTime: number } {
    const now = Date.now();
    const requests = rateLimit.get(identifier) || [];
    const validRequests = requests.filter((time: number) => now - time < windowMs);

    return {
        remaining: Math.max(0, 10 - validRequests.length), // Assuming max 10 requests
        resetTime: now + windowMs
    };
} 