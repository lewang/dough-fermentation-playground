// Simple drag and drop utilities
export function reorderArray(array, fromIndex, toIndex) {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function createDragHandlers(items, setItems) {
  let draggedIndex = null;

  const handleDragStart = (index) => (e) => {
    draggedIndex = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '';
    draggedIndex = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (index) => (e) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newItems = reorderArray(items, draggedIndex, index);
      setItems(newItems);
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  };
}