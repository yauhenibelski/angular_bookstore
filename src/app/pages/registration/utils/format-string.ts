export const formatString = (str: string): string => {
    return str.replace(/\(.+\)/, '').trim();
};
