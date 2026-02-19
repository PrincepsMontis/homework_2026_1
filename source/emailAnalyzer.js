'use strict';
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
/**
 * Анализирует строку и возвращает статистику по электронным адресам
 * @param {string} text - входная строка для анализа
 * @returns {Object} объект с полями emailCount, uniqueEmails, mostFrequentEmail
 * @example
 * // возвращает {
 * //   emailCount: 3,
 * //   uniqueEmails: ['user@example.com', 'admin@test.com'],
 * //   mostFrequentEmail: 'user@example.com'
 * // }
 * emailAnalyzer('user@example.com admin@test.com user@example.com');
 * Регулярное выражение для поиска email адресов в тексте
 * @constant {RegExp}
 * @default
 */
const emailAnalyzer = (text) => {
    // Простое регулярное выражение для поиска потенциальных email
    // Находит последовательности с @ и хотя бы одной точкой после
    const foundEmails = text.match(EMAIL_REGEX) || [];
    const validEmails = foundEmails.filter(email => {
        if (email.includes('..')) return false;
        const parts = email.split('@');
        if (parts.length !== 2) return false;
        const [localPart, domain] = parts;
        if (localPart.length === 0 || localPart.length > 64) return false;
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (domain.length === 0 || domain.length > 255) return false;
        if (domain.startsWith('.') || domain.endsWith('.')) return false;
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return false;
        for (const part of domainParts) {
            if (part.length === 0) return false;
            if (part.startsWith('-') || part.endsWith('-')) return false;
            if (!/[a-zA-Z0-9]/.test(part)) return false;
        }
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2) return false;
        if (!/^[a-zA-Z]+$/.test(tld)) return false;
        if (domain.includes('..')) return false;
        return true;
    });
    if (validEmails.length === 0) {
        return {
            emailCount: 0,
            uniqueEmails: [],
            mostFrequentEmail: ""
        };
    }
    const lowerCaseEmails = validEmails.map(email => email.toLowerCase());
    const emailFrequency = {};
    lowerCaseEmails.forEach(email => {
        emailFrequency[email] = (emailFrequency[email] || 0) + 1;
    });
    const uniqueEmails = Object.keys(emailFrequency);
    let mostFrequentEmail = "";
    let maxFrequency = 0;
    for (const [email, frequency] of Object.entries(emailFrequency)) {
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            mostFrequentEmail = email;
        }
    }
    return {
        emailCount: validEmails.length,
        uniqueEmails: uniqueEmails,
        mostFrequentEmail: mostFrequentEmail
    };
};

