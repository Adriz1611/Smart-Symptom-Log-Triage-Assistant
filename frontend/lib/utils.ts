export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getSeverityColor(severity: number): string {
  if (severity <= 3) return 'text-green-600 bg-green-50';
  if (severity <= 6) return 'text-yellow-600 bg-yellow-50';
  if (severity <= 8) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'EMERGENCY':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'URGENT':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'SEMI_URGENT':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'NON_URGENT':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'SELF_CARE':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getUrgencyLabel(urgency: string): string {
  return urgency.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-blue-100 text-blue-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    case 'IMPROVING':
      return 'bg-teal-100 text-teal-800';
    case 'WORSENING':
      return 'bg-red-100 text-red-800';
    case 'MONITORING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
