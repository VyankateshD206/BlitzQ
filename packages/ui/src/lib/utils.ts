export function cn(
  ...classes: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  return classes
    .map((classItem) => {
      if (typeof classItem === 'object' && classItem !== null && !Array.isArray(classItem)) {
        return Object.entries(classItem)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return classItem;
    })
    .filter(Boolean)
    .join(' ');
}