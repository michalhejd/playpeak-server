import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    // "block" user for 15 minutes
    windowMs: 15 * 60 * 1000,
    // limit of 750 requests per minute
    max: 750, 
    message: {message: 'Too many requests from this IP, please try again later', date: Date.now(), status: 429}
});

export const emailLimiter = rateLimit({
    // "block" user for 1 hour
    windowMs: 60 * 60 * 1000,
    // limit of 50 requests per minute
    max: 50,
    message: {message: 'Too many requests from this IP, please try again later', date: Date.now(), status: 429}
});
