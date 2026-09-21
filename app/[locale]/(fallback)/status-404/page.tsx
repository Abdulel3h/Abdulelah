import LocalizedNotFound, { generateMetadata } from "@/components/errors/LocalizedNotFound";

/**
 * Internal target for unknown URLs: the proxy rewrites them here with a 404
 * status, so the localized not-found page is fully server-rendered (a thrown
 * notFound() would only render it on the client). Never linked or indexed.
 */
export { generateMetadata };

export default LocalizedNotFound;
