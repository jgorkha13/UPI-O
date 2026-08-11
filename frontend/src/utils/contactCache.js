const CACHE_KEY = 'upio_contact_cache';

export const getCachedContacts = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveContact = ({ name, phone }) => {
  if (!phone || !name) return;
  const contacts = getCachedContacts().filter((c) => c.phone !== phone);
  contacts.unshift({ name, phone, savedAt: Date.now() });
  localStorage.setItem(CACHE_KEY, JSON.stringify(contacts.slice(0, 50)));
};

export const getContactByPhone = (phone) => {
  return getCachedContacts().find((c) => c.phone === phone) || null;
};
