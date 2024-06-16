const parseContactType = (contactType) => {
    const isString = typeof contactType === "string";
    if (!isString) return;
    const isContactType = (contactType) => ['work', 'home', 'personal'].includes(contactType);

    if (isContactType(contactType)) return contactType;
};

const parseFavourite = (isFavourite) => {
    if (typeof isFavourite === "boolean") {
        return isFavourite;
    } else if (typeof isFavourite === "string") {
        return isFavourite.toLowerCase() === "true";
    }
    return false;
};

export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;

    const parsedContactType = parseContactType(contactType);
    const parsedFavourite = parseFavourite(isFavourite);

    return {
        contactType: parsedContactType,
        isFavourite: parsedFavourite,
    };
};