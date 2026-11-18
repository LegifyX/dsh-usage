/**
 * Reader-chosen ordering for provider rows. The stored value is a
 * comma-separated provider id list; providers missing from it keep their
 * natural order after the listed ones, so a newly discovered provider lands
 * at the end instead of disappearing.
 * @module @legifyx/dsh-usage/client/order
 */
/**
 * Order rows by a stored provider id list.
 * @param rows - rows carrying a provider id.
 * @param order - comma-separated provider ids, possibly empty.
 * @returns a new array in the requested order.
 */
export declare function orderByList<T extends {
    provider: string;
}>(rows: readonly T[], order: string): T[];
