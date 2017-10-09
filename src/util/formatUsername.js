export default function(str: ?string): ?string {
    if(typeof str !== 'string') return null;
    return str.trim().toLowerCase();
};