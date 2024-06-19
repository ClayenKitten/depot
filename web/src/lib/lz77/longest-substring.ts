export default function longestSubstring(content: Buffer, search: Buffer): Match {
    let substr: Match = {
        position: 0,
        match: Buffer.alloc(0)
    };

    for (let position = content.length - 1; position >= 0; position--) {
        let offset = 0;
        while (
            position + offset < content.length &&
            offset < search.length &&
            content.at(position + offset) === search.at(offset)
        ) {
            offset++;
        }

        if (offset > substr.match.length) {
            substr = {
                position,
                match: content.subarray(position, position + offset)
            };
            if (offset === search.length) return substr;
        }
    }
    return substr;
}

type Match = {
    position: number;
    match: Buffer;
};
