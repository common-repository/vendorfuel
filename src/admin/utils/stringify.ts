/**
 * Stringify an object before passing as a prop to a child component, such as from Angular to React.
 *
 * @param obj
 * @return string
 */

export const stringify = (obj: any) => JSON.stringify(obj);
