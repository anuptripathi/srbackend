export const METRIC_TEMPLATES = {
  mem: {
    fields: ['total', 'used_percent', 'available_percent'], // Only these fields will be saved
    tags: ['host'], // Only these tags will be saved
  },
  cpu: {
    fields: ['usage_active', 'usage_system', 'usage_user'], // Only these fields will be saved
    tags: ['host', 'cpu'], // Only these tags will be saved
  },
  // Add templates for other metric names as needed
};

export function transformMetric(metric: any): any {
  const template = METRIC_TEMPLATES[metric.name];

  if (!template) {
    // If no template is defined for this metric, skip it
    return null;
  }

  const transformedMetric = {
    name: metric.name,
    timestamp: metric.timestamp,
    fields: {},
    tags: {},
  };

  // Filter fields based on the template
  template.fields.forEach((field) => {
    if (metric.fields[field] !== undefined) {
      transformedMetric.fields[field] = metric.fields[field];
    }
  });

  // Filter tags based on the template
  template.tags.forEach((tag) => {
    if (metric.tags[tag] !== undefined) {
      transformedMetric.tags[tag] = metric.tags[tag];
    }
  });

  return transformedMetric;
}
