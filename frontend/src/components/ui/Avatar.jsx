import { getInitials, getAvatarColor } from '../../utils/format';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

export default function Avatar({ name, size = 'md', className = '' }) {
  return (
    <div
      className={`${sizes[size]} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
