function getSample(mdcontent: string): string {
  const words = mdcontent.trim().split(/\s+/).slice(0, 30);

  return words.join(" ");
}

function extractTags(mdcontent: string): string[] {
  const tags: string[] = [];
  const tagRegex = /#(\w+)/g;
  let match;

  while ((match = tagRegex.exec(mdcontent)) !== null) {
    tags.push(match[1]);
  }

  return tags;
}

const formatDateWithoutYear = (date: any) => {
  const inputDate = new Date(date.toDate());
  const today = new Date();
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(today.getDate() - 6);

  // Check if the input date is today
  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  // Check if the input date is within the last 6 days
  if (inputDate >= sixDaysAgo && inputDate < today) {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return inputDate.toLocaleDateString(undefined, options);
  }

  // Otherwise, return the formatted date
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return inputDate.toLocaleDateString(undefined, options);
};

export { getSample, extractTags, formatDateWithoutYear };
