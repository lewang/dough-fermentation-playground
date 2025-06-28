// Utility functions for step management

/**
 * Parse group ID and title from a step name
 * Pattern: "groupId. title" -> { groupId: "groupId", title: "title" }
 * If no match, returns { groupId: null, title: originalName }
 * 
 * @param {string} name - The full step name
 * @returns {Object} - { groupId: string|null, title: string }
 */
export function parseStepName(name) {
  const match = name.match(/^(\w+)\.\s*(.*)/);
  
  if (match) {
    return {
      groupId: match[1],
      title: match[2]
    };
  }
  
  return {
    groupId: null,
    title: name
  };
}

/**
 * Get the group ID from a step name
 * @param {string} name - The step name
 * @returns {string|null} - The group ID or null if none
 */
export function getStepGroupId(name) {
  return parseStepName(name).groupId;
}

/**
 * Get the display title from a step name (without group ID prefix)
 * @param {string} name - The step name
 * @returns {string} - The title part
 */
export function getStepTitle(name) {
  return parseStepName(name).title;
}

/**
 * Merge group ID and title into a formatted step name
 * If groupId is provided, formats as "groupId. title"
 * If no groupId, returns just the title
 * 
 * @param {string|null} groupId - The group identifier
 * @param {string} title - The step title
 * @returns {string} - The formatted step name
 */
export function formatStepName(groupId, title) {
  if (groupId && groupId.trim()) {
    return `${groupId.trim()}. ${title}`;
  }
  return title;
}