/**
 * Replaces all __KEY__ placeholders in content with corresponding values from the vars object.
 *
 * @param {string} content - The file content with __PLACEHOLDER__ tokens
 * @param {Record<string, string>} vars - Key-value pairs for replacement
 * @returns {string} The content with all matching placeholders replaced
 */
function replaceVars(content, vars) {
  for (const [key, value] of Object.entries(vars)) {
    // Only match keys that look like valid env var names
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

    const placeholder = `__${key}__`;

    // Normalize escaped pipes (\|) to plain pipes (|)
    const normalized = value.replace(/\\\|/g, '|');

    // Use split/join instead of RegExp to avoid escaping issues with special chars in the value
    content = content.split(placeholder).join(normalized);
  }

  return content;
}

module.exports = { replaceVars };
