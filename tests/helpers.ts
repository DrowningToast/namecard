/**
 * An international number (`+66 82 ...`) or a bare 9+ digit run.
 *
 * Deliberately not the literal number — this file is committed too, so the
 * guard must describe the shape rather than restate the secret.
 *
 * Must NOT match legitimate content: the year range "2022 -- 2026", counts
 * like "5,000" and "20K+", or the preamble's "{HTML}{999999}".
 */
export const PHONE_LIKE = /\+\d[\d\s()-]{7,}\d|\d{9,}/;
