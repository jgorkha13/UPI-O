export default function Badge({ status }) {
  const map = {
    COMPLETED: 'badge-success',
    PENDING: 'badge-pending',
    FAILED: 'badge-failed',
  };
  return <span className={map[status] || 'badge-pending'}>{status}</span>;
}
